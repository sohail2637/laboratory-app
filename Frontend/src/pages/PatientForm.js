import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../AuthContext';
import Select from 'react-select'; // Import React Select
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import GlobalApiState from '../utilis/globalVariable';

export default function PatientForm() {
    const [error, setError] = useState({
        patient_name: "",
        refer_by: "",
        patient_age: "",
        lab_no: "",
        phone_number: "",
        specimen: "",
    })
    const authContext = useContext(AuthContext);
    const [testOptions, setTestOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const today = new Date().toISOString().split("T")[0];
    const [patients, setPatients] = useState({
        userId: authContext.user,
        patient_name: "",
        refer_by: "",
        patient_age: "",
        lab_no: "",
        phone_number: "",
        specimen: "",
        patient_bill: "",
        date: today,
        test_type: [],
    });
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                // Fetch test options
                const testResponse = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/listing_test/${authContext.user}`);
                const testData = await testResponse.json();

                // Format test options for the Select component
                const options = testData.map((item) => ({
                    value: item.test_name,
                    label: item.test_name,
                    min_value: item.min_value,
                    max_value: item.max_value,
                    price: item.price,
                    id: item._id,
                    subtests: item.subtests || [], // Ensure subtests exist
                }));
                setTestOptions(options);

                // If editing, fetch patient data
                if (params.id) {
                    const patientResponse = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/patient/edit_patient/${params.id}`);
                    const patientData = await patientResponse.json();

                    const selectedTests = patientData.test_type.map(test => {
                        const matchedOption = options.find(option => option.id === test.test);
                        if (matchedOption) {
                            return {
                                ...matchedOption,
                                result: test.result || "",
                                selectedSubtests: matchedOption.subtests
                                    .map(subtest => {
                                        const matchedSubtest = test.subtests.find(st => st.subtest === subtest._id);
                                        return matchedSubtest
                                            ? {
                                                ...matchedSubtest,
                                                result: matchedSubtest.result || "" // Ensure result exists
                                            }
                                            : null; // Return null for unmatched subtests
                                    })
                                    .filter(Boolean), // Remove null values to prevent extra objects
                            };
                        }
                        return null;
                    }).filter(Boolean);

                    const formattedDate = new Date(patientData.date).toISOString().split("T")[0];
                    setPatients({
                        ...patientData,
                        test_type: selectedTests,
                        date: formattedDate,
                    });
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [authContext.user, params.id]);

    // Handle input changes for text fields
    const handleInputChange = (key, value) => {
        setPatients({ ...patients, [key]: value });
        setError(prevError => ({ ...prevError, [key]: "" }));
    }

    const handleTestTypeChange = (selectedTests) => {
        setPatients((prev) => {
            return {
                ...prev,
                test_type: selectedTests.map(test => {
                    const existingTest = prev.test_type.find(t => t.id === test.id);

                    return {
                        ...test,
                        selectedSubtests: existingTest ? existingTest.selectedSubtests : []
                    };
                })
            };
        });
    };



    const handleSubtestChange = (testId, selectedSubtests) => {
        setPatients((prevState) => ({
            ...prevState,
            test_type: prevState.test_type.map((test) =>
                test.id === testId
                    ? {
                        ...test,
                        selectedSubtests: selectedSubtests.map(sub => {
                            const existingSubtest = test.selectedSubtests.find(s => s.subtest === sub.value);
                            return {
                                subtest: sub.value,
                                result: existingSubtest ? existingSubtest.result : ""
                            };
                        })
                    }
                    : test
            ),
        }));
    };



    const handleResultChange = (testId, result) => {
        const updatedTests = patients.test_type.map(test =>
            test.id === testId ? { ...test, result } : test
        );

        setPatients({
            ...patients,
            test_type: updatedTests
        });
    };

    const handleSubtestResultChange = (testId, subtestId, newResult) => {
        setPatients((prevState) => {
            return {
                ...prevState,
                test_type: prevState.test_type.map((test) =>
                    test.id === testId
                        ? {
                            ...test,
                            selectedSubtests: test.selectedSubtests.map(sub =>
                                sub.subtest === subtestId
                                    ? { ...sub, result: newResult } // Only update the result
                                    : sub
                            ),
                        }
                        : test
                ),
            };
        });
    };





    const validateFields = () => {
        const newErrors = {};
        const requiredFields = ['patient_name', 'refer_by', 'patient_age', 'lab_no', 'phone_number', 'specimen'];

        requiredFields.forEach(field => {
            if (!patients[field].trim()) {
                newErrors[field] = `${field.replace('_', ' ')} is required`;
            }
        });
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Add or update patient
    const savePatient = async () => {
        if (!params.id) {
            if (!validateFields()) {
                return;
            }
        }

        try {
            const endpoint = params.id
                ? `${GlobalApiState.DEV_BASE_LIVE}/api/patient/update_patient/${params.id}`
                : `${GlobalApiState.DEV_BASE_LIVE}/api/patient/add-patient`;
            const method = params.id ? "PUT" : "POST";

            // Format test_type payload
            const formattedTestType = patients.test_type.map(item => {
                return {
                    test: item.id,
                    subtests: item.selectedSubtests,
                    result: item.result
                }
            });
            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    ...patients,
                    test_type: formattedTestType
                }),
            });

            if (response.ok) {
                toast.success(params.id ? "Patient Updated Successfully" : "Patient Added Successfully");
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                toast.error("Failed to save patient data");
            }
        } catch (err) {
            toast.error(`Error: ${err.message}`);
            console.error(err);
        }

    };

    const [totalTestPrice, setTotalTestPrice] = useState(0);

    useEffect(() => {
        const totalPrice = patients.test_type.reduce((sum, test) => {
            if (test.subtests && test.subtests.length > 0) {
                return sum + test.selectedSubtests.reduce((subSum, sub) => {
                    const subtestData = test.subtests.find(s => s._id === sub.subtest);
                    return subSum + (subtestData?.price || 0);
                }, 0);
            } else {
                return sum + (test.price || 0);
            }
        }, 0);
    
        setTotalTestPrice(totalPrice);
    
        setPatients(prev => ({
            ...prev,
            patient_bill: totalPrice
        }));
    
    }, [patients.test_type]);
    
    
    // useEffect(() => {
    //     fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/listing_test/${authContext.user}`)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             const options = data.map((item) => ({
    //                 value: item.test_name,
    //                 label: item.test_name,
    //                 min_value: item.min_value,
    //                 max_value: item.max_value,
    //                 id: item._id,
    //                 subtests: item.subtests

    //             }));
    //             setTestOptions(options);
    //         })
    //         .catch((err) => console.log(err));
    // }, [authContext.user]);

    return (
        <div className="flex items-center justify-center lg:w-[80vw] w-[90vw] min-h-[100vh] bg-gray-100">

            <div className="flex items-center justify-center lg:w-[60vw] w-full">
                <div className="lg:w-[100vw] w-full min-h-[90vh] mx-auto mt-8 mb-4 p-4 bg-white shadow-md rounded-lg">
                    <h3 className="text-lg py-4 font-semibold leading-6 text-gray-900">{params.id ? "Edit Patient" : "Add Patient"}</h3>
                    {loading ? (
                        <div className='spinner-container'>
                            <div className='spinner'></div>
                        </div>
                    ) : (
                        <>
                            <form>
                                <div className="flex gap-4  items-center justify-center flex-col">
                                    {/* Patient Details */}
                                    <div className="flex gap-4 items-center justify-center w-full">
                                        <div className="w-full">
                                            <label htmlFor="patient_name" className="block mb-2 text-sm font-medium text-gray-900">Patient Name</label>
                                            <input type="text" name="patient_name" id="patient_name" value={patients.patient_name} onChange={(e) => handleInputChange(e.target.name, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Name" />
                                            {error.patient_name && <p className="mt-1 text-sm text-red-600">{error.patient_name}</p>}
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="refer_by" className="block mb-2 text-sm font-medium text-gray-900">Refer By</label>
                                            <input type="text" name="refer_by" id="refer_by" value={patients.refer_by} onChange={(e) => handleInputChange(e.target.name, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Refer by" />
                                            {error.refer_by && <p className="mt-1 text-sm text-red-600">{error.refer_by}</p>}

                                        </div>
                                    </div>

                                    {/* Additional Fields */}
                                    <div className="flex gap-4 items-center justify-center w-full">
                                        <div className="w-full">
                                            <label htmlFor="patient_age" className="block mb-2 text-sm font-medium text-gray-900">Patient Age</label>
                                            <input type="number" name="patient_age" id="patient_age" value={patients.patient_age} onChange={(e) => handleInputChange(e.target.name, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Age" />
                                            {error.patient_age && <p className="mt-1 text-sm text-red-600">{error.patient_age}</p>}

                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="lab_no" className="block mb-2 text-sm font-medium text-gray-900">Lab Number</label>
                                            <input type="text" name="lab_no" id="lab_no" value={patients.lab_no} onChange={(e) => handleInputChange(e.target.name, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Lab No" />
                                            {error.lab_no && <p className="mt-1 text-sm text-red-600">{error.lab_no}</p>}
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-900">Phone Number</label>
                                            <input type="number" name="phone_number" id="phone_number" value={patients.phone_number} onChange={(e) => handleInputChange(e.target.name, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="number" />
                                            {error.phone_number && <p className="mt-1 text-sm text-red-600">{error.phone_number}</p>}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-center justify-center w-full">
                                        <div className="w-full">
                                            <label htmlFor="specimen" className="block text-sm font-medium text-gray-900">Specimen</label>
                                            <input type="text" name="specimen" id="specimen" value={patients.specimen} onChange={(e) => handleInputChange(e.target.name, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Specimen" />
                                            {error.specimen && <p className="mt-1 text-sm text-red-600">{error.specimen}</p>}
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-900">Date</label>
                                            <input type="date" name="date" id="date" value={patients.date} onChange={(e) => handleInputChange(e.target.name, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Specimen" />
                                        </div>
                                    </div>

                                    {/* Test Type - Multi Select */}
                                    <div className="w-full">
                                        <div className='flex justify-between items-start mb-6'>
                                            <div className='text-[16px] font-medium text-gray-800'>Selected Test</div>
                                            <div className="">
                                                Total Price:{totalTestPrice}

                                            </div>

                                        </div>

                                        <div className="space-y-4">
                                            {/* Test Type Selection */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-900">Test Type</label>
                                                <Select
                                                    isMulti
                                                    options={testOptions}
                                                    getOptionLabel={(e) => (
                                                        <div>
                                                            {e.label} <span className="text-sm text-gray-500">({e.min_value} - {e.max_value})</span>
                                                        </div>
                                                    )}
                                                    value={patients.test_type}
                                                    onChange={handleTestTypeChange}
                                                    className="mt-1"
                                                />
                                            </div>

                                            {/* Render each selected test */}
                                            {patients.test_type.map(test => (
                                                <div key={test.id} className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
                                                    <h3 className="text-md font-semibold text-gray-800">{test.label} - RS {test.price || 0}</h3>

                                                    {/* Subtest Selection */}
                                                    {test.subtests && test.subtests.length > 0 && (
                                                        <div className="mt-3">
                                                            <label className="block text-sm font-medium text-gray-900">Select Subtest for {test.label}</label>
                                                            <Select
                                                                isMulti
                                                                options={test.subtests.map(sub => ({
                                                                    value: sub._id,
                                                                    label: `${sub.test_name}  (${sub.min_value} - ${sub.max_value})`, // Display name and price
                                                                }))}
                                                                value={test.selectedSubtests.map(sub => ({
                                                                    value: sub.subtest,
                                                                    label: test.subtests.find(s => s._id === sub.subtest)?.test_name
                                                                }))}
                                                                onChange={(selectedSubtests) => handleSubtestChange(test.id, selectedSubtests)}
                                                                className="mt-1"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Render Subtest Results */}
                                                    {test.selectedSubtests && test.selectedSubtests.length > 0 && (
                                                        <div className="mt-3 space-y-2">
                                                            {test.selectedSubtests.map(subtest => (
                                                                <div key={subtest.subtest}>
                                                                    <label className="block text-sm font-medium text-gray-900">
                                                                        Enter Result for {subtest.label}:
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={subtest.result || ""}
                                                                        onChange={(e) => handleSubtestResultChange(test.id, subtest.subtest, e.target.value)}
                                                                        className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Main Test Result (Only if no subtests exist) */}
                                                    {!test.subtests?.length && (
                                                        <div className="mt-3">
                                                            <label className="block text-sm font-medium text-gray-900">
                                                                Enter Result for {test.label}:
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={test.result}
                                                                onChange={(e) => handleResultChange(test.id, e.target.value)}
                                                                className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}


                                        </div>
                                    </div>

                                </div>

                                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                        onClick={savePatient}
                                    >
                                        {params.id ? "Update Patient" : "Save Patient"}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>

                        </>
                    )}


                </div>
                <ToastContainer />
            </div>
        </div>

    );
}
