import React, { useEffect, useState } from 'react';
import { getBuildings, deleteBuilding } from '../../services/campus/buildingService';
import BuildingFormModal from '../../components/campusAdmin/BuildingFormModal';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';
import './manageBuildings.css';

const ManageBuildingsPage = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const data = await getBuildings();
      setBuildings(data);
    } catch {
      toast.error('Failed to fetch buildings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleAdd = () => {
    setSelectedBuilding(null);
    setModalOpen(true);
  };

  const handleEdit = (building) => {
    setSelectedBuilding(building);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this building?')) {
      try {
        await deleteBuilding(id);
        toast.success('Building deleted.');
        fetchBuildings();
      } catch {
        toast.error('Failed to delete building.');
      }
    }
  };

  return (
    <>
      <NavBar />
      <main className="manage-buildings-page">
        <div className="header-section">
          <h2 className="page-title"> Manage Campus Buildings</h2>
          <button
            onClick={handleAdd}
            className="add-btn"
          >
            <PlusCircle size={20} /> Add Building
          </button>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <p className="text-center text-gray-500 py-6">Loading...</p>
          ) : buildings.length > 0 ? (
            <table className="buildings-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Building Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {buildings.map((b, i) => (
                  <tr key={b.id}>
                    <td>{i + 1}</td>
                    <td>{b.name}</td>
                    <td className="action-buttons">
                      <button onClick={() => handleEdit(b)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDelete(b.id)} className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-400 py-6">No buildings found.</p>
          )}
        </div>
      </main>

      <BuildingFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchBuildings}
        existing={selectedBuilding}
      />
      <Footer />
    </>
  );
};

export default ManageBuildingsPage;
