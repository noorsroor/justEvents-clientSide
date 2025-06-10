import React, { useEffect, useState } from 'react';
import { getRooms, deleteRoom } from '../../services/campus/roomService';
import { getBuildings } from '../../services/campus/buildingService';
import RoomFormModal from '../../components/campusAdmin/RoomFormModal';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';
import './manageRooms.css';

const ManageRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomData, buildingData] = await Promise.all([
        getRooms(),
        getBuildings(),
      ]);
      setRooms(roomData);
      setBuildings(buildingData);
    } catch {
      toast.error('Failed to fetch room/building data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedRoom(null);
    setModalOpen(true);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this room?')) {
      try {
        await deleteRoom(id);
        toast.success('Room deleted.');
        fetchData();
      } catch {
        toast.error('Failed to delete room.');
      }
    }
  };

  return (
    <>
      <NavBar />
      <main className="manage-rooms-page">
        <div className="header-section">
          <h2 className="page-title"> Manage Rooms</h2>
          <button
            onClick={handleAdd}
            className="add-btn"
          >
            <PlusCircle size={20} /> Add Room
          </button>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <p className="text-center py-6 text-gray-500">Loading...</p>
          ) : rooms.length > 0 ? (
            <table className="rooms-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Room Name</th>
                  <th>Building</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td>{r.name}</td>
                    <td>{r.building_name}</td>
                    <td className="action-buttons">
                      <button onClick={() => handleEdit(r)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDelete(r.id)} className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-400 py-6">No rooms found.</p>
          )}
        </div>
      </main>

      <RoomFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        existing={selectedRoom}
        buildings={buildings}
      />
      <Footer />
    </>
  );
};

export default ManageRoomsPage;
