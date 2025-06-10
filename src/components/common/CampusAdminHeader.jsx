import React from 'react';

const CampusAdminHeader = () => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-primary">JUSTEvents - Campus Admin Panel</h1>
      <div className="flex items-center gap-3">
        {/* Optional: NotificationBell, Avatar, Logout */}
      </div>
    </header>
  );
};

export default CampusAdminHeader;
