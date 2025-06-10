import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building, DoorOpen, BarChart3, CalendarCheck } from 'lucide-react';
import clsx from 'clsx';

const links = [
  { to: '/campus-admin/buildings', label: 'Buildings', icon: <Building size={20} /> },
  { to: '/campus-admin/rooms', label: 'Rooms', icon: <DoorOpen size={20} /> },
  { to: '/campus-admin/bookings', label: 'Booking Requests', icon: <CalendarCheck size={20} /> },
  { to: '/campus-admin/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> }
];

const CampusAdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-primary text-white shadow-lg">
      <div className="p-6 text-2xl font-bold">Campus Admin</div>
      <nav className="flex flex-col gap-2 px-4">
        {links.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className={clsx(
              'flex items-center gap-3 p-3 rounded-xl transition hover:bg-secondary',
              location.pathname.startsWith(to) && 'bg-secondary'
            )}
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default CampusAdminSidebar;
