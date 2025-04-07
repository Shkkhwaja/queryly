'use client';

import { useState, useEffect } from 'react';
import {
  FiUsers, FiFileText, FiCheckCircle, FiHome, FiSettings,
  FiLogOut, FiMenu, FiX, FiSearch, FiDownload
} from 'react-icons/fi';
import { toast, Toaster } from "react-hot-toast";


// Types
type User = {
  id: string;
  name: string;
  email?: string;
  joined: string;
  status: 'active' | 'blocked';
  verified: boolean;
};

type Post = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  date: string;
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const blockUser = async (id: string) => {
    try {
      const res = await fetch('/api/admin/block-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
  
      const data = await res.json();
  
      if (data.success) {
        setUsers(prev => 
          prev.map(user => user.id === id ? { ...user, status: data.status } : user)
        );
        toast.success(data.message || 'User status updated');
      } else {
        toast.error(data.message || 'Failed to update user');
      }
    } catch (err) {
      toast.error('Something went wrong');
      console.error("Error blocking user:", err);
    }
  };
  
  const deleteUser = async (id: string) => {
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
  
      const data = await res.json();
  
      if (data.success) {
        setUsers(prev => prev.filter(user => user.id !== id));
        toast.success(data.message || 'User deleted successfully');
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error deleting user:', error);
    }
  };
  
  const verifyUser = async (id: string) => {
    try {
      const res = await fetch('/api/admin/verify-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
  
      const data = await res.json();
  
      if (data.success) {
        setUsers(prev =>
          prev.map(user => user.id === id ? { ...user, verified: data.isVerified } : user)
        );
        toast.success(data.message || 'Verification updated');
      } else {
        toast.error(data.message || 'Verification failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error verifying user:', error);
    }
  };
  
  const deletePost = async (id: string) => {
    try {
      const res = await fetch('/api/admin/delete-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
  
      const data = await res.json();
  
      if (data.success) {
        setPosts(prev => prev.filter(post => post.id !== id));
        toast.success(data.message || 'Post deleted');
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error deleting post:', error);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("/api/admin/users");
        const userData = await userRes.json();
        if (userData.success) {
          setUsers(userData.users.map((u: any) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            joined: new Date(u.createdAt).toLocaleDateString(),
            status: u.status || "active",
            verified: u.isVerified,
          })));
        }
  
        const postRes = await fetch("/api/admin/posts");
        const postData = await postRes.json();
        if (postData.success) {
          setPosts(postData.posts.map((p: any) => ({
            id: p._id,
            userId: p.author?._id,
            userName: p.author?.name ,
            content: p.question,
            date: new Date(p.createdAt).toLocaleDateString(),
          })));
        }
        console.log("data :",postData);
        
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };
  
    fetchData();
  }, []);



  

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">Querly Admin</h1>
          ) : (
            <h1 className="text-xl font-bold">Q</h1>
          )}
          <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-700">
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
              >
                <FiHome className="mr-3" />
                {sidebarOpen && 'Dashboard'}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('users')}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
              >
                <FiUsers className="mr-3" />
                {sidebarOpen && 'Users'}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('posts')}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'posts' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
              >
                <FiFileText className="mr-3" />
                {sidebarOpen && 'Posts'}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('verification')}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'verification' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
              >
                <FiCheckCircle className="mr-3" />
                {sidebarOpen && 'Verification'}
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={toggleDarkMode}
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700"
          >
            <FiSettings className="mr-3" />
            {sidebarOpen && (darkMode ? 'Light Mode' : 'Dark Mode')}
          </button>
          <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700">
            <FiLogOut className="mr-3" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
              <Toaster position="top-center" />
        <header className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold capitalize">{activeTab}</h2>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className={`pl-10 pr-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
              />
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {/* Dashboard Stats */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-medium mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-blue-500">{users.length}</p>
              </div>
              <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-medium mb-2">Total Posts</h3>
                <p className="text-3xl font-bold text-green-500">{posts.length}</p>
              </div>
              <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-medium mb-2">Verified Users</h3>
                <p className="text-3xl font-bold text-purple-500">{users.filter(u => u.verified).length}</p>
              </div>
            </div>
          )}
          
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className={`rounded-lg shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-4 flex justify-between items-center border-b border-gray-700">
                <h3 className="text-lg font-medium">User Management</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <FiDownload className="mr-2" />
                  Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className="p-3 text-left">ID</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Joined</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Verified</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className="p-3">{user.id}</td>
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.joined}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.verified ? 'bg-purple-500 text-white' : 'bg-yellow-500 text-white'}`}>
                            {user.verified ? 'Verified' : 'Not Verified'}
                          </span>
                        </td>
                        <td className="p-3 flex space-x-2">
                          <button 
                            onClick={() => blockUser(user.id)}
                            className={`px-3 py-1 rounded ${user.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                          >
                            {user.status === 'active' ? 'Block' : 'Unblock'}
                          </button>
                          <button 
                            onClick={() => deleteUser(user.id)}
                            className="px-3 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className={`rounded-lg shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-medium">Post Management</h3>
              </div>
              <div className="divide-y divide-gray-700">
                {posts.map(post => (
                  <div key={post.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{post.userName}</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{post.date}</p>
                      </div>
                      <button 
                        onClick={() => deletePost(post.id)}
                        className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </div>
                    <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{post.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Verification Tab */}
          {activeTab === 'verification' && (
            <div className={`rounded-lg shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-medium">User Verification</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className="p-3 text-left">ID</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Verification</th>
                      <th className="p-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className="p-3">{user.id}</td>
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.verified ? 'bg-purple-500 text-white' : 'bg-yellow-500 text-white'}`}>
                            {user.verified ? 'Verified' : 'Not Verified'}
                          </span>
                        </td>
                        <td className="p-3">
                          <button 
                            onClick={() => verifyUser(user.id)}
                            className={`px-3 py-1 rounded ${user.verified ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
                          >
                            {user.verified ? 'Unverify' : 'Verify'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;