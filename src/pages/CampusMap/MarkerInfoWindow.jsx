import React, { useState } from 'react';
import { OverlayView } from '@react-google-maps/api';
import BuildingDetailsModal from '../../components/maps/BuildingDetailsModal';

const MarkerInfoWindow = ({ marker, onNavigate, onClose }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenInGoogleMaps = () => {
    const { lat, lng } = marker;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`,
      '_blank'
    );
  };

  return (
    <>
      <OverlayView
        position={{ lat: marker.lat, lng: marker.lng }}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      >
        <div className="info-window">
          <h4>{marker.name}</h4>
          <div className="info-window-buttons">
            <button onClick={onNavigate}>Show Path</button>
            <button onClick={handleOpenInGoogleMaps}>Open in Google Maps</button>
            <button onClick={() => setShowModal(true)}>View Details</button>
            <button onClick={onClose} style={{ backgroundColor: '#999' }}>
              Close
            </button>
          </div>
        </div>
      </OverlayView>

      {showModal && (
        <BuildingDetailsModal
          building={marker}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default MarkerInfoWindow;
