import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../AuthContext';
import GlobalApiState from '../utilis/globalVariable';
import TestSelector from '../components/AddPatientForm/TestSelector';
import PatientDetails from '../components/AddPatientForm/PatientDetails';

export default function PatientForm() {
    const [error, setError] = useState({});
    const authContext = useContext(AuthContext);
    const [testOptions, setTestOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState({
        userId: authContext.user,
        patient_name: "",
        refer_by: "",
        patient_age: "",
        lab_no: "",
        phone_number: "",
        specimen: "",
        patient_bill: "",
        date: new Date().toISOString().split("T")[0],
        test_type: [],
    });
    const [totalTestPrice, setTotalTestPrice] = useState(0);
    const params = useParams();
    const navigate = useNavigate();

    // -------------------- Fetch Data --------------------
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                // Fetch parent tests
                const testResponse = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/listing_test/${authContext.user}`);
                const testData = await testResponse.json();

                // Map tests
                const options = await Promise.all(testData.map(async item => {
                    if (item.type === 'group') {
                        // Fetch subtests for group
                        const subRes = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/${item._id}/subtests`);
                        const subtests = await subRes.json();
                        return {
                            value: item.test_name,
                            label: item.test_name,
                            id: item._id,
                            type: item.type,
                            subtests
                        };
                    }
                    return {
                        value: item.test_name,
                        label: item.test_name,
                        id: item._id,
                        type: item.type,
                        min_value: item.min_value,
                        max_value: item.max_value,
                        price: item.price
                    };
                }));
                setTestOptions(options);

                // If editing patient
                if (params.id) {
                    const patientResponse = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/patient/edit_patient/${params.id}`);
                    const patientData = await patientResponse.json();
                    const selectedTests = patientData.test_type.map(test => {
                        const matchedOption = options.find(
                            option => option.id === test.test
                        );

                        if (!matchedOption) return null;

                        return {
                            ...matchedOption,
                            result: test.result || "",
                            selectedSubtests: matchedOption.subtests
                                ?.map(sub => {
                                    const matchedSub = test.subtests?.find(
                                        st => st.subtest?.toString() === sub._id?.toString()
                                    );

                                    return matchedSub
                                        ? { ...sub, result: matchedSub.result }
                                        : null;
                                })
                                .filter(Boolean)
                        };
                    }).filter(Boolean);

                    setPatients({ ...patientData, test_type: selectedTests, date: new Date(patientData.date).toISOString().split("T")[0] });
                }

            } catch (err) {
                console.error("Error loading data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [authContext.user, params.id]);

    // -------------------- Handlers --------------------
    const handleInputChange = (key, value) => {
        setPatients(prev => ({ ...prev, [key]: value }));
        setError(prev => ({ ...prev, [key]: "" }));
    };

    const handleTestTypeChange = selectedTests => {
        setPatients(prev => ({
            ...prev,
            test_type: selectedTests.map(test => {
                const existing = prev.test_type.find(t => t.id === test.id);
                return { ...test, selectedSubtests: existing ? existing.selectedSubtests : [] };
            })
        }));
    };

    const handleSubtestChange = (testId, selectedSubs) => {
        setPatients(prev => ({
            ...prev,
            test_type: prev.test_type.map(test => {
                if (test.id !== testId) return test;

                return {
                    ...test,
                    selectedSubtests: selectedSubs.map(opt => {
                        // check if this subtest already exists
                        const existing = test.selectedSubtests?.find(
                            sub => sub._id === opt.value
                        );

                        // keep old result if exists
                        if (existing) return existing;

                        // otherwise add new subtest
                        const fullSub = test.subtests.find(s => s._id === opt.value);
                        return { ...fullSub, result: "" };
                    })
                };
            })
        }));
    };


    const handleResultChange = (testId, result) => {
        setPatients(prev => ({
            ...prev,
            test_type: prev.test_type.map(test => test.id === testId ? { ...test, result } : test)
        }));
    };

    const handleSubtestResultChange = (testId, subtestId, newResult) => {
        setPatients(prev => ({
            ...prev,
            test_type: prev.test_type.map(test =>
                test.id === testId
                    ? { ...test, selectedSubtests: test.selectedSubtests.map(sub => sub._id === subtestId ? { ...sub, result: newResult } : sub) }
                    : test
            )
        }));
    };

    // -------------------- Total Price --------------------
    useEffect(() => {
        const totalPrice = patients.test_type.reduce((sum, test) => {
            if (test.subtests && test.selectedSubtests.length > 0) {
                return sum + test.selectedSubtests.reduce((subSum, sub) => {
                    const subtestData = test.subtests.find(s => s._id === sub.subtest);
                    return subSum + (subtestData?.price || 0);
                }, 0);
            } else return sum + (test.price || 0);
        }, 0);

        setTotalTestPrice(totalPrice);
        setPatients(prev => ({ ...prev, patient_bill: totalPrice }));
    }, [patients.test_type]);

    const savePatient = async () => {
        try {
            const formattedTestType = patients.test_type.map(item => {
                const isGroup = item.type === "group";

                return {
                    test: item.test || item.id || item._id,
                    result: item.result || "",
                    subtests: isGroup
                        ? (item.selectedSubtests || []).map(st => ({
                            subtest: st._id,
                            result: st.result || ""
                        }))
                        : []
                };
            });

            const isEdit = Boolean(params.id);

            // 🔹 EDIT MODE → just update patient
            if (isEdit) {
                const response = await fetch(
                    `${GlobalApiState.DEV_BASE_LIVE}/api/patient/update_patient/${params.id}`,
                    {
                        method: "PUT",
                        headers: { "Content-type": "application/json" },
                        // body: JSON.stringify(patients),
                        body: JSON.stringify({
                            ...patients,
                            test_type: formattedTestType,
                        }),
                    }
                );

                if (!response.ok) {
                    toast.error("Failed to update patient");
                    return;
                }

                toast.success("Patient Updated Successfully");
                setTimeout(() => navigate("/"), 1000);
                return;
            }

            const counterRes = await fetch(
                `${GlobalApiState.DEV_BASE_LIVE}/api/counter/next/${authContext.user}?type=Lab`,
                { method: "POST" }
            );

            const counterData = await counterRes.json();

            if (!counterRes.ok) {
                toast.error("Failed to generate Lab Number");
                return;
            }


            // const formattedTestType = patients.test_type.map(item => ({
            //     test: item.id,
            //     result: item.result || "",
            //     subtests: item.selectedSubtests.map(st => ({
            //         subtest: st._id,
            //         result: st.result || ""
            //     }))
            // }));


            // 🔹 Save patient with FINAL lab number
            const response = await fetch(
                `${GlobalApiState.DEV_BASE_LIVE}/api/patient/add-patient`,
                {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify({
                        ...patients,
                        test_type: formattedTestType,
                    }),
                }
            );

            if (!response.ok) {
                toast.error("Failed to save patient");
                return;
            }

            toast.success("Patient Added Successfully");
            setTimeout(() => navigate("/"), 1000);

        } catch (err) {
            toast.error(`Error: ${err.message}`);
            console.error(err);
        }
    };


    useEffect(() => {
        const fetchLabCounter = async () => {
            if (!params.id) {
                try {
                    const res = await fetch(
                        `${GlobalApiState.DEV_BASE_LIVE}/api/counter/next/${authContext.user}?type=Lab`
                    );
                    const data = await res.json();
                    setPatients(prev => ({
                        ...prev,
                        lab_no: data.count
                    }));
                } catch (error) {
                    console.error("Failed to fetch lab counter:", error);
                }
            }
        };

        fetchLabCounter();
    }, [authContext.user]);


    return (
        <div className="flex items-center justify-center lg:w-[80vw] w-[90vw] min-h-[90vh] bg-gray-100">
            <div className="flex items-center justify-center lg:w-[60vw] w-full">

                <div className="lg:w-[100vw] overflow-y-auto w-full h-[90vh] mx-auto mt-8 mb-4 bg-white shadow-md rounded-lg flex flex-col">

                    <h3 className="px-4 py-4 text-lg font-semibold leading-6 text-gray-900 border-b">
                        {params.id ? "Edit Patient" : "Add Patient"}
                    </h3>

                    <div className="flex-1 p-4 ">
                        {loading ? (
                            <div className="spinner-container">
                                <div className="spinner"></div>
                            </div>
                        ) : (
                            <form className="flex flex-col gap-4">
                                <PatientDetails
                                    patients={patients}
                                    error={error}
                                    handleInputChange={handleInputChange}
                                />

                                <TestSelector
                                    testOptions={testOptions}
                                    selectedTests={patients.test_type}
                                    onChange={handleTestTypeChange}
                                    handleSubtestChange={handleSubtestChange}
                                    handleResultChange={handleResultChange}
                                    handleSubtestResultChange={handleSubtestResultChange}
                                    totalTestPrice={totalTestPrice}
                                />
                            </form>
                        )}
                    </div>

                    <div className="sticky bottom-0 flex justify-end gap-3 px-4 py-3 bg-white border-t">
                        <button
                            type="button"
                            className="inline-flex justify-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="inline-flex justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-500"
                            onClick={savePatient}
                        >
                            {params.id ? "Update Patient" : "Save Patient"}
                        </button>
                    </div>

                    <ToastContainer />
                </div>
            </div>
        </div>

    );
}
