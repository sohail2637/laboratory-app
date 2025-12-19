import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useRef, useState } from 'react'
import GlobalApiState from '../../utilis/globalVariable';
import { toast } from 'react-toastify';

export default function DeleteTest({deleteSubTestModel , setUpdatePage , updatePage ,singleSubTest}) {
    const [open, setOpen] = useState(true);
    const cancelButtonRef = useRef(null);

    const deleteItem = async () => {
  
        try {
            const response = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/subtest/${singleSubTest._id}`, {
                method: 'DELETE'
          });
          const data = await response.json(); 
      
          setUpdatePage(!updatePage);
          toast.success("Test Delete Successfully")
        } catch (error) {
          console.error('Error deleting item:', error);
        }
      };


    return (
        <>
            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    initialFocus={cancelButtonRef}
                    onClose={setOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0 ">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                                        <p className="text-xl text-center text-gray-500">
                                            Are you sure you want to delete this SubTest?</p>
                                    </div>

                                    <div className="flex justify-end gap-4 m-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 border border-transparent rounded-md hover:bg-gray-400"
                                            ref={cancelButtonRef} 
                                            onClick={()=>deleteSubTestModel()}                                       >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600"
                                            onClick={()=>{deleteSubTestModel()
                                                deleteItem()}}
                                            ref={cancelButtonRef} 

                                        >
                                            Delete
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}
