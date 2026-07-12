import {type ConfirmModalProps} from '../types/index';

function ConfirmModal({isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel} : ConfirmModalProps){

        if(!isOpen) return null;

    return(<>
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-300 transition-all duration-150">
                    {cancelText}
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-all duration-150 cursor-pointer text-white rounded-lg border-2 border-purple-500/70">
                    {confirmText}
                </button>
            </div>
        </div>
    </div>
    </>)
}

export default ConfirmModal;