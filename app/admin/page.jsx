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
    <div>
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <a href="/" className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100">
          Back to Main
        </a>
      </div>
      <div className="p-6">
        <AdminLhcConfig />
      </div>
    </div>
  );
}
