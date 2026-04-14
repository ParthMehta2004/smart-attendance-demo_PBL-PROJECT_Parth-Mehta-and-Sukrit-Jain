'use client';

import { useEffect, useState } from 'react';

const CLASSES = [
  "LHC 001", "LHC 002", "LHC 003", "LHC 004",
  "LHC 101", "LHC 102", "LHC 103", "LHC 104"
];

export default function ProfessorPage() {
  const [classroom, setClassroom] = useState(CLASSES[0]);
  const [adminKey, setAdminKey] = useState('');
  const [activeSession, setActiveSession] = useState(null);
  const [logs, setLogs] = useState([]);

  async function openSession() {
    const res = await fetch('/api/sessions/open', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      },
      body: JSON.stringify({ classroom })
    });

    const data = await res.json();
    setActiveSession(data.session);
  }

  async function closeSession() {
    if (!activeSession) return;

    await fetch('/api/sessions/close', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      },
      body: JSON.stringify({ sessionId: activeSession.id })
    });

    setActiveSession(null);
    setLogs([]);
  }

  async function fetchActive() {
    const res = await fetch('/api/sessions/active');
    const data = await res.json();
    setActiveSession(data.session || null);
  }

  async function fetchLogs() {
    if (!activeSession) return;

    const res = await fetch('/api/attendance?sessionId=' + activeSession.id);
    const data = await res.json();
    setLogs(data.rows || []);
  }

  useEffect(() => {
    fetchActive();
  }, []);

  useEffect(() => {
    const t = setInterval(fetchLogs, 3000);
    return () => clearInterval(t);
  }, [activeSession]);

  return (
    <div style={{ padding: "30px" }}>

      <h1 style={{ fontSize: "30px", marginBottom: "20px" }}>
        Professor Panel
      </h1>

      {/* INPUTS */}
      <input
        placeholder="Enter Admin Key"
        value={adminKey}
        onChange={e => setAdminKey(e.target.value)}
        style={input}
      />

      <select
        value={classroom}
        onChange={e => setClassroom(e.target.value)}
        style={input}
      >
        {CLASSES.map(c => <option key={c}>{c}</option>)}
      </select>

      {/* BUTTONS */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={openSession} style={btnPrimary}>
          Activate Session
        </button>

        <button onClick={closeSession} style={btnDanger}>
          Close Session
        </button>
      </div>

      {/* STATUS */}
      <p style={{ marginTop: "15px", color: "#aaa" }}>
        Active Session:{" "}
        <span style={{ color: "white" }}>
          {activeSession ? `${activeSession.classroom}` : "None"}
        </span>
      </p>

      {/* TABLE */}
      <h2 style={{ marginTop: "30px" }}>Attendance Logs</h2>

      <div style={tableWrapper}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Reg No</th>
              <th style={th}>Name</th>
              <th style={th}>Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((r, i) => (
              <tr key={r.id} style={i % 2 === 0 ? row : rowAlt}>
                <td style={td}>{r.reg_no}</td>
                <td style={td}>{r.name}</td>
                <td style={td}>
                  {new Date(r.marked_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

const input = {
  display: "block",
  background: "#1a1a1a",
  color: "white",
  border: "1px solid #444",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  width: "300px"
};

const btnPrimary = {
  background: "#6d28d9",
  color: "white",
  border: "none",
  padding: "10px 16px",
  marginRight: "10px",
  borderRadius: "6px",
  cursor: "pointer"
};

const btnDanger = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer"
};

const tableWrapper = {
  marginTop: "20px",
  border: "1px solid #222",
  borderRadius: "10px",
  overflow: "hidden"
};

const table = {
  width: "100%",
  borderCollapse: "collapse"
};

const th = {
  textAlign: "left",
  padding: "12px",
  backgroundColor: "#111",
  color: "#aaa",
  fontSize: "14px"
};

const td = {
  padding: "12px",
  borderTop: "1px solid #222"
};

const row = {
  backgroundColor: "#0f0f0f"
};

const rowAlt = {
  backgroundColor: "#141414"
};
