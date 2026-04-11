interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-xs shadow-xl">
        <p className="text-white text-center text-lg mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            className="flex-1 py-3 rounded-xl bg-slate-700 text-slate-300 font-semibold active:bg-slate-600"
            onClick={onCancel}
          >
            Отмена
          </button>
          <button
            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold active:bg-red-500"
            onClick={onConfirm}
          >
            Да
          </button>
        </div>
      </div>
    </div>
  );
}
