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
          ble_threshold: parseInt(row.ble_threshold, 10),
        }),
      });
      alert('Saved ✅');
    } catch (err) {
      alert('Error ❌');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p style={{ color: 'white', padding: '20px' }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Classroom Settings</h1>

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th>Classroom</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Radius</th>
            <th>BLE</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.classroom} style={styles.row}>
              <td>{row.classroom}</td>

              <td>
                <input
                  style={styles.input}
                  value={row.geo_lat ?? ''}
                  onChange={e => updateRow(idx, 'geo_lat', e.target.value)}
                />
              </td>

              <td>
                <input
                  style={styles.input}
                  value={row.geo_lon ?? ''}
                  onChange={e => updateRow(idx, 'geo_lon', e.target.value)}
                />
              </td>

              <td>
                <input
                  style={styles.input}
                  value={row.geo_radius_m ?? ''}
                  onChange={e => updateRow(idx, 'geo_radius_m', e.target.value)}
                />
              </td>

              <td>
                <input
                  style={styles.input}
                  value={row.ble_threshold ?? ''}
                  onChange={e => updateRow(idx, 'ble_threshold', e.target.value)}
                />
              </td>

              <td>
                <button style={styles.button} onClick={() => saveRow(row)}>
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

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0b0b0b',
    color: 'white',
    padding: '40px',
    fontFamily: 'Arial'
  },
  heading: {
    fontSize: '28px',
    marginBottom: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  headerRow: {
    backgroundColor: '#1f1f1f'
  },
  row: {
    borderBottom: '1px solid #333'
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    border: '1px solid #444',
    padding: '6px',
    borderRadius: '6px',
    width: '100%'
  },
  button: {
    backgroundColor: '#6d28d9',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};
