import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, LayoutDashboard, Settings } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [usersInfo, setUsersInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { data: { session } } = await supabase.auth.getSession();
    
    try {
      const res = await fetch(`${backendUrl}/users`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsersInfo(data || []);
      }
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { data: { session } } = await supabase.auth.getSession();
    
    const res = await fetch(`${backendUrl}/users/${userId}/role`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ role: newRole })
    });
    
    if (res.ok) {
      fetchUsers();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-fade-in-up">
      <div className="mb-10 flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <Settings className="mr-3 text-red-600" /> Platform Administration
          </h1>
          <p className="text-gray-500 mt-2">Manage openbuy users and global permissions.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center">
          <Users className="text-blue-600 mr-2" />
          <h2 className="text-xl font-bold">User Management</h2>
        </div>
        
        {loading ? <div className="p-10 text-center">Loading users...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-4 pl-6 border-b border-gray-200">Name</th>
                  <th className="p-4 border-b border-gray-200">Email</th>
                  <th className="p-4 border-b border-gray-200">Current Role</th>
                  <th className="p-4 border-b border-gray-200">Action</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {usersInfo.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
                    <td className="p-4 pl-6 font-semibold text-gray-900">{u.name || '-'}</td>
                    <td className="p-4 text-gray-500">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-red-100 text-red-700' :
                        u.role === 'seller' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <select 
                        disabled={u.id === user.id} // prevent self-demotion implicitly
                        className="bg-white border border-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="customer">Customer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard;
