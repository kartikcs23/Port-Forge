import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useAppUser } from '../hooks/useAppUser';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';
import api from '../utils/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export const AdminDashboard = () => {
  const { isLoaded, isSignedIn } = useAppUser();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  // Filters and pagination
  const [userFilters, setUserFilters] = useState({ page: 1, limit: 10, role: '', plan: '', search: '' });
  const [portfolioFilters, setPortfolioFilters] = useState({ page: 1, limit: 10, published: '', theme: '', search: '' });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedPortfolios, setSelectedPortfolios] = useState([]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/login');
      return;
    }

    if (isLoaded && isSignedIn && isAdmin) {
      fetchAdminData();
    }
  }, [isLoaded, isSignedIn, isAdmin, navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes] = await Promise.all([
        api.get('/api/admin/stats')
      ]);

      setStats(statsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams(userFilters);
      const response = await api.get(`/api/admin/users?${params}`);
      setUsers(response.data.data.users);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchPortfolios = async () => {
    try {
      const params = new URLSearchParams(portfolioFilters);
      const response = await api.get(`/api/admin/portfolios?${params}`);
      setPortfolios(response.data.data.portfolios);
    } catch (err) {
      console.error('Failed to fetch portfolios:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'users' && isAdmin) fetchUsers();
  }, [activeTab, userFilters, isAdmin]);

  useEffect(() => {
    if (activeTab === 'portfolios' && isAdmin) fetchPortfolios();
  }, [activeTab, portfolioFilters, isAdmin]);

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update user role:', err);
      alert('Failed to update user role');
    }
  };

  const updateUserPlan = async (userId, newPlan) => {
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { plan: newPlan });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update user plan:', err);
      alert('Failed to update user plan');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/api/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user');
    }
  };

  const togglePortfolioPublish = async (portfolioId) => {
    try {
      await api.patch(`/api/admin/portfolios/${portfolioId}/publish`);
      fetchPortfolios();
    } catch (err) {
      console.error('Failed to toggle portfolio publish:', err);
      alert('Failed to toggle portfolio publish status');
    }
  };

  const bulkUpdateUsers = async (updates) => {
    if (selectedUsers.length === 0) {
      alert('Please select users to update');
      return;
    }

    try {
      await api.patch('/api/admin/users/bulk', {
        userIds: selectedUsers,
        updates
      });
      setSelectedUsers([]);
      fetchUsers();
      alert('Users updated successfully');
    } catch (err) {
      console.error('Failed to bulk update users:', err);
      alert('Failed to update users');
    }
  };

  const bulkDeletePortfolios = async () => {
    if (selectedPortfolios.length === 0) {
      alert('Please select portfolios to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedPortfolios.length} portfolios?`)) {
      return;
    }

    try {
      await api.delete('/api/admin/portfolios/bulk', {
        data: { portfolioIds: selectedPortfolios }
      });
      setSelectedPortfolios([]);
      fetchPortfolios();
      alert('Portfolios deleted successfully');
    } catch (err) {
      console.error('Failed to bulk delete portfolios:', err);
      alert('Failed to delete portfolios');
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-ink font-bold">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Temporarily allow access for debugging
  // if (!isAdmin) {
  //   return (
  //     <div className="min-h-screen bg-background">
  //     </div>
  //   );
  // }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-black mb-4 text-red-600">ACCESS DENIED</h1>
            <p className="text-lg font-bold mb-6">Admin access required</p>
            <button
              onClick={() => navigate('/')}
              className="bg-accent text-white px-6 py-3 font-bold uppercase"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-black mb-4 text-red-600">ERROR</h1>
            <p className="text-lg font-bold mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-accent text-white px-6 py-3 font-bold uppercase"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  return (
    <div className="min-h-screen bg-background text-ink">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
                Admin Dashboard
              </h1>
              <p className="text-lg font-bold text-muted">
                Manage users, portfolios, and platform analytics
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <div className="text-sm font-bold uppercase tracking-widest text-muted">System Status</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-bold text-green-600">HEALTHY</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8 border-b-2 border-ink pb-4"
        >
          {[
            { id: 'overview', label: 'Overview', icon: '📊', color: 'bg-accent' },
            { id: 'analytics', label: 'Analytics', icon: '📈', color: 'bg-blue-500' },
            { id: 'users', label: 'Users', icon: '👥', color: 'bg-green-500' },
            { id: 'portfolios', label: 'Portfolios', icon: '📁', color: 'bg-purple-500' },
            { id: 'system', label: 'System', icon: '⚙️', color: 'bg-orange-500' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-black text-sm uppercase tracking-widest border-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? `${tab.color} text-white border-ink shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] scale-105`
                  : 'bg-background text-ink border-ink hover:bg-accent hover:text-white hover:border-accent hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]'
              }`}
              whileHover={{ scale: activeTab === tab.id ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.icon} {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Overview Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && stats && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  className="border-3 border-ink p-6 bg-surface shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-4xl mb-2">👥</div>
                  <div className="text-3xl font-black">{stats.totalUsers.toLocaleString()}</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted">Total Users</div>
                  <div className="text-xs text-green-600 font-bold mt-2">+{stats.recentUsers} this month</div>
                </motion.div>

                <motion.div
                  className="border-3 border-ink p-6 bg-surface shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-4xl mb-2">📁</div>
                  <div className="text-3xl font-black">{stats.totalPortfolios.toLocaleString()}</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted">Total Portfolios</div>
                  <div className="text-xs text-blue-600 font-bold mt-2">{stats.publishRate}% published</div>
                </motion.div>

                <motion.div
                  className="border-3 border-ink p-6 bg-surface shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-4xl mb-2">🌐</div>
                  <div className="text-3xl font-black">{stats.publishedPortfolios.toLocaleString()}</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted">Published</div>
                  <div className="text-xs text-purple-600 font-bold mt-2">Live portfolios</div>
                </motion.div>

                <motion.div
                  className="border-3 border-ink p-6 bg-surface shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-4xl mb-2">📈</div>
                  <div className="text-3xl font-black">{stats.activeUsers.toLocaleString()}</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted">Active Users</div>
                  <div className="text-xs text-orange-600 font-bold mt-2">Last 7 days</div>
                </motion.div>
              </div>

              {/* Top Skills */}
              <motion.div
                className="border-3 border-ink p-8 bg-surface shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">Top Skills</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {stats.topSkills.slice(0, 10).map((skill, index) => (
                    <motion.div
                      key={skill._id}
                      className="text-center p-4 border-2 border-ink bg-background"
                      whileHover={{ scale: 1.05, backgroundColor: '#FF6B6B', color: 'white' }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-2xl font-black">{skill.count}</div>
                      <div className="text-sm font-bold uppercase tracking-widest">{skill._id}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && stats && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-black uppercase tracking-tighter">Platform Analytics</h2>

              {/* Growth Chart */}
              <motion.div
                className="border-3 border-ink p-8 bg-surface shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Growth Trends (12 Months)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                    <XAxis dataKey="month" stroke="#111" fontWeight="bold" />
                    <YAxis stroke="#111" fontWeight="bold" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '2px solid #111',
                        borderRadius: '0',
                        fontWeight: 'bold'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#FF6B6B"
                      strokeWidth={3}
                      name="New Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="portfolios"
                      stroke="#4ECDC4"
                      strokeWidth={3}
                      name="New Portfolios"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Skills Distribution */}
              <motion.div
                className="border-3 border-ink p-8 bg-surface shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Skills Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.topSkills.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stats.topSkills.slice(0, 6).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-black uppercase tracking-tighter">User Management</h2>

                {/* Bulk Actions */}
                {selectedUsers.length > 0 && (
                  <motion.div
                    className="flex gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <button
                      onClick={() => bulkUpdateUsers({ role: 'admin' })}
                      className="px-4 py-2 bg-purple-600 text-white font-bold uppercase text-sm hover:bg-purple-700 transition-colors"
                    >
                      Make Admin ({selectedUsers.length})
                    </button>
                    <button
                      onClick={() => bulkUpdateUsers({ plan: 'pro' })}
                      className="px-4 py-2 bg-blue-600 text-white font-bold uppercase text-sm hover:bg-blue-700 transition-colors"
                    >
                      Upgrade to Pro ({selectedUsers.length})
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Filters */}
              <motion.div
                className="border-3 border-ink p-6 bg-surface shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userFilters.search}
                    onChange={(e) => setUserFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                    className="px-4 py-2 border-2 border-ink bg-background font-bold"
                  />
                  <select
                    value={userFilters.role}
                    onChange={(e) => setUserFilters(prev => ({ ...prev, role: e.target.value, page: 1 }))}
                    className="px-4 py-2 border-2 border-ink bg-background font-bold"
                  >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <select
                    value={userFilters.plan}
                    onChange={(e) => setUserFilters(prev => ({ ...prev, plan: e.target.value, page: 1 }))}
                    className="px-4 py-2 border-2 border-ink bg-background font-bold"
                  >
                    <option value="">All Plans</option>
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                  </select>
                  <button
                    onClick={() => setUserFilters({ page: 1, limit: 10, role: '', plan: '', search: '' })}
                    className="px-4 py-2 bg-accent text-white font-bold uppercase hover:bg-red-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </motion.div>

              {/* Users Table */}
              <motion.div
                className="border-3 border-ink bg-surface shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-ink text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers(users.map(u => u._id));
                              } else {
                                setSelectedUsers([]);
                              }
                            }}
                            checked={selectedUsers.length === users.length && users.length > 0}
                          />
                        </th>
                        <th className="px-4 py-3 text-left font-black uppercase tracking-widest text-xs">User</th>
                        <th className="px-4 py-3 text-left font-black uppercase tracking-widest text-xs">Email</th>
                        <th className="px-4 py-3 text-left font-black uppercase tracking-widest text-xs">Role</th>
                        <th className="px-4 py-3 text-left font-black uppercase tracking-widest text-xs">Plan</th>
                        <th className="px-4 py-3 text-left font-black uppercase tracking-widest text-xs">Stats</th>
                        <th className="px-4 py-3 text-left font-black uppercase tracking-widest text-xs">Joined</th>
                        <th className="px-4 py-3 text-left font-black uppercase tracking-widest text-xs">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userData) => (
                        <motion.tr
                          key={userData._id}
                          className="border-b border-ink/20 hover:bg-accent/5 transition-colors"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.05 * users.indexOf(userData) }}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(userData._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers(prev => [...prev, userData._id]);
                                } else {
                                  setSelectedUsers(prev => prev.filter(id => id !== userData._id));
                                }
                              }}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`}
                                alt={userData.name}
                                className="w-8 h-8 rounded-full border-2 border-ink"
                              />
                              <span className="font-bold">{userData.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-sm">{userData.email}</td>
                          <td className="px-4 py-3">
                            <select
                              value={userData.role}
                              onChange={(e) => updateUserRole(userData._id, e.target.value)}
                              className="bg-background border-2 border-ink px-2 py-1 font-bold text-xs uppercase"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={userData.plan}
                              onChange={(e) => updateUserPlan(userData._id, e.target.value)}
                              className="bg-background border-2 border-ink px-2 py-1 font-bold text-xs uppercase"
                            >
                              <option value="free">Free</option>
                              <option value="pro">Pro</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Port:</span>
                                <span className="font-bold">{userData.stats?.portfolios || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Pub:</span>
                                <span className="font-bold text-green-600">{userData.stats?.publishedPortfolios || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Proj:</span>
                                <span className="font-bold">{userData.stats?.projects || 0}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {new Date(userData.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteUser(userData._id)}
                              className="bg-red-600 text-white px-3 py-1 font-bold text-xs uppercase hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Portfolios Tab */}
          {activeTab === 'portfolios' && (
            <motion.div
              key="portfolios"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Portfolio Management</h2>

                {/* Bulk Actions */}
                {selectedPortfolios.length > 0 && (
                  <motion.button
                    onClick={bulkDeletePortfolios}
                    className="px-6 py-3 bg-red-600 text-white font-bold uppercase hover:bg-red-700 transition-colors shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    Delete Selected ({selectedPortfolios.length})
                  </motion.button>
                )}
              </div>

              {/* Filters */}
              <motion.div
                className="border-3 border-ink p-6 bg-surface shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Search portfolios..."
                    value={portfolioFilters.search}
                    onChange={(e) => setPortfolioFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                    className="px-4 py-2 border-2 border-ink bg-background font-bold"
                  />
                  <select
                    value={portfolioFilters.published}
                    onChange={(e) => setPortfolioFilters(prev => ({ ...prev, published: e.target.value, page: 1 }))}
                    className="px-4 py-2 border-2 border-ink bg-background font-bold"
                  >
                    <option value="">All Status</option>
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                  </select>
                  <select
                    value={portfolioFilters.theme}
                    onChange={(e) => setPortfolioFilters(prev => ({ ...prev, theme: e.target.value, page: 1 }))}
                    className="px-4 py-2 border-2 border-ink bg-background font-bold"
                  >
                    <option value="">All Themes</option>
                    <option value="default">Default</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                  <button
                    onClick={() => setPortfolioFilters({ page: 1, limit: 10, published: '', theme: '', search: '' })}
                    className="px-4 py-2 bg-accent text-white font-bold uppercase hover:bg-red-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </motion.div>

              {/* Portfolios Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {portfolios.map((portfolio) => (
                  <motion.div
                    key={portfolio._id}
                    className="border-3 border-ink p-6 bg-surface shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] transition-all"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * portfolios.indexOf(portfolio) }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedPortfolios.includes(portfolio._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPortfolios(prev => [...prev, portfolio._id]);
                            } else {
                              setSelectedPortfolios(prev => prev.filter(id => id !== portfolio._id));
                            }
                          }}
                        />
                        <div>
                          <h3 className="font-black text-lg uppercase">{portfolio.slug}</h3>
                          <p className="text-sm text-muted font-bold">Theme: {portfolio.theme}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 font-bold text-xs uppercase tracking-widest ${
                        portfolio.published
                          ? 'bg-green-600 text-white'
                          : 'bg-yellow-600 text-white'
                      }`}>
                        {portfolio.published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={portfolio.userId?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${portfolio.userId?.name}`}
                          alt={portfolio.userId?.name}
                          className="w-6 h-6 rounded-full border border-ink"
                        />
                        <span className="font-bold text-sm">{portfolio.userId?.name}</span>
                      </div>
                      <div className="text-xs text-muted">
                        Created: {new Date(portfolio.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted">
                        Views: {portfolio.stats?.views || 0} | Projects: {portfolio.stats?.projects || 0}
                      </div>
                    </div>

                    <button
                      onClick={() => togglePortfolioPublish(portfolio._id)}
                      className={`w-full py-2 font-bold text-xs uppercase transition-colors ${
                        portfolio.published
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {portfolio.published ? 'Unpublish' : 'Publish'}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && stats && (
            <motion.div
              key="system"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-black uppercase tracking-tighter">System Administration</h2>

              {/* System Health */}
              <motion.div
                className="border-3 border-ink p-8 bg-surface shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-xl font-black uppercase tracking-tighter mb-6">System Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border-2 border-ink">
                    <div className="text-2xl mb-2">🖥️</div>
                    <div className="font-black text-lg">Node {stats.systemHealth.nodeVersion}</div>
                    <div className="text-sm text-muted">Runtime</div>
                  </div>
                  <div className="text-center p-4 border-2 border-ink">
                    <div className="text-2xl mb-2">⏱️</div>
                    <div className="font-black text-lg">{Math.round(stats.systemHealth.uptime / 3600)}h</div>
                    <div className="text-sm text-muted">Uptime</div>
                  </div>
                  <div className="text-center p-4 border-2 border-ink">
                    <div className="text-2xl mb-2">🧠</div>
                    <div className="font-black text-lg">{Math.round(stats.systemHealth.memoryUsage.heapUsed / 1024 / 1024)}MB</div>
                    <div className="text-sm text-muted">Memory Used</div>
                  </div>
                </div>
              </motion.div>

              {/* Maintenance Actions */}
              <motion.div
                className="border-3 border-ink p-8 bg-surface shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Maintenance Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.button
                    className="p-4 border-2 border-ink bg-background hover:bg-accent hover:text-white transition-colors text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-black uppercase tracking-widest">Clear Cache</div>
                    <div className="text-sm text-muted mt-1">Clear application cache</div>
                  </motion.button>
                  <motion.button
                    className="p-4 border-2 border-ink bg-background hover:bg-blue-500 hover:text-white transition-colors text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-black uppercase tracking-widest">Backup Database</div>
                    <div className="text-sm text-muted mt-1">Create database backup</div>
                  </motion.button>
                  <motion.button
                    className="p-4 border-2 border-ink bg-background hover:bg-green-500 hover:text-white transition-colors text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-black uppercase tracking-widest">View Logs</div>
                    <div className="text-sm text-muted mt-1">Check system logs</div>
                  </motion.button>
                  <motion.button
                    className="p-4 border-2 border-ink bg-background hover:bg-orange-500 hover:text-white transition-colors text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-black uppercase tracking-widest">System Info</div>
                    <div className="text-sm text-muted mt-1">Detailed system information</div>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};