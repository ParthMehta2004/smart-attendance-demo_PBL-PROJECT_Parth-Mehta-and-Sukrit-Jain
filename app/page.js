'use client';

import { useEffect, useState } from 'react';

const CLASSES = ["LHC 001", "LHC 002", "LHC003", "LHC004", "LHC101", "LHC102", "LHC103", "LHC104"];

export default function ProfessorPage() {
  const [classroom, setClassroom] = useState(CLASSES[0]);
  const [adminKey, setAdminKey] = useState('');
  const [activeSession, setActiveSession] = useState(null);
  const [logs, setLogs] = useState([]);

  async function openSession() {
    const res = await fetch('/api/sessions/open', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ classroom })
    });
    const data = await res.json();
    setActiveSession(data.session);
  }

  async function closeSession() {
    if (!activeSession) return;
    await fetch('/api/sessions/close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
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

  useEffect(() => { fetchActive(); }, []);
  useEffect(() => {
    const t = setInterval(fetchLogs, 3000);
    return () => clearInterval(t);
  }, [activeSession]);

  return (
    <div style={{ padding: "30px" }}>

      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        Professor Panel
      </h1>

      <input
        placeholder="Admin Key"
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

      <div style={{ marginTop: "10px" }}>
        <button onClick={openSession} style={btnPrimary}>Activate</button>
        <button onClick={closeSession} style={btnDanger}>Close</button>
      </div>

      <p style={{ marginTop: "15px", color: "#aaa" }}>
        Active: {activeSession ? activeSession.classroom : "None"}
      </p>

      <h2 style={{ marginTop: "30px" }}>Attendance Logs</h2>

      <table style={table}>
        <thead>
          <tr>
            <th>Reg No</th>
            <th>Name</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(r => (
            <tr key={r.id}>
              <td>{r.reg_no}</td>
              <td>{r.name}</td>
              <td>{new Date(r.marked_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
  borderRadius: "6px"
};

const btnDanger = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px"
};

const table = {
  width: "100%",
  marginTop: "15px",
  borderCollapse: "collapse"
};
