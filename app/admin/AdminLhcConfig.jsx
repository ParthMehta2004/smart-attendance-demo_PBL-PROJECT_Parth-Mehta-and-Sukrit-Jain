'use client';

import { useEffect, useState } from 'react';

export default function AdminLhcConfig() {
  const [rows, setRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/lhc-config')
      .then(res => res.json())
      .then(data => {
        setRows(data);
        setLoading(false);
      });
  }, []);

  function updateRow(idx, field, value) {
    setRows(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  }

  async function saveRow(row) {
    setSaving(true);
    try {
      await fetch('/api/admin/lhc-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom: row.classroom,
          geo_lat: parseFloat(row.geo_lat),
          geo_lon: parseFloat(row.geo_lon),
          geo_radius_m: parseInt(row.geo_radius_m, 10),
        }),
      });
      alert('Settings saved successfully');
    } catch (err) {
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Classroom Settings</h2>
      <div className="overflow-x-auto">
        <table className="border-collapse w-full text-sm border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-2 py-2 text-left">Classroom</th>
              <th className="border border-gray-300 px-2 py-2 text-left">Latitude</th>
              <th className="border border-gray-300 px-2 py-2 text-left">Longitude</th>
              <th className="border border-gray-300 px-2 py-2 text-left">Radius (meters)</th>
              <th className="border border-gray-300 px-2 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.classroom} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-2 py-2 font-medium">{row.classroom}</td>
                <td className="border border-gray-300 px-2 py-2">
                  <input
                    className="border border-gray-300 p-1 w-full rounded"
                    value={row.geo_lat ?? ''}
                    onChange={e => updateRow(idx, 'geo_lat', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <input
                    className="border border-gray-300 p-1 w-full rounded"
                    value={row.geo_lon ?? ''}
                    onChange={e => updateRow(idx, 'geo_lon', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <input
                    className="border border-gray-300 p-1 w-full rounded"
                    value={row.geo_radius_m ?? ''}
                    onChange={e => updateRow(idx, 'geo_radius_m', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    onClick={() => saveRow(row)}
                    disabled={saving}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
