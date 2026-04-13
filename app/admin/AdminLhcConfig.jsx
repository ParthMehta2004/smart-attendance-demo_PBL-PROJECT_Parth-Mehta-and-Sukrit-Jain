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
          ble_threshold: parseInt(row.ble_threshold, 10), // ✅ NEW
        }),
      });
      alert('Saved');
    } catch (err) {
      alert('Error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Classroom Settings</h2>
      <table className="border w-full text-sm">
        <thead>
          <tr>
            <th>Classroom</th>
            <th>Lat</th>
            <th>Lon</th>
            <th>Radius</th>
            <th>BLE RSSI</th> {/* ✅ NEW */}
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.classroom}>
              <td>{row.classroom}</td>

              <td>
                <input
                  value={row.geo_lat || ''}
                  onChange={e => updateRow(idx, 'geo_lat', e.target.value)}
                />
              </td>

              <td>
                <input
                  value={row.geo_lon || ''}
                  onChange={e => updateRow(idx, 'geo_lon', e.target.value)}
                />
              </td>

              <td>
                <input
                  value={row.geo_radius_m || ''}
                  onChange={e => updateRow(idx, 'geo_radius_m', e.target.value)}
                />
              </td>

              {/* ✅ NEW FIELD */}
              <td>
                <input
                  value={row.ble_threshold ?? -90}
                  onChange={e => updateRow(idx, 'ble_threshold', e.target.value)}
                />
              </td>

              <td>
                <button onClick={() => saveRow(row)} disabled={saving}>
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
