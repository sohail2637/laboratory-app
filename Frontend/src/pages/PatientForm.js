import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../AuthContext';
import Select from 'react-select'; // Import React Select
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

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
        date: today,
        test_type: [],
    });
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {
                // Fetch test options for the dropdown
                const testResponse = await fetch(`http://localhost:4000/api/test/listing_test/${authContext.user}`);
                const testData = await testResponse.json();
                const options = testData.map((item) => ({
                    value: item.test_name,
                    label: item.test_name,
                    min_value: item.min_value,
                    max_value: item.max_value,
                    id: item._id,
                }));
                setTestOptions(options);

                // Fetch patient data if editing
                if (params.id) {
                    const patientResponse = await fetch(`http://localhost:4000/api/patient/edit_patient/${params.id}`);
                    const patientData = await patientResponse.json();

                    const selectedTests = patientData.test_type.map(test => {
                        const matchedOption = options.find(option => option.id === test.test._id);
                        return matchedOption ? { ...matchedOption, result: test.result || "" } : null;
                    })
                    const formettedDate = new Date(patientData.date).toISOString().split("T")[0]
                    setPatients({
                        ...patientData,
                        test_type: selectedTests,
                        date: formettedDate,
                    });
                }
            } catch (error) {
                console.error("Error loading data:", error);
            }
            finally {
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

    const handleTestTypeChange = (selectedOptions) => {
        const formattedTests = selectedOptions.map(option => ({
            ...option,
            result: option.result || ""
        }));
        setPatients({
            ...patients,
            test_type: formattedTests
        });
    };
    const handleResultChange = (index, value) => {
        const updatedTests = [...patients.test_type];
        updatedTests[index].result = value;
        setPatients({ ...patients, test_type: updatedTests });
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
        if(!params.id){
        if (!validateFields()) {
            return;
        }
    }   
        try {
            const endpoint = params.id
                ? `http://localhost:4000/api/patient/update_patient/${params.id}`
                : "http://localhost:4000/api/patient/add-patient";
            const method = params.id ? "PUT" : "POST";

            // Format test_type payload
            const formattedTestType = patients.test_type.map(item => {
                return {
                    test: item.id,
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

    useEffect(() => {
        fetch(`http://localhost:4000/api/test/listing_test/${authContext.user}`)
            .then((response) => response.json())
            .then((data) => {
                const options = data.map((item) => ({
                    value: item.test_name,
                    label: item.test_name,
                    min_value: item.min_value,
                    max_value: item.max_value,
                    id: item._id,

                }));
                setTestOptions(options);
            })
            .catch((err) => console.log(err));
    }, [authContext.user]);

    return (
        <div className="flex items-center justify-center w-[80vw] min-h-[100vh] bg-gray-100">

            <div className="flex items-center justify-center md:w-[60vw]">
                <div className="w-[100vw] min-h-[90vh] mx-auto mt-8 mb-4 p-4 bg-white shadow-md rounded-lg">
                    <h3 className="text-lg py-4 font-semibold leading-6 text-gray-900">{params.id ? "Edit Patient" : "Add Patient"}</h3>
                    {loading ? (
                        <div className='spinner-container'>
                            <div className='spinner'></div>
                        </div>
                    ) : (
                        <>
                            <form>
                                <div className="flex gap-4 mb-4 items-center justify-center flex-col">
                                    {/* Patient Details */}
                                    <div className="flex gap-4 mb-4 items-center justify-center w-full">
                                        <div className="w-full">
                                            <label htmlFor="patient_name" className="block mb-2 text-sm font-medium text-gray-900">Patient Name</label>
                                            <input type="text" name="patient_name" id="patient_name" value={patients.patient_name} onChange={(e) => handleInputChange(e.target.name, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Name" />
                                            {error.patient_name && <p className="mt-1 text-sm text-red-600">{error.patient_name }</p>}
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="refer_by" className="block mb-2 text-sm font-medium text-gray-900">Refer By</label>
                                            <input type="text" name="refer_by" id="refer_by" value={patients.refer_by} onChange={(e) => handleInputChange(e.target.name, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Refer by" />
                                            {error.refer_by && <p className="mt-1 text-sm text-red-600">{error.refer_by}</p>}
                                       
                                        </div>
                                    </div>

                                    {/* Additional Fields */}
                                    <div className="flex gap-4 mb-4 items-center justify-center w-full">
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

                                    <div className="flex gap-4 mb-4 items-center justify-center w-full">
                                        <div className="w-full">
                                            <label htmlFor="specimen" className="block mb-2 text-sm font-medium text-gray-900">Specimen</label>
                                            <input type="text" name="specimen" id="specimen" value={patients.specimen} onChange={(e) => handleInputChange(e.target.name, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Specimen" />
                                            {error.specimen && <p className="mt-1 text-sm text-red-600">{error.specimen }</p>}
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900">Date</label>
                                            <input type="date" name="date" id="date" value={patients.date} onChange={(e) => handleInputChange(e.target.name, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Specimen" />
                                        </div>
                                    </div>

                                    {/* Test Type - Multi Select */}
                                    <div className="w-full">
                                        <label htmlFor="test_type" className="block mb-2 text-sm font-medium text-gray-900">Test Type</label>
                                        <Select
                                            isMulti
                                            name="test_type"
                                            options={testOptions}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            onChange={handleTestTypeChange}
                                            placeholder="Select Tests"
                                            value={patients.test_type}
                                        />
                                        {patients.test_type.length > 0 && (
                                            <div className="w-full mt-4">
                                                <h4 className="text-sm font-extrabold text-gray-900">Selected Tests:</h4>
                                                <table className="mt-2 w-full text-sm text-left text-gray-500 border">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                                        <tr>
                                                            <th className="px-4 py-2 border">Test Name</th>
                                                            <th className="px-4 py-2 border">Min Value</th>
                                                            <th className="px-4 py-2 border">Max Value</th>
                                                            <th className="px-4 py-2 border">Result</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {patients.test_type.map((test, index) => (
                                                            <tr key={index} className="bg-white border-b">
                                                                <td className="px-4 py-2 border">{test.label}</td>
                                                                <td className="px-4 py-2 border">{test.min_value}</td>
                                                                <td className="px-4 py-2 border">{test.max_value}</td>
                                                                <td className="border px-4 py-2">
                                                                    <input
                                                                        type="number"
                                                                        value={test.result}
                                                                        onChange={(e) => handleResultChange(index, e.target.value)}
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                                        placeholder="Enter result"
                                                                        min={0}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
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
