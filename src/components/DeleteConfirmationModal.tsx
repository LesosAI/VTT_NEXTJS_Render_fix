import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import * as Dialog from '@radix-ui/react-dialog'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false
}: DeleteConfirmationModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a2f3e] to-[#3a3f4e] p-6 text-left align-middle shadow-xl border border-[#4a4f5e]/30 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center border border-red-500/30">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div>
                  <Dialog.Title className="text-lg font-semibold leading-6 text-white">
                    {title}
                  </Dialog.Title>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-sm text-[#d0d0d0] leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-xl bg-[#3a3f4e]/80 hover:bg-[#4a4f5e]/80 px-4 py-2 text-sm font-medium text-[#d0d0d0] hover:text-white transition-all duration-200 border border-[#4a4f5e]/30 hover:border-[#5a5f6e]/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-2 focus:ring-offset-[#2a2f3e]"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 px-4 py-2 text-sm font-medium text-red-300 hover:text-red-200 transition-all duration-200 border border-red-500/30 hover:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2 focus:ring-offset-[#2a2f3e] disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
