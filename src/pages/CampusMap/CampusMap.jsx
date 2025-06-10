import React, { useEffect, useState, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import { decode } from '@googlemaps/polyline-codec';
import api from '../../services/api';
import './CampusMap.css';
import MarkerInfoWindow from './MarkerInfoWindow';
import MapSidebar from './MapSidebar';
import Footer from '../../components/common/Footer';
//import { FaChalkboardTeacher, FaBookReader, FaLaptopHouse, FaDoorClosed } from 'react-icons/fa';

// const getRoomIcon = (type) => {
//   const normalized = type.toLowerCase();
//   switch (normalized) {
//     case 'lecture hall':
//     case 'classroom':
//       return <FaChalkboardTeacher className="modal-icon" />;
//     case 'study room':
//       return <FaBookReader className="modal-icon" />;
//     case 'lab':
//       return <FaLaptopHouse className="modal-icon" />;
//     default:
//       return <FaDoorClosed className="modal-icon" />;
//   }
// };

const center = { lat: 32.496, lng: 35.991 };
const MAP_ID = process.env.REACT_APP_MAP_ID;
const MAP_LIBRARIES = ['marker'];

const polylineOptions = {
  strokeColor: '#4CAF50',
  strokeOpacity: 0.9,
  strokeWeight: 5,
  geodesic: true,
  zIndex: 10,
};

function createLabel(text, bgColor, isActive = false) {
  const div = document.createElement('div');
  Object.assign(div.style, {
    background: bgColor,
    color: 'white',
    padding: '4px 8px',
    borderRadius: '50%',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  });

  div.setAttribute('draggable', 'false');
  div.setAttribute('tabindex', '-1');
  div.setAttribute('aria-hidden', 'true');

  if (isActive) {
    div.style.boxShadow = '0 0 12px rgba(82, 102, 255, 0.8)';
  }

  div.textContent = text;
  return div;
}

const CampusMap = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [roomMap, setRoomMap] = useState({});
  //const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeRoomId, setActiveRoomId] = useState(null);

  const markerElementsRef = useRef([]);
  const roomMarkersRef = useRef([]);
  const routeStartRef = useRef(null);
  const routeEndRef = useRef(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const res = await api.get('/api/campus-map/buildings');
        if (res.data.success) {
          const formatted = res.data.data
            .filter(b => b.map_coordinates)
            .map(b => ({
              id: b.id,
              name: b.name,
              lat: b.map_coordinates.x,
              lng: b.map_coordinates.y,
              location: b.location,
            }));
          setMarkers(formatted);
        }
      } catch (err) {
        console.error('Error fetching markers:', err.message);
      }
    };
    fetchMarkers();
  }, []);

  const clearRouteMarkers = () => {
    if (routeStartRef.current) routeStartRef.current.map = null;
    if (routeEndRef.current) routeEndRef.current.map = null;
    routeStartRef.current = null;
    routeEndRef.current = null;
  };

  const fetchRoomsIfNeeded = useCallback(async (buildingId) => {
    if (roomMap[buildingId]) return;
    try {
      const res = await api.get(`/api/campus-map/buildings/${buildingId}/rooms`);
      if (res.data.success) {
        setRoomMap(prev => ({ ...prev, [buildingId]: res.data.data }));
      }
    } catch (err) {
      console.error('Error fetching rooms:', err.message);
    }
  }, [roomMap]);

  const handleNavigate = useCallback((endId, type) => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        try {
          const res = await api.get(`/api/campus-map/navigate?origin=${origin}&endId=${endId}&type=${type}`);
          const encodedPolyline = res.data.data.overview_polyline.points;
          const decodedPath = decode(encodedPolyline).map(([lat, lng]) => ({ lat, lng }));
          setPathCoordinates(decodedPath);

          const leg = res.data.data.legs[0];

          routeStartRef.current = new window.google.maps.marker.AdvancedMarkerElement({
            map: mapInstance,
            position: leg.start_location,
            title: '',
            content: createLabel('A', '#4CAF50'),
          });

          routeEndRef.current = new window.google.maps.marker.AdvancedMarkerElement({
            map: mapInstance,
            position: leg.end_location,
            title: '',
            content: createLabel('B', '#FF5252'),
          });

          const bounds = new window.google.maps.LatLngBounds();
          decodedPath.forEach(coord => bounds.extend(coord));
          mapInstance?.fitBounds(bounds);
        } catch (err) {
          console.error('Navigation error:', err.message);
          alert('Failed to fetch route. Please try again.');
        }
      },
      (error) => {
        console.error('Location access denied:', error.message);
        alert('Please allow location access to use navigation.');
      }
    );
  }, [mapInstance]);

  const handleSidebarSelect = useCallback((marker) => {
    setSelectedMarker(marker);
    setPathCoordinates([]);
    clearRouteMarkers();
    setActiveRoomId(null);
    mapInstance?.panTo({ lat: marker.lat, lng: marker.lng });
    mapInstance?.setZoom(18);
    fetchRoomsIfNeeded(marker.id);
  }, [mapInstance, fetchRoomsIfNeeded]);

  const handleRoomClick = (room) => {
    if (!room?.map_coordinates) return;
    //setSelectedRoom(room);
    setActiveRoomId(room.id);
    setPathCoordinates([]);
    clearRouteMarkers();
    mapInstance?.panTo({ lat: room.map_coordinates.x, lng: room.map_coordinates.y });
    mapInstance?.setZoom(19);
    //handleNavigate(room.id, 'room');
  };

  const handleClose = () => {
    setSelectedMarker(null);
    setPathCoordinates([]);
    setActiveRoomId(null);
    clearRouteMarkers();
    roomMarkersRef.current.forEach(m => (m.map = null));
    roomMarkersRef.current = [];
  };
  const handleResetView = () => {
    window.location.reload();
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  
  useEffect(() => {
    if (!mapInstance || markers.length === 0) return;

    const loadMarkers = () => {
      if (!window.google?.maps?.marker?.AdvancedMarkerElement) return false;

      markerElementsRef.current.forEach(m => (m.map = null));
      markerElementsRef.current = [];

      roomMarkersRef.current.forEach(m => (m.map = null));
      roomMarkersRef.current = [];

      markers.forEach(marker => {
        const isActive = marker.id === selectedMarker?.id;
        const content = createLabel(marker.name.charAt(0), isActive ? '#3F51B5' : '#4CAF50', isActive);

        const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
          map: mapInstance,
          position: { lat: marker.lat, lng: marker.lng },
          title: '',
          content,
          zIndex: isActive ? 999 : 1,
        });

        if (isActive) {
          advancedMarker.element.style.animation = 'markerBounce 0.4s infinite alternate';
        }

        advancedMarker.addListener('gmp-click', () => {
          handleSidebarSelect(marker);
        });

        markerElementsRef.current.push(advancedMarker);
      });

      if (selectedMarker && roomMap[selectedMarker.id]) {
        const rooms = roomMap[selectedMarker.id].filter(r => r.map_coordinates);
        rooms.forEach(room => {
          const isActive = room.id === activeRoomId;
          const roomColor = isActive
            ? '#3F51B5'
            : room.status === 'Available'
            ? '#4CAF50'
            : '#FF5252';
          const content = createLabel('R', roomColor, isActive);

          const roomMarker = new window.google.maps.marker.AdvancedMarkerElement({
            map: mapInstance,
            position: {
              lat: room.map_coordinates.x,
              lng: room.map_coordinates.y,
            },
            title: room.name,
            content,
            zIndex: isActive ? 999 : 500,
          });

          if (isActive) {
            roomMarker.element.style.animation = 'markerBounce 0.4s infinite alternate';
          }

          
          roomMarker.addListener('gmp-click', () => {

            setActiveRoomId(room.id);
            mapInstance?.panTo({
              lat: room.map_coordinates.x,
              lng: room.map_coordinates.y,
            });
            mapInstance?.setZoom(19);
            setPathCoordinates([]); // clears previous paths if needed
            clearRouteMarkers();    // clears A/B markers
          }
        );
        roomMarkersRef.current.push(roomMarker);
        
      });
    }
      return true;
    };

    const interval = setInterval(() => {
      if (loadMarkers()) clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, [mapInstance, markers, selectedMarker, fetchRoomsIfNeeded, roomMap, activeRoomId, handleSidebarSelect, handleNavigate]);

  return (
    <>
      <div className="campus-map-container">
        <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
          ☰
        </button>

        <MapSidebar
          buildings={markers}
          selectedId={selectedMarker?.id}
          onSelect={handleSidebarSelect}
          rooms={roomMap[selectedMarker?.id] || []}
          onRoomClick={handleRoomClick}
          activeRoomId={activeRoomId}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
        />
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          libraries={MAP_LIBRARIES}
        >
          <div className="map-wrapper">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={center}
              zoom={17}
              options={{ mapId: MAP_ID }}
              onLoad={map => setMapInstance(map)}
            >
              {pathCoordinates.length > 0 && (
                <Polyline path={pathCoordinates} options={polylineOptions} />
              )}
              {selectedMarker && mapInstance && (
                <MarkerInfoWindow
                  marker={selectedMarker}
                  onClose={handleClose}
                  onNavigate={() => handleNavigate(selectedMarker.id, 'building')}
                />
              )}
            </GoogleMap>
          </div>
        </LoadScript>

      </div>
      <button className="reset-view-btn" onClick={handleResetView}>
        Reset View
      </button>
      <Footer />
    </>
  );
};

export default CampusMap;
