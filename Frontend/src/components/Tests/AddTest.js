import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { Fragment, useContext, useRef, useState } from 'react';
import AuthContext from '../../AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalApiState from '../../utilis/globalVariable';

export default function AddTest({ addTestModel, handlePageUpdate, units }) {
    const [open, setOpen] = useState(true);
    const cancelButtonRef = useRef(null);
    const authContext = useContext(AuthContext);
    // Test state with subtests
    const [test, setTest] = useState({
        userId: authContext.user,
        test_name: "",
        min_value: "",
        max_value: "",
        unit: "",
        price: "",
        subtests: [],
    });

    const [error, setError] = useState({});

    // Handle main test input changes
    const handleInputChange = (key, value) => {
        setTest((prevTest) => ({
            ...prevTest,
            [key]: value,
        }));

        if (value.trim()) {
            setError((prevError) => ({
                ...prevError,
                [key]: "",
            }));
        }
    };

    // Handle subtest input changes
    const handleSubtestChange = (index, key, value) => {
        const updatedSubtests = [...test.subtests];
        updatedSubtests[index][key] = value;

        if (key === "price") {
            const totalSubtestPrice = updatedSubtests.reduce((sum, sub) => sum + Number(sub.price || 0), 0);
            setTest((prevTest) => ({
                ...prevTest,
                price: totalSubtestPrice,
                subtests: updatedSubtests,
            }));
        } else {
            setTest((prevTest) => ({
                ...prevTest,
                subtests: updatedSubtests,
            }));
        }
    };

    // Add a new subtest
    const addSubtest = () => {
        setTest((prevTest) => ({
            ...prevTest,
            subtests: [...prevTest.subtests, { min_value: "", max_value: "", price: "" }],
        }));
    };

    // Remove a subtest
    const removeSubtest = (index) => {
        const updatedSubtests = test?.subtests?.filter((_, i) => i !== index);
        const totalSubtestPrice = updatedSubtests.reduce((sum, sub) => sum + Number(sub.price || 0), 0);

        setTest((prevTest) => ({
            ...prevTest,
            price: totalSubtestPrice,
            subtests: updatedSubtests,
        }));
    };

    const validateFields = () => {
        const newErrors = {};
        if (!test.test_name.trim()) newErrors.test_name = "Test Name is required";
        if (!test.min_value.trim()) newErrors.min_value = "Min Value is required";
        if (!test.max_value.trim()) newErrors.max_value = "Max Value is required";
        if (!test.unit.trim()) newErrors.unit = "Unit is required";
        if (!test.price.trim()) newErrors.price = "Price is required";

        test.subtests.forEach((sub, index) => {
            if (!sub.min_value.trim()) newErrors[`subtest_min_${index}`] = "Min Value is required";
            if (!sub.max_value.trim()) newErrors[`subtest_max_${index}`] = "Max Value is required";
            if (!sub.price.trim()) newErrors[`subtest_price_${index}`] = "Price is required";
        });

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    // Function to add test with subtests
    const addTest = async () => {
        if (!validateFields()) {
            return;
        }
        try {
            const response = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/add-test`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(test),
            });

            if (response.status === 200) {
                toast.success("Test Added Successfully");
                handlePageUpdate();
                addTestModel();
            }
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        }
    };

    return (
        <>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div"
                    className="relative z-10"
                    initialFocus={cancelButtonRef}
                    onClose={setOpen}>
                    <div className="fixed inset-0 bg-black bg-opacity-50" />

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg flex flex-col max-h-[80vh]">
                            {/* Header */}
                            <div className="flex justify-between items-center border-b pb-4">
                                <h3 className="text-xl font-semibold text-gray-900">Add Test</h3>
                                <button className="text-gray-500 hover:text-gray-700" onClick={() => setOpen(false)}>
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Scrollable Form */}
                            <div className="overflow-y-auto flex-1 px-1 mt-4" style={{ maxHeight: "60vh" }}>
                                <form className="space-y-4">
                                    {/* Test Name */}
                                    <div className="space-y-2">
                                        <label className="block text-gray-700">Test Name</label>
                                        <input
                                            type="text"
                                            className="w-full rounded border p-2"
                                            value={test.test_name}
                                            onChange={(e) => handleInputChange("test_name", e.target.value)}
                                        />
                                        {error.test_name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {error.test_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Min & Max Values */}
                                    {test?.subtests?.length > 0 ? null : (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-gray-700">Min Value</label>
                                                <input
                                                    type="number"
                                                    className="w-full rounded border p-2"
                                                    value={test.min_value}
                                                    onChange={(e) => handleInputChange("min_value", e.target.value)}
                                                />
                                                {error.min_value && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {error.min_value}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-gray-700">Max Value</label>
                                                <input
                                                    type="number"
                                                    className="w-full rounded border p-2"
                                                    value={test.max_value}
                                                    onChange={(e) => handleInputChange("max_value", e.target.value)}
                                                />
                                                {error.max_value && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {error.max_value}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}


                                    {/* Price */}
                                    <div>
                                        <label className="block text-gray-700">Price</label>
                                        <input
                                            type="number"
                                            className="w-full rounded border p-2"
                                            value={test.price}
                                            onChange={(e) => handleInputChange("price", e.target.value)}
                                        />
                                        {error.price && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {error.price}
                                            </p>
                                        )}
                                    </div>

                                    {/* Unit Selection */}
                                    <div>
                                        <label className="block text-gray-700">Unit</label>
                                        <select
                                            className="w-full rounded border p-2"
                                            value={test.unit}
                                            onChange={(e) => handleInputChange("unit", e.target.value)}
                                        >
                                            <option value="">Select Unit</option>
                                            {units?.map((unit, index) => (
                                                <option key={index} value={unit?._id}>{unit?.unit_name}</option>
                                            ))}
                                        </select>
                                        {error.unit && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {error.unit}
                                            </p>
                                        )}
                                    </div>

                                    {/* Subtests */}
                                    {test?.subtests?.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="text-lg font-semibold text-gray-900">Subtests</h4>
                                            {test?.subtests?.map((sub, index) => (
                                                <div key={index} className="flex gap-2 items-start mt-2">
                                                    <div className="w-1/4">
                                                        <input
                                                            type="text"
                                                            placeholder="Name"
                                                            className="w-full rounded border p-2"
                                                            value={sub.test_name}
                                                            onChange={(e) => handleSubtestChange(index, "test_name", e.target.value)}
                                                        />
                                                        {error.test_name && (
                                                            <p className="mt-1 text-sm text-red-600">{error.test_name}</p>
                                                        )}
                                                    </div>
                                                    <div className="w-1/4">
                                                        <input
                                                            type="number"
                                                            placeholder="Min"
                                                            className="w-full rounded border p-2"
                                                            value={sub.min_value}
                                                            onChange={(e) => handleSubtestChange(index, "min_value", e.target.value)}
                                                        />
                                                        {error.min_value && (
                                                            <p className="mt-1 text-sm text-red-600">{error.min_value}</p>
                                                        )}
                                                    </div>
                                                    <div className="w-1/4">
                                                        <input
                                                            type="number"
                                                            placeholder="Max"
                                                            className="w-full rounded border p-2"
                                                            value={sub.max_value}
                                                            onChange={(e) => handleSubtestChange(index, "max_value", e.target.value)}
                                                        />
                                                        {error.max_value && (
                                                            <p className="mt-1 text-sm text-red-600">{error.max_value}</p>
                                                        )}
                                                    </div>
                                                    <div className="w-1/4">
                                                        <input
                                                            type="number"
                                                            placeholder="Price"
                                                            className="w-full rounded border p-2"
                                                            value={sub.price}
                                                            onChange={(e) => handleSubtestChange(index, "price", e.target.value)}
                                                        />
                                                        {error.price && (
                                                            <p className="mt-1 text-sm text-red-600">{error.price}</p>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSubtest(index)}
                                                        className="text-red-500 hover:text-red-700 self-center"
                                                    >
                                                        X
                                                    </button>
                                                </div>

                                            ))}
                                        </div>
                                    )}
                                </form>
                            </div>

                            {/* Buttons - Fixed at Bottom */}
                            <div className="flex justify-between items-center mt-4 border-t pt-4">
                                <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded" onClick={addSubtest}>
                                    <PlusIcon className="w-5 h-5 inline-block mr-1" /> Add Subtest
                                </button>
                                <button type="button" className="px-4 py-2 bg-green-500 text-white rounded" onClick={() => addTest(test)}>
                                    Submit
                                </button>
                            </div>
                        </Dialog.Panel>

                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}
