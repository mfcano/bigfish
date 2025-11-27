import { useTheme } from "../../contexts/ThemeContext"
import { useState } from "react"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'


export default function LoanItemModal() {
  const { currentTheme, getBodyClass, getTextClass, getInputClass, getPrimaryButtonClass, getSecondaryButtonClass } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className={`text-sm px-3 py-1 rounded transition-colors ${getSecondaryButtonClass()}`}
      >
        <i className="fa-solid fa-plus mr-1"></i> Loan Item
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className={`relative transform overflow-hidden rounded-lg text-left shadow-xl sm:w-full sm:max-w-lg border  
                ${getBodyClass()}
                ${currentTheme === 'light' ? 'border-slate-200'
                : currentTheme === 'dark' ? 'bg-guild-900 border-guild-700'
                : currentTheme === 'cute' ? 'bg-[#1e1b2e] border-pink-500/30'
                : currentTheme === 'mesi' ? 'bg-[#0000FF] border-4 border-[#00FF00]'
                :'content-row border-none rounded-none p-2'}`
            }>
              <div className={`bg${getBodyClass()} px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className={`${getTextClass()} text-base font-semibold text-${getTextClass()}`}>
                      Loan an item
                    </DialogTitle>
                    <div className="mt-2">
                      <div className="flex items-center rounded-md">
                        <input
                          id="item"
                          name="item"
                          type="text"
                          placeholder="Item Name"
                          className={`${getInputClass()} ${
                            currentTheme === 'light' ? 'placeholder:text-slate-900'
                            : currentTheme === 'dark' ? 'placeholder:text-white'
                            : currentTheme === 'cute' ? 'placeholder:text-pink-50'
                            : currentTheme === 'mesi' ? 'placeholder:text-[#FFFF00] font-black tracking-tighter'
                            :'text-[#000000]'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={`ml-4 text-sm px-3 py-1 rounded transition-colors ${getPrimaryButtonClass()}`}
                >
                  Loan
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className={`text-sm px-3 py-1 rounded transition-colors ${getSecondaryButtonClass()}`}
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
