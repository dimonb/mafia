import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Compile the production modules with the project's existing TypeScript dependency.
const output = mkdtempSync(join(resolve('node_modules'), '.mafia-tests-'));
writeFileSync(join(output, 'package.json'), '{"type":"commonjs"}');
after(() => rmSync(output, { recursive: true, force: true }));
const program = ts.createProgram([
  'src/state/gameSettings.ts',
  'src/state/gameReducer.ts',
  'src/components/RoleCard.tsx',
], {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.CommonJS,
  jsx: ts.JsxEmit.ReactJSX,
  rootDir: resolve('src'),
  outDir: output,
  strict: true,
  skipLibCheck: true,
  types: [],
  ignoreDeprecations: '6.0',
});
assert.deepEqual(ts.getPreEmitDiagnostics(program), [], 'production modules must type-check');
program.emit();
const require = createRequire(import.meta.url);
const { GAME_SETTINGS_KEY, loadGameSettings, saveGameSettings } = require(join(output, 'state/gameSettings.js'));
const { createInitialState, gameReducer } = require(join(output, 'state/gameReducer.js'));
const { ALL_ROLE_IDS, getDefaultRoleCounts, ROLE_DEFINITIONS } = require(join(output, 'constants/roles.js'));
const { default: RoleCard } = require(join(output, 'components/RoleCard.js'));

function settings(playerCount = 10) {
  const counts = getDefaultRoleCounts(playerCount);
  return { playerCount, roleCounts: ALL_ROLE_IDS.map((roleId) => ({ roleId, count: counts[roleId] })) };
}

function storageWith(value) {
  let stored = value;
  return {
    getItem(key) { assert.equal(key, GAME_SETTINGS_KEY); return stored; },
    setItem(key, value) { assert.equal(key, GAME_SETTINGS_KEY); stored = value; },
  };
}

function saved(overrides = {}) {
  return { version: 1, ...settings(), ...overrides };
}

test('first visit uses a fresh six-player setup', () => {
  const first = createInitialState(loadGameSettings(storageWith(null)));
  assert.equal(first.playerCount, 6);
  assert.equal(first.phase, 'setup');
  assert.equal(first.roleCounts.reduce((sum, role) => sum + role.count, 0), 6);
  assert.notEqual(first.roleCounts, createInitialState().roleCounts);
});

test('settings round-trip, including manual and unfinished role choices', () => {
  const value = settings(9);
  value.roleCounts.find((role) => role.roleId === 'lucky').count = 2;
  value.roleCounts.find((role) => role.roleId === 'maniac').count = 1;
  const storage = storageWith(null);
  saveGameSettings(value, storage);
  assert.deepEqual(loadGameSettings(storage), value);
});

test('saves only player count and role counts, never dealt roles or game progress', () => {
  const value = { ...createInitialState(settings()), phase: 'game', players: [{ id: 1, roleId: 'mafia', isAlive: false }], dayNumber: 4 };
  value.roleCounts[0].privateData = 'must not persist';
  const storage = storageWith(null);
  saveGameSettings(value, storage);
  const parsed = JSON.parse(storage.getItem(GAME_SETTINGS_KEY));
  assert.deepEqual(Object.keys(parsed).sort(), ['playerCount', 'roleCounts', 'version']);
  for (const role of parsed.roleCounts) assert.deepEqual(Object.keys(role).sort(), ['count', 'roleId']);
});

for (const raw of ['{', 'null', '[]', 'true', '1', '"text"', '{}', JSON.stringify(saved({ version: 2 }))]) {
  test(`invalid stored shape falls back safely: ${raw.slice(0, 24)}`, () => {
    assert.equal(loadGameSettings(storageWith(raw)), null);
  });
}

for (const playerCount of [3, 21, -1, 6.5, '6', null]) {
  test(`rejects invalid player count ${JSON.stringify(playerCount)}`, () => {
    assert.equal(loadGameSettings(storageWith(JSON.stringify(saved({ playerCount })))), null);
  });
}

for (const count of [-1, 21, 1.5, '2', null]) {
  test(`rejects invalid role count ${JSON.stringify(count)}`, () => {
    const value = saved();
    value.roleCounts[0].count = count;
    assert.equal(loadGameSettings(storageWith(JSON.stringify(value))), null);
  });
}

for (const [name, change] of [
  ['missing role', (value) => value.roleCounts.pop()],
  ['duplicate role', (value) => { value.roleCounts[0] = value.roleCounts[1]; }],
  ['unknown role', (value) => { value.roleCounts[0].roleId = 'unknown'; }],
  ['null role', (value) => { value.roleCounts[0] = null; }],
  ['missing role counts', (value) => { delete value.roleCounts; }],
]) {
  test(`rejects ${name}`, () => {
    const value = saved();
    change(value);
    assert.equal(loadGameSettings(storageWith(JSON.stringify(value))), null);
  });
}

test('accepts any role ordering and normalizes it to the UI order', () => {
  const value = saved();
  value.roleCounts.reverse();
  assert.deepEqual(loadGameSettings(storageWith(JSON.stringify(value))), settings());
});

test('blocked reads, blocked writes, and unavailable window do not break the game', () => {
  assert.equal(loadGameSettings({ getItem() { throw new Error('blocked'); } }), null);
  assert.doesNotThrow(() => saveGameSettings(settings(), { setItem() { throw new Error('quota'); } }));
  assert.equal(loadGameSettings(), null);
  assert.doesNotThrow(() => saveGameSettings(settings()));
});

test('blocked localStorage property access does not break the game', () => {
  globalThis.window = Object.defineProperty({}, 'localStorage', { get() { throw new Error('blocked'); } });
  try {
    assert.equal(loadGameSettings(), null);
    assert.doesNotThrow(() => saveGameSettings(settings()));
  } finally {
    delete globalThis.window;
  }
});

test('reload restores settings and always starts at setup without revealing roles', () => {
  const storage = storageWith(null);
  saveGameSettings(settings(), storage);
  const state = createInitialState(loadGameSettings(storage));
  assert.deepEqual(state, { ...createInitialState(), ...settings() });
});

test('New Game keeps manual settings and clears all round state', () => {
  let state = createInitialState(settings());
  state = gameReducer(state, { type: 'SET_ROLE_COUNT', roleId: 'lucky', count: 1 });
  const before = { playerCount: state.playerCount, roleCounts: state.roleCounts };
  state = { ...state, phase: 'game', players: [{ id: 1, roleId: 'mafia', isAlive: false }], isRevealing: true, currentDealingIndex: 8, currentDayNightPhase: 'night', dayNumber: 5, winner: 'mafia' };
  const reset = gameReducer(state, { type: 'RESET_GAME' });
  assert.deepEqual(reset, createInitialState(before));
  assert.notEqual(reset.roleCounts, before.roleCounts);
});

for (let count = 4; count <= 20; count++) {
  test(`changing to ${count} players produces a playable distribution`, () => {
    let state = createInitialState(settings(count === 20 ? 4 : 20));
    state = gameReducer(state, { type: 'SET_ROLE_COUNT', roleId: 'maniac', count: 20 });
    state = gameReducer(state, { type: 'SET_PLAYER_COUNT', count });
    const counts = Object.fromEntries(state.roleCounts.map((role) => [role.roleId, role.count]));
    const mafia = counts.mafia + counts.don + counts.werewolf;
    assert.equal(state.playerCount, count);
    assert.equal(state.roleCounts.reduce((sum, role) => sum + role.count, 0), count);
    assert.ok(state.roleCounts.every((role) => Number.isInteger(role.count) && role.count >= 0));
    assert.ok(mafia >= 1 && mafia < count - mafia);
    assert.equal(counts.sheriff, 1);
    assert.equal(counts.doctor, count >= 6 ? 1 : 0);
    assert.equal(counts.don, count >= 7 ? 1 : 0);
    assert.equal(counts.maniac, 0);
    const dealing = gameReducer(state, { type: 'START_DEALING' });
    assert.equal(dealing.phase, 'dealing');
    assert.equal(dealing.players.length, count);
    assert.equal(gameReducer(dealing, { type: 'TOGGLE_PLAYER_ALIVE', playerId: -1 }).winner, null);
    const storage = storageWith(null);
    saveGameSettings(state, storage);
    assert.deepEqual(loadGameSettings(storage), { playerCount: count, roleCounts: state.roleCounts });
  });
}

test('Don is included in the mafia total for the ten-player preset', () => {
  assert.deepEqual(getDefaultRoleCounts(10), {
    civilian: 5, mafia: 2, don: 1, sheriff: 1, doctor: 1,
    lucky: 0, maniac: 0, suicide_bomber: 0, werewolf: 0, lawyer: 0,
  });
});

test('manual customization survives unchanged player count and reload', () => {
  let state = createInitialState(settings(10));
  state = gameReducer(state, { type: 'SET_ROLE_COUNT', roleId: 'civilian', count: 4 });
  state = gameReducer(state, { type: 'SET_ROLE_COUNT', roleId: 'lucky', count: 1 });
  assert.equal(gameReducer(state, { type: 'SET_PLAYER_COUNT', count: 10 }), state);
  const storage = storageWith(null);
  saveGameSettings(state, storage);
  assert.deepEqual(createInitialState(loadGameSettings(storage)), state);
});

test('player count remains bounded by the supported four to twenty range', () => {
  assert.equal(gameReducer(createInitialState(), { type: 'SET_PLAYER_COUNT', count: 1 }).playerCount, 4);
  assert.equal(gameReducer(createInitialState(), { type: 'SET_PLAYER_COUNT', count: 100 }).playerCount, 20);
});

test('every secret role card has identical colors, styling, and a shared neutral icon', () => {
  const classSignature = (html) => [...html.matchAll(/class="([^"]*)"/g)].map((match) => match[1]);
  const baseline = renderToStaticMarkup(createElement(RoleCard, { roleId: 'civilian', revealed: true }));
  for (const roleId of ALL_ROLE_IDS) {
    const html = renderToStaticMarkup(createElement(RoleCard, { roleId, revealed: true }));
    assert.deepEqual(classSignature(html), classSignature(baseline), roleId);
    assert.ok(html.includes(ROLE_DEFINITIONS[roleId].name), 'role remains readable');
    assert.ok(html.includes(ROLE_DEFINITIONS[roleId].description), 'role instructions remain readable');
    assert.ok(!html.includes(ROLE_DEFINITIONS[roleId].icon), 'no role-specific colored emoji');
    assert.equal((html.match(/🎭/g) ?? []).length, 2);
    assert.equal((html.match(/grayscale/g) ?? []).length, 2);
  }
});

test('face-down cards use the same presentation for every role', () => {
  const back = (roleId) => renderToStaticMarkup(createElement(RoleCard, { roleId, revealed: false })).split('card-front')[0];
  for (const roleId of ALL_ROLE_IDS) assert.equal(back(roleId), back('civilian'));
});
