'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import SimpleTestForm from './SimpleTestForm';
import GroupTestForm from './GroupTestForm';

export default function AddTestModal({ open, onClose, units, onSuccess }) {
    const [type, setType] = useState('simple');

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                </Transition.Child>

                {/* Modal */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as="div"
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-2xl bg-white shadow-xl rounded-xl">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b">
                                <Dialog.Title className="text-lg font-semibold text-gray-800">
                                    Add Laboratory Test
                                </Dialog.Title>
                                <button
                                    onClick={onClose}
                                    className="p-1 text-gray-400 rounded-md hover:bg-gray-100 hover:text-gray-600"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-5 space-y-6">
                                {/* Test Type Switch */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Test Type
                                    </label>
                                    <div className="inline-flex p-1 border rounded-lg bg-gray-50">
                                        <button
                                            onClick={() => setType('simple')}
                                            className={`px-4 py-2 text-sm rounded-md transition ${type === 'simple'
                                                ? 'bg-white shadow text-blue-600 font-medium'
                                                : 'text-gray-600 hover:text-gray-800'
                                                }`}
                                        >
                                            Simple Test
                                        </button>
                                        <button
                                            onClick={() => setType('group')}
                                            className={`px-4 py-2 text-sm rounded-md transition ${type === 'group'
                                                ? 'bg-white shadow text-blue-600 font-medium'
                                                : 'text-gray-600 hover:text-gray-800'
                                                }`}
                                        >
                                            Group Test
                                        </button>
                                    </div>
                                </div>

                                {/* Forms */}
                                <div className="flex justify-center">
                                    <div className="w-[700px] max-w-xl p-4 border rounded-lg  bg-gray-50">
                                        {type === 'simple' && (
                                            <SimpleTestForm units={units} onSuccess={onSuccess} onClose = {onClose} />
                                        )}

                                        {type === 'group' && (
                                            <GroupTestForm units={units} onSuccess={onSuccess} onClose = {onClose} />
                                        )}
                                    </div>
                                </div>

                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
