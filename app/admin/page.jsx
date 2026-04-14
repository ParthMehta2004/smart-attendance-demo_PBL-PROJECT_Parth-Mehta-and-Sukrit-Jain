import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import AdminLhcConfig from './AdminLhcConfig';

export default function AdminPage() {
  try {
    if (!isAdminAuthenticated()) {
      redirect('/admin/login');
    }
  } catch (e) {
    redirect('/admin/login');
  }

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>

        <a href="/" style={styles.backBtn}>
          Back to Main
        </a>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        <AdminLhcConfig />
      </div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0b0b0b',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    backgroundColor: '#111',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #222'
  },
  title: {
    margin: 0,
    fontSize: '24px'
  },
  backBtn: {
    backgroundColor: '#6d28d9',
    color: 'white',
    padding: '8px 14px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '500'
  },
  content: {
    padding: '20px'
  }
};
