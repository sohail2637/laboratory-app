import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import AuthContext from '../AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import AddTest from '../components/Tests/AddTest';
import EditTest from '../components/Tests/EditTest';
import GlobalApiState from '../utilis/globalVariable';
import DeleteTest from '../components/Tests/DeleteTest';
import AddTestModal from '../components/Tests/AddTestModal';
import EditTestModal from '../components/Tests/EditTest';

function Tests() {
  const authContext = useContext(AuthContext);

  const [showTestModel, setTestModel] = useState(false);
  const [showEditTestModel, setEditTestModel] = useState(false);
  const [showDeleteUnitModel, setDeleteUnitModel] = useState(false);
  const [tests, setAllTest] = useState([]);
  const [singleTest, setSingleTest] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [units, setAllUnits] = useState([]);
  const [showDeleteModal, setDeleteModal] = useState(false);

  const addTestModel = () => {
    setTestModel(!showTestModel);
  };

  const editTestModel = (element) => {
    setEditTestModel(!showEditTestModel);
    setSingleTest(element)
  };

  const deleteModel = (element) => {
    setDeleteModal(!showDeleteModal);
    setSingleTest(element)
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };
  const filteredCatalogue = tests?.filter((element) =>
    element?.test_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const fetchTestData = () => {
    fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/listing_test/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllTest(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.log(err));
  };

  const fetchUnitData = () => {
    fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/unit/listing_unit/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllUnits(data);
      })
      .catch((err) => console.log(err));
  };

  // const deleteItem = async (id) => {

  //   try {
  //     const response = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/delete_test/${id}`, {
  //       method: 'DELETE'
  //     });
  //     const data = await response.json();

  //     setUpdatePage(!updatePage);
  //     toast.success("Test Delete Successfully")
  //   } catch (error) {
  //     console.error('Error deleting item:', error);
  //   }
  // };


  useEffect(() => {
    fetchTestData();
    fetchUnitData()
  }, [updatePage]);

  return (
    <>

      <div className="flex justify-center col-span-12 mt-3 lg:col-span-10">

        <div className="flex flex-col w-11/12 gap-5 ">

          {/* {showTestModel && (
            // <AddTest
            //   addTestModel={addTestModel}
            //   handlePageUpdate={handlePageUpdate}
            //   units={units}
            // /> 
          )} */}

          <AddTestModal
            open={showTestModel}
            onClose={() => setTestModel(false)}
            units={units}
            onSuccess={handlePageUpdate}
          />
          {/* {showEditTestModel && (
            <EditTest
              editTestModel={editTestModel}
              handlePageUpdate={handlePageUpdate}
              testData={singleTest}
              units={units}
            />
          )} */}
          {showEditTestModel && (
            <EditTestModal
              open={showEditTestModel}
              onClose={() => setEditTestModel(false)}
              testData={singleTest}
              handlePageUpdate={handlePageUpdate}

              units={units}
            />
          )}

          {showDeleteModal && (
            <DeleteTest
              deleteModel={deleteModel}
              updatePage={updatePage}
              setUpdatePage={setUpdatePage}
              singleTest={singleTest}
            />
          )}

          <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg ">
            <ToastContainer />
            <div className="flex items-start justify-start gap-4 p-5 ">
              <span className="font-bold">Tests Detail</span>
            </div>
            <div className="flex flex-col justify-between gap-2 px-3 pt-5 pb-3 md:flex-row">
              <div className="flex justify-center items-center px-2 h-[40px] border-2 rounded-md ">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="text-xs border-none outline-none"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 h-[40px] lg:w-[120px] w-full text-white font-bold p-2 text-xs  rounded"
                  onClick={addTestModel}
                >
                  Add Test
                </button>
              </div>
            </div>
            <table className="min-w-full text-sm divide-y-2 divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                    Test Nmae
                  </th>
                  <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                    Min Value
                  </th>
                  <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                    Max Value
                  </th>
                  <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                    Unit
                  </th>
                  <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                    SubTest
                  </th>
                  <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                    Price
                  </th>
                  <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                    Edit
                  </th>
                  <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {
                  filteredCatalogue.length == 0 ? (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-blue-600 whitespace-nowrap">
                        Record Not Found
                      </td>
                    </tr>) : (

                    filteredCatalogue.map((element, index) => {
                      return (
                        <tr key={element._id}>

                          <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                            {element.test_name}
                          </td>

                          <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                            {element.min_value ? element.min_value : "-"}
                          </td>

                          <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                            {element.max_value ? element.max_value : "-"}
                          </td>

                          <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                            {element?.unit?.unit_abb ? element?.unit?.unit_abb : "-"}
                          </td>


                          <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                            {element?.type === "group" ? (
                              <Link
                                to={`/tests/subtests/${element._id}`}
                                className="font-medium text-blue-600 hover:underline"
                              >
                                View Subtests
                              </Link>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                            {element?.price || 0}
                          </td>
                          <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                            <span onClick={() => {
                              editTestModel(element)
                            }}>
                              <FaRegEdit color="gray" size={22} cursor={'pointer'}

                              />
                            </span>

                          </td>
                          <td className="px-4 py-2 text-gray-700 whitespace-nowrap">

                            <RiDeleteBinLine color="gray" size={22} cursor={'pointer'}
                              onClick={() => {
                                // deleteItem(element._id)
                                deleteModel(element)
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

export default Tests
