import React, { useState } from 'react';
import './MapSidebar.css';
import {
  FaChalkboardTeacher,
  FaBookReader,
  FaLaptopHouse,
  FaDoorClosed,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const getRoomIcon = (type) => {
  const normalized = type?.toLowerCase();
  switch (normalized) {
    case 'lecture hall':
    case 'classroom':
      return <FaChalkboardTeacher className="room-icon" />;
    case 'study room':
      return <FaBookReader className="room-icon" />;
    case 'lab':
      return <FaLaptopHouse className="room-icon" />;
    default:
      return <FaDoorClosed className="room-icon" />;
  }
};

const MapSidebar = ({
  buildings,
  onSelect,
  selectedId,
  rooms = [],
  onRoomClick,
  onNavigate,
  activeRoomId,
  isOpen,
}) => {
  const [buildingSearch, setBuildingSearch] = useState('');
  const [roomStatusFilter, setRoomStatusFilter] = useState('all');
  const [roomSearch, setRoomSearch] = useState('');

  const handleBuildingSearch = (e) => setBuildingSearch(e.target.value);

  const sortedBuildings = [...buildings].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const filteredBuildings = sortedBuildings.filter((b) =>
    b.name.toLowerCase().includes(buildingSearch.toLowerCase())
  );

  const selectedBuilding = buildings.find((b) => b.id === selectedId);

  return (
    <div className={`map-sidebar ${isOpen ? 'open' : 'closed'}`}>

      <h3>
        Campus Buildings
        <span className="building-count"> ({filteredBuildings.length})</span>
      </h3>

      <input
        type="text"
        className="map-search"
        placeholder="Search buildings..."
        value={buildingSearch}
        onChange={handleBuildingSearch}
      />

      <ul className="building-list">
        {filteredBuildings.map((b) => (
          <li
            key={b.id}
            className={`building-item ${selectedId === b.id ? 'active' : ''}`}
            onClick={() => onSelect(b)}
            title={`Go to ${b.name}`}
          >
            {b.name}
          </li>
        ))}
      </ul>

      {filteredBuildings.length === 0 && (
        <div className="no-results">No buildings found.</div>
      )}

      {selectedBuilding && (
        <div className="room-section">
          <h4>Rooms in {selectedBuilding.name}</h4>

          {/* Room Status Filter */}
          <div className="room-filter-group">
            <label htmlFor="room-status-filter">Filter by Status:</label>
            <select
              id="room-status-filter"
              value={roomStatusFilter}
              onChange={(e) => setRoomStatusFilter(e.target.value)}
              className="room-filter-dropdown"
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          {/* Room Name Search */}
          <input
            type="text"
            className="room-search"
            placeholder="Search rooms..."
            value={roomSearch}
            onChange={(e) => setRoomSearch(e.target.value)}
          />

          {rooms.length > 0 ? (
            <ul className="room-list">
              {rooms
                .filter((room) => {
                  if (roomStatusFilter === 'available') return room.status === 'Available';
                  if (roomStatusFilter === 'unavailable') return room.status !== 'Available';
                  return true;
                })
                .filter((room) =>
                  room.name.toLowerCase().includes(roomSearch.toLowerCase())
                )
                .map((room) => {
                  const isAvailable = room.status === 'Available';
                  const isActive = activeRoomId === room.id;

                  return (
                    <li
                      key={room.id}
                      className={`room-item 
                        ${isAvailable ? 'room-available' : 'room-unavailable'} 
                        ${isActive ? 'active-room' : ''}`}
                      title={`Zoom to ${room.name}`}
                    >
                      <div
                        className="room-info"
                        onClick={() => onRoomClick?.(room)}
                      >
                        <div className="room-header">
                          <strong>
                            {getRoomIcon(room.type)}
                            {room.name} – {room.type} ({room.capacity} ppl)
                          </strong>
                        </div>
                        {room.description && (
                          <p className="room-desc">{room.description}</p>
                        )}
                      </div>

                      <div className="room-actions">
                        <button
                          className="navigate-btn"
                          onClick={() => onNavigate?.(room.id, 'room')}
                        >
                          <FaMapMarkerAlt /> Show Path
                        </button>
                        <button
                          className="navigate-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            const { x, y } = room.map_coordinates || {};
                            if (x && y) {
                              const url = `https://www.google.com/maps/dir/?api=1&destination=${x},${y}&travelmode=walking`;
                              window.open(url, '_blank');
                            }
                          }}
                        >
                          📍 Google Maps
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>
          ) : (
            <div className="no-rooms">No rooms mapped for this building.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapSidebar;
