// import { Dialog, Transition } from '@headlessui/react';
// import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
// import React, { Fragment, useContext, useRef, useState, useEffect } from 'react';
// import AuthContext from '../../AuthContext';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import GlobalApiState from '../../utilis/globalVariable';

// export default function EditTest({ editTestModel, handlePageUpdate, testData, units }) {
//     const [open, setOpen] = useState(true);
//     const authContext = useContext(AuthContext);
//         const cancelButtonRef = useRef(null);

//     const [test, setTest] = useState({
//         userId: AuthContext.user,
//         test_name: testData.test_name,
//         min_value: testData.min_value,
//         max_value: testData.max_value,
//         unit: testData.unit._id,
//         price: testData.price,
//         subtests: testData.subtests,
//     });


//     const [error, setError] = useState({});

//     // Handle main test input changes
//     const handleInputChange = (key, value) => {
//         setTest((prevTest) => ({
//             ...prevTest,
//             [key]: value,
//         }));

//         if (value.trim()) {
//             setError((prevError) => ({
//                 ...prevError,
//                 [key]: "",
//             }));
//         }
//     };

//     // Handle subtest input changes
//     const handleSubtestChange = (index, key, value) => {
//         const updatedSubtests = [...test.subtests];
//         updatedSubtests[index][key] = value;
//         if (key === "price") {
//             const totalSubtestPrice = updatedSubtests.reduce((sum, sub) => sum + Number(sub.price || 0), 0);
//             setTest((prevTest) => ({
//                 ...prevTest,
//                 price: totalSubtestPrice,
//                 subtests: updatedSubtests,
//             }));
//         } else {
//             setTest((prevTest) => ({
//                 ...prevTest,
//                 subtests: updatedSubtests,
//             }));
//         }
//     };

//     // Add a new subtest
//     const addSubtest = () => {
//         const newSubtest = { name: "", min_value: "", max_value: "", price: "" };
//         setTest((prevTest) => ({
//             ...prevTest,
//             subtests: [...prevTest.subtests, newSubtest],
//         }));
//     };

//     // Remove a subtest
//     const removeSubtest = (index) => {
//         const updatedSubtests = test.subtests.filter((_, i) => i !== index);
//         setTest((prevTest) => ({
//             ...prevTest,
//             subtests: updatedSubtests,
//         }));
//     };

//     // Validate before saving
//     const validateBeforeSave = () => {
//         if (test.subtests.length === 0) {
//             if (!test.min_value || !test.max_value || !test.price) {
//                 toast.error("Please provide Min Value, Max Value, and Price for a simple test.");
//                 return false;
//             }
//         }
//         return true;
//     };

//     // Save changes
//     const updateTest = async () => {
//         // Create a copy of the test object
//         let updatedTest = { ...test };

//         // If subtests exist, set min_value and max_value to null
//         if (test.subtests.length > 0) {
//             updatedTest.min_value = null;
//             updatedTest.max_value = null;
//         }

//         try {
//             const response = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/update_test/${testData._id}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(updatedTest),
//             });

//             if (response.status === 200) {
//                 toast.success("Test Updated Successfully");
//                 handlePageUpdate();
//                 editTestModel();
//             }
//         } catch (err) {
//             toast.error(`Error: ${err.message}`);
//         }
//     };
//     return (
//         <>
//             <Transition.Root show={open} as={Fragment}>
//                 <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef}
//                     onClose={setOpen}>

//                     <div className="fixed inset-0 bg-black bg-opacity-50" />
//                     <div className="fixed inset-0 flex items-center justify-center p-4">
//                         <Dialog.Panel className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
//                             {/* Header */}
//                             <div className="flex items-center justify-between pb-4 border-b">
//                                 <h3 className="text-xl font-semibold text-gray-900">Edit Test</h3>
//                                 <button className="text-gray-500 hover:text-gray-700" onClick={() => setOpen(false)}>
//                                     <XMarkIcon className="w-6 h-6" />
//                                 </button>
//                             </div>

//                             {/* Scrollable Form Container */}
//                             <div className="max-h-[70vh] overflow-y-auto mt-4">
//                                 <form className="space-y-4">
//                                     {/* Test Name */}
//                                     <div className="space-y-2">
//                                         <label className="block text-gray-700">Test Name</label>
//                                         <input
//                                             type="text"
//                                             className="w-full p-2 border rounded"
//                                             value={test.test_name}
//                                             onChange={(e) => handleInputChange("test_name", e.target.value)}
//                                         />
//                                         <div>
//                                             <label className="block text-gray-700">Price</label>
//                                             <input
//                                                 type="number"
//                                                 className="w-full p-2 border rounded"
//                                                 value={test.price}
//                                                 onChange={(e) => handleInputChange("price", e.target.value)}
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-gray-700">Unit</label>
//                                             <select
//                                                 className="w-full p-2 border rounded"
//                                                 value={test.unit}
//                                                 onChange={(e) => handleInputChange("unit", e.target.value)}
//                                             >
//                                                 <option value="">Select Unit</option>
//                                                 {units?.map((unit, index) => (
//                                                     <option key={index} value={unit?._id}>{unit?.unit_name}</option>
//                                                 ))}
//                                             </select>
//                                         </div>
//                                     </div>

//                                     {/* Subtests Section */}
//                                     {test.subtests.length > 0 && (
//                                         <div>
//                                             <h4 className="font-semibold text-gray-700">Subtests</h4>
//                                             {test.subtests.map((subtest, index) => (
//                                                 <div key={index} className="relative p-2 mb-2 border rounded">

//                                                     <div className="flex items-center gap-2 mt-2">
//                                                         <input
//                                                             type="text"
//                                                             className="w-full p-2 border rounded"
//                                                             placeholder="Subtest Name"
//                                                             value={subtest.test_name}
//                                                             onChange={(e) => handleSubtestChange(index, "test_name", e.target.value)}
//                                                         />
//                                                         <input
//                                                             type="text"
//                                                             className="w-full p-2 border rounded"
//                                                             placeholder="Min"
//                                                             value={subtest.min_value}
//                                                             onChange={(e) => handleSubtestChange(index, "min_value", e.target.value)}
//                                                         />
//                                                         <input
//                                                             type="text"
//                                                             className="w-full p-2 border rounded"
//                                                             placeholder="Max"
//                                                             value={subtest.max_value}
//                                                             onChange={(e) => handleSubtestChange(index, "max_value", e.target.value)}
//                                                         />
//                                                         <input
//                                                             type="number"
//                                                             className="w-full p-2 border rounded"
//                                                             placeholder="Price"
//                                                             value={subtest.price}
//                                                             onChange={(e) => handleSubtestChange(index, "price", e.target.value)}
//                                                         />
//                                                         <button
//                                                             type="button"
//                                                             className="text-red-500 hover:text-red-700"
//                                                             onClick={() => removeSubtest(index)}
//                                                         >
//                                                             X
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             ))}

//                                         </div>
//                                     )}

//                                     {/* Main Test Fields (if no subtests) */}
//                                     {test.subtests.length === 0 && (
//                                         <div>
//                                             <div className="grid grid-cols-2 gap-4">
//                                                 <div>
//                                                     <label className="block text-gray-700">Min Value</label>
//                                                     <input
//                                                         type="text"
//                                                         className="w-full p-2 border rounded"
//                                                         value={test.min_value}
//                                                         onChange={(e) => handleInputChange("min_value", e.target.value)}
//                                                     />
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-gray-700">Max Value</label>
//                                                     <input
//                                                         type="text"
//                                                         className="w-full p-2 border rounded"
//                                                         value={test.max_value}
//                                                         onChange={(e) => handleInputChange("max_value", e.target.value)}
//                                                     />
//                                                 </div>
//                                             </div>


//                                         </div>
//                                     )}


//                                     <div className="flex items-center justify-between pt-4 mt-4 border-t">
//                                         <button type="button" className="px-4 py-2 text-white bg-blue-500 rounded" onClick={addSubtest}>
//                                             <PlusIcon className="inline-block w-5 h-5 mr-1" /> Add Subtest
//                                         </button>
//                                         <button type="button" className="px-4 py-2 text-white bg-green-500 rounded" onClick={updateTest}>
//                                             Submit
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </Dialog.Panel>
//                     </div>
//                 </Dialog>
//             </Transition.Root>

//         </>
//     );
// }


import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';
import EditSimpleTestForm from './EditSimpleTestForm';
import EditGroupTestForm from './EditGroupTestForm';

export default function EditTestModal({ open, onClose, testData, units , handlePageUpdate }) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-xl p-6 bg-white rounded shadow">

            {testData.type === 'simple' && (
              <EditSimpleTestForm
                test={testData}
                units={units}
                onClose={onClose}
                handlePageUpdate={handlePageUpdate}
              />
            )}

            {testData.type === 'group' && (
              <EditGroupTestForm
                group={testData}
                units={units}
                onClose={onClose}
                handlePageUpdate={handlePageUpdate}
              />
            )}

          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
