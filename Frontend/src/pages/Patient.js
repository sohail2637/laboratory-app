import React, { useContext, useEffect, useState } from 'react'
import AddCatalogue from '../components/AddCatalogue';
import { Link } from 'react-router-dom';
import { FaEye, FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import AuthContext from '../AuthContext';
import EditCatalogue from '../components/EditCatalogue';
import DeleteCataloge from '../components/DeleteCataloge';
import { ToastContainer } from 'react-toastify';
import DeletePatient from '../components/DeletePatient';

function Patient() {
    const authContext = useContext(AuthContext);

    const [showCatalogueModal, setCatalogueModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [patient, setAllPatient] = useState([]);
    const [singlePatient, setSinglePatient] = useState([]);
    const [updatePage, setUpdatePage] = useState(true);
    const [nameSearchTerm, setNameSearchTerm] = useState("");
    const [referSearchTerm, setReferSearchTerm] = useState("");
    const [phoneSearchTerm, setPhoneSearchTerm] = useState(null);
    const addCatalogueModel = () => {
        setCatalogueModal(!showCatalogueModal);
    };
    const deleteModel = () => {
        setDeleteModal(!showDeleteModal);
    };
    // const editCatalogueModel = (element) => {
    //     setEditCatalogueModal(!showEditCatalogueModal);
    //     setSinglePatient(element)
    // };
    const handlePageUpdate = () => {
        setUpdatePage(!updatePage);
    };
    const filterPatient = patient.filter((element) => {

        if (!nameSearchTerm.trim() && !referSearchTerm.trim() && !phoneSearchTerm) {
            return true;
        }
    
        const matchedName = nameSearchTerm && element.patient_name.toLowerCase().includes(nameSearchTerm.toLowerCase());
        const matchedReferBy = referSearchTerm && element.refer_by.toLowerCase().includes(referSearchTerm.toLowerCase());
        const matchedPhone = phoneSearchTerm && element.phone_number.toString().includes(phoneSearchTerm);
    
        return matchedName || matchedReferBy || matchedPhone;
    });
    
    


    const fetchCatalogeData = () => {
        fetch(`http://localhost:4000/api/patient/listing_patient/${authContext.user}`)
            .then((response) => response.json())
            .then((data) => {
                setAllPatient(data);
            })
            .catch((err) => console.log(err));
    };
    const fetchSinglePatientData = (id) => {
        fetch(`http://localhost:4000/api/patient/edit_patient/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setSinglePatient(data);
            })
            .catch((err) => console.log(err));
    };





    useEffect(() => {
        fetchCatalogeData();
    }, [updatePage]);

    return (
        <>

            <div className="col-span-12 lg:col-span-10  flex justify-center">

                <div className=" flex flex-col gap-5 w-11/12">



                    {showDeleteModal && (
                        <DeletePatient
                            deleteModel={deleteModel}
                            updatePage={updatePage}
                            setUpdatePage={setUpdatePage}
                            singlePatient={singlePatient}
                        />
                    )}
                    <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
                        <ToastContainer />
                        <div className="flex gap-4 justify-start items-start p-5 ">
                            <span className="font-bold">Patient Details</span>
                        </div>
                        <div className="flex justify-between pt-5 pb-3 px-3">
                            <div className="flex justify-center items-center px-2 border-2 rounded-md ">
                                <img
                                    alt="search-icon"
                                    className="w-5 h-5"
                                    src={require("../assets/search-icon.png")}
                                />
                                <input
                                    className="input-field border-none outline-none text-xs"
                                    type="text"
                                    placeholder="Search by name"
                                    value={nameSearchTerm}
                                    onChange={(e) => setNameSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-center items-center px-2 border-2 rounded-md ">
                                <img
                                    alt="search-icon"
                                    className="w-5 h-5"
                                    src={require("../assets/search-icon.png")}
                                />
                                <input
                                    className="input-field border-none outline-none text-xs"
                                    type="text"
                                    placeholder="Search  by  number"
                                    value={phoneSearchTerm}
                                    onChange={(e) => setPhoneSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-center items-center px-2 border-2 rounded-md ">
                                <img
                                    alt="search-icon"
                                    className="w-5 h-5"
                                    src={require("../assets/search-icon.png")}
                                />
                                <input
                                    className="input-field border-none outline-none text-xs"
                                    type="text"
                                    placeholder="Search by refer "
                                    value={referSearchTerm}
                                    onChange={(e) => setReferSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-4">
                                <Link to={"/patient-form"}>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"

                                    >
                                        Add Patient
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                            <thead>
                                <tr>
                                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                        Patient Name
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                        Phone Number
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                        Refer by
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                        Specimen
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                        Preview
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                        Edit
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                        Delete
                                    </th>
                                </tr>
                            </thead>


                            <tbody className="divide-y divide-gray-200">
                                {
                                    filterPatient.length == 0 ? (
                                        <tr>
                                            <td colSpan="4" className="whitespace-nowrap p-6 text-blue-600 text-center">
                                                Record Not Found
                                            </td>
                                        </tr>) : (

                                        filterPatient.map((element, index) => {
                                            return (
                                                <tr key={element._id}>

                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                        {element.patient_name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                        {"0" + element.phone_number }
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                        {element.refer_by}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                        {element.specimen}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                        <Link to={`/patient-preview/${element._id}`}>
                                                            <span>
                                                                <FaEye color="gray" size={22} cursor={'pointer'}
                                                                />
                                                            </span>
                                                        </Link>
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">

                                                        <Link to={`/patient-form/${element._id}`}>
                                                            <span onClick={() => {
                                                                // fetchSinglePatientData(element._id);
                                                                // editCatalogueModel(element)
                                                            }}>
                                                                <FaRegEdit color="gray" size={22} cursor={'pointer'}

                                                                />
                                                            </span>
                                                        </Link>
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">

                                                        <RiDeleteBinLine color="gray" size={22} cursor={'pointer'}
                                                            // onClick={() => deleteItem(element._id)}
                                                            onClick={() => {
                                                                fetchSinglePatientData(element._id);
                                                                deleteModel()
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })

                                    )
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Patient
