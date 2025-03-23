import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalApiState from '../../utilis/globalVariable';

export default function AddUnits({ addUnitModel, handlePageUpdate }) {
  const [open, setOpen] = useState(true);
  const [error, setErrors] = useState({});
  const cancelButtonRef = useRef(null);
  const authContext = useContext(AuthContext);

  const [units, setUnits] = useState({
    userId: authContext.user,
    unit_name: "",
    unit_abb: "",
  });

  // Function to handle input change
  const handleInputChange = (key, value) => {
    setUnits({ ...units, [key]: value });
    if (value.trim()) {
      setErrors("");
    }
  };

  const validateFields = () => {
    const fieldErrors = {};
   
    if (!units.unit_name.trim()) {
           fieldErrors.unit_name = "Name is required";

    }
    if (!units.unit_abb.trim()) {
      fieldErrors.unit_abb = "Abbrevation is required";

      }
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0
  }
  const addUnits = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      const response = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/unit/add-unit`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(units),
      });
      if (response.status == 200) {
        toast.success("Unit Added Successfully");
      }
      handlePageUpdate();
      addUnitModel();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
      console.error(err);
    }
  };

 
  return (
    <>
      {/* <ToastContainer /> */}
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg overflow-y-scroll">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                    
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
                        <Dialog.Title
                          as="h3"
                          className="text-lg  py-4 font-semibold leading-6 text-gray-900 "
                        >
                          Units
                        </Dialog.Title>
                        <form action="#">
                          <div className="flex gap-4 mb-4 items-center justify-center">
                            <div className="flex gap-4 mb-4 items-center justify-center w-full">
                             {/* name */}
                              <div>
                                <label
                                  htmlFor="unit_name"
                                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Unit Name
                                </label>
                                <input
                                  type="text"
                                  name="unit_name"
                                  id="unit_name"
                                  value={units.unit_name}
                                  onChange={(e) =>
                                    handleInputChange(e.target.name, e.target.value)
                                  }
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                  placeholder="Name"
                                />
                                {/* Error message */}
                                {error.unit_name && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {error.unit_name}
                                  </p>
                                )}
                              </div>
                              {/* abbreviation */}
                              <div>
                                <label
                                  htmlFor="unit_abb"
                                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Unit Abbreviation

                                </label>
                                <input
                                  type="text"
                                  name="unit_abb"
                                  id="unit_abb"
                                  value={units.unit_abb}
                                  onChange={(e) =>
                                    handleInputChange(e.target.name, e.target.value)
                                  }
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                  placeholder="Abbreviation"
                                />
                                {/* Error message */}
                                {error.unit_abb && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {error.unit_abb}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                      onClick={addUnits}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => addUnitModel()}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
