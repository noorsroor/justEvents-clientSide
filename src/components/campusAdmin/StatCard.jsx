import React from 'react';

export const StatCard = ({ title, value }) => (
  <div className="bg-white shadow rounded-xl p-6 text-center border">
    <div className="text-sm text-gray-500 mb-1">{title}</div>
    <div className="text-3xl font-bold text-primary">{value ?? '—'}</div>
  </div>
);
