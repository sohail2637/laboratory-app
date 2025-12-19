import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import GlobalApiState from "../utilis/globalVariable";
import EditSubtestModal from "../components/Tests/EditSubtestModal";
import AuthContext from "../AuthContext";
import DeleteSubtestModal from "../components/Tests/DeleteSubTest";
import AddSubtestModal from "../components/Tests/AddSubtestModel";


export default function Subtests() {
  const { groupId } = useParams();
  const authContext = useContext(AuthContext);

  const [subtests, setSubtests] = useState([]);
  const [units, setAllUnits] = useState([]);
  const [showEditSubTestModel, setEditSubTestModel] = useState(false);
  const [updatePage, setUpdatePage] = useState(true);
  const [singleSubTest, setSingleSubTest] = useState([]);
  const [showSubTestDeleteModal, setSubTestDeleteModal] = useState(false);
const [showAddSubTestModal, setAddSubTestModal] = useState(false);



  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const deleteSubTestModel = (element) => {
    setSubTestDeleteModal(!showSubTestDeleteModal);
    setSingleSubTest(element)
  };
  const editSubTestModel = (element) => {
    setEditSubTestModel(!showEditSubTestModel);
    setSingleSubTest(element)
  };

  const fetchSubtests = async () => {
    const res = await fetch(
      `${GlobalApiState.DEV_BASE_LIVE}/api/test/${groupId}/subtests`
    );
    const data = await res.json();
    setSubtests(Array.isArray(data) ? data : []);
  };

  const fetchUnitData = () => {
    fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/unit/listing_unit/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllUnits(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchSubtests();
    fetchUnitData()
  }, [updatePage]);

  return (
    <div className="p-6 bg-white border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold">Subtests</h2>
        <button
      onClick={() => setAddSubTestModal(true)}
          className="px-4 py-2 text-xs text-white bg-blue-600 rounded"
        >
          Add Subtest
        </button>
      </div>

      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2">Min</th>
            <th className="px-4 py-2">Max</th>
            <th className="px-4 py-2">Unit</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Edit</th>
            <th className="px-4 py-2">Delete</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {subtests.map(sub => (
            <tr key={sub._id}>
              <td className="px-4 py-2">{sub.test_name}</td>
              <td className="px-4 py-2 text-center">{sub.min_value ?? "-"}</td>
              <td className="px-4 py-2 text-center">{sub.max_value ?? "-"}</td>
              <td className="px-4 py-2 text-center">
                {sub.unit?.unit_name || "-"}
              </td>
              <td className="px-4 py-2 text-center">{sub.price}</td>
              <td className="px-4 py-2 text-right">
                <FaRegEdit
                  size={20}
                  className="cursor-pointer"
                  onClick={() => {
                    editSubTestModel(sub)
                  }}
                />

              </td>
              <td className="px-4 py-2 text-right">
                <RiDeleteBinLine
                  size={20}
                  className="cursor-pointer"
                  onClick={() => {
                    deleteSubTestModel(sub)
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showEditSubTestModel && (
        <EditSubtestModal
          open={showEditSubTestModel}
          onClose={() => setEditSubTestModel(false)}
          subtest={singleSubTest}
          handlePageUpdate={handlePageUpdate}
          units={units}
        />
      )}

       {showSubTestDeleteModal && (
                  <DeleteSubtestModal
                    deleteSubTestModel={deleteSubTestModel}
                    updatePage={updatePage}
                    setUpdatePage={setUpdatePage}
                    singleSubTest={singleSubTest}
                  />
                )}
                    <AddSubtestModal
      open={showAddSubTestModal}
      onClose={() => setAddSubTestModal(false)}
      groupId={groupId}
      handlePageUpdate={handlePageUpdate}
      units={units}
      userID={authContext.user} 
    />
    </div>
  );
}
