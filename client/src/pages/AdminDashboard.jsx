import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import adminService from '../services/adminService';

import { getLeaderboard, deleteSubmission } from '../services/submissionService';
import settingsService from '../services/settingsService';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import '../styles/AdminDashboard.css';
import { Trophy } from 'lucide-react';

const AdminDashboard = () => {
  const [participants, setParticipants] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('participant');
  const [uploadEnabled, setUploadEnabled] = useState(false);
  const [paymentQrUrl, setPaymentQrUrl] = useState('');
  const [qrFile, setQrFile] = useState(null);
  const [qrUploading, setQrUploading] = useState(false);
  const getBaseUrl = () => { const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; return apiUrl.replace('/api', ''); };
  const { user } = useContext(AuthContext);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [participantsData, settingsData, leaderboardData] = await Promise.all([
          adminService.getAllParticipants(),
          settingsService.getSettings(user.token),
          getLeaderboard()
        ]);
        setParticipants(participantsData);
        setLeaderboard(leaderboardData);
        setUploadEnabled(settingsData.uploadEnabled);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch admin data');
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="alert alert-error">{error}</div>
        </div>
      </div>
    );
  }

  
  
  
  const handleDeleteQr = async () => {
    if (window.confirm('Are you sure you want to delete the payment QR code?')) {
      try {
        const newSettings = await settingsService.deleteQr();
        setPaymentQrUrl(newSettings.paymentQrUrl);
        alert('QR code deleted successfully');
      } catch (err) {
        alert('Failed to delete QR code: ' + err.message);
      }
    }
  };

  const handleQrUpload = async (e) => {
    e.preventDefault();
    if (!qrFile) return;
    setQrUploading(true);
    try {
      const formData = new FormData();
      formData.append('qr', qrFile);
      const newSettings = await settingsService.uploadQr(formData);
      setPaymentQrUrl(newSettings.paymentQrUrl);
      setQrFile(null);
      alert('QR Code uploaded successfully!');
    } catch (err) {
      alert('Failed to upload QR: ' + err.message);
    } finally {
      setQrUploading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveUser(id);
      setParticipants(participants.map(p => p._id === id ? { ...p, isApproved: true } : p));
    } catch (err) {
      alert('Failed to approve user: ' + err.message);
    }
  };

  const handleToggleUpload = async () => {
    try {
      const newSettings = await settingsService.toggleUpload(user.token);
      setUploadEnabled(newSettings.uploadEnabled);
    } catch (err) {
      alert('Failed to toggle upload: ' + err.message);
    }
  };

  const handleDelete = async (id, role) => {
    if (window.confirm(`Are you sure you want to delete this ${role}? This action cannot be undone.`)) {
      try {
        await adminService.deleteUser(id);
        setParticipants(participants.filter(p => p._id !== id));
        // If participant, also remove from leaderboard
        if (role === 'participant') {
          setLeaderboard(leaderboard.filter(sub => sub.participant._id !== id));
        }
      } catch (err) {
        alert('Failed to delete user: ' + err.message);
      }
    }
  };

  const handleDeletePhoto = async (submissionId) => {
    if (window.confirm('Are you sure you want to delete this photo? The participant will be able to upload a new one if uploads are still open.')) {
      try {
        await deleteSubmission(submissionId);
        setLeaderboard(leaderboard.filter(sub => sub._id !== submissionId));
      } catch (err) {
        alert('Failed to delete photo: ' + err.message);
      }
    }
  };

  const handleEditClick = (user) => {
    setEditingId(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      rollNumber: user.rollNumber || '',
      course: user.course || '',
      branch: user.branch || '',
      year: user.year || ''
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const updatedUser = await adminService.updateUser(id, editForm);
      setParticipants(participants.map(p => p._id === id ? { ...p, ...updatedUser } : p));
      setEditingId(null);
    } catch (err) {
      alert('Failed to update user: ' + err.message);
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="admin-header">
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Manage photography event registrations and results</p>
          </div>

          <div className="upload-controls" style={{ background: 'var(--color-surface)', padding: '20px', borderRadius: '12px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--color-border)' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Global Image Uploads</h3>
              <p style={{ margin: '5px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                Status: <strong style={{ color: uploadEnabled ? '#2ecc71' : '#e74c3c' }}>{uploadEnabled ? 'OPEN' : 'CLOSED'}</strong>
              </p>
            </div>
            <button 
              onClick={handleToggleUpload}
              style={{
                background: uploadEnabled ? '#e74c3c' : '#2ecc71',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: '0.2s'
              }}
            >
              {uploadEnabled ? 'Close Uploading for Everyone' : 'Open Uploading for Everyone'}
            </button>
          </div>

          
          <div className="admin-controls" style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ marginBottom: '10px' }}>Registration Payment QR Code</h3>
            {paymentQrUrl && (
              <div style={{ marginBottom: '15px' }}>
                <p>Current QR Code:</p>
                <img src={paymentQrUrl.startsWith('http') ? paymentQrUrl : getBaseUrl() + paymentQrUrl} alt="Payment QR" style={{ maxWidth: '150px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '10px' }} />
                <div>
                  <button onClick={handleDeleteQr} className="portal-btn" style={{ background: '#e74c3c', color: 'white', padding: '5px 10px', fontSize: '0.9rem', width: 'auto' }}>
                    Delete QR Code
                  </button>
                </div>
              </div>
            )}
            <form onSubmit={handleQrUpload} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="file" accept="image/*" onChange={(e) => setQrFile(e.target.files[0])} required />
              <button type="submit" className="portal-btn active" disabled={qrUploading} style={{ padding: '8px 15px', height: 'auto', background: '#3498db' }}>
                {qrUploading ? 'Uploading...' : 'Upload QR Code'}
              </button>
            </form>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-title">Total Contestants</h3>
              <p className="stat-value">{participants.filter(p => p.role === 'participant').length}</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Total Viewers</h3>
              <p className="stat-value">{participants.filter(p => p.role === 'viewer').length}</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Total Submissions</h3>
              <p className="stat-value">{leaderboard.length}</p>
            </div>
          </div>

          <div className="portal-toggle" style={{ maxWidth: '600px', margin: '0 auto 30px' }}>
            <button className={`portal-btn ${activeTab === 'participant' ? 'active' : ''}`} onClick={() => setActiveTab('participant')}>Contestants</button>
            <button className={`portal-btn ${activeTab === 'viewer' ? 'active' : ''}`} onClick={() => setActiveTab('viewer')}>Viewers</button>
            <button className={`portal-btn ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>Leaderboard</button>
          </div>

          <div className="table-container">
            {activeTab === 'leaderboard' ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Image</th>
                    <th>Contestant</th>
                    <th>Theme</th>
                    <th>Votes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((sub, index) => (
                    <tr key={sub._id}>
                      <td>
                        {index === 0 ? <Trophy color="#f1c40f" size={24} /> : 
                         index === 1 ? <Trophy color="#bdc3c7" size={24} /> : 
                         index === 2 ? <Trophy color="#cd7f32" size={24} /> : 
                         <span style={{ fontWeight: 'bold', fontSize: '1.2rem', paddingLeft: '8px' }}>#{index + 1}</span>}
                      </td>
                      <td>
                        <a href={sub.imageUrl} target="_blank" rel="noopener noreferrer">
                          <img src={sub.imageUrl} alt="Submission" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                        </a>
                      </td>
                      <td>
                        <div style={{ fontWeight: '500' }}>{sub.participant.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{sub.participant.rollNumber}</div>
                      </td>
                      <td><span className="theme-badge">{sub.theme}</span></td>
                      <td style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-accent)' }}>{sub.votes}</td>
                      <td>
                        <button 
                          onClick={() => handleDeletePhoto(sub._id)} 
                          style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
                        >
                          Delete Photo
                        </button>
                      </td>
                    </tr>
                  ))}
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>
                        No images submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email & Phone</th>
                    {activeTab === 'participant' && (
                      <>
                        <th>Roll Number</th>
                        <th>Course / Branch</th>
                        <th>Theme</th>
                      </>
                    )}
                    <th>Registration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.filter(p => p.role === activeTab).map((p) => (
                    <tr key={p._id}>
                      {editingId === p._id ? (
                        <>
                          <td><input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="auth-input" style={{padding: '5px', marginBottom: 0}} /></td>
                          <td>
                            <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="auth-input" style={{padding: '5px', marginBottom: '4px'}} />
                            <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="auth-input" style={{padding: '5px', marginBottom: 0}} />
                          </td>
                          {activeTab === 'participant' && (
                            <>
                              <td><input type="text" value={editForm.rollNumber} onChange={(e) => setEditForm({...editForm, rollNumber: e.target.value})} className="auth-input" style={{padding: '5px', marginBottom: 0}} /></td>
                              <td>
                                <input type="text" value={editForm.course} onChange={(e) => setEditForm({...editForm, course: e.target.value})} placeholder="Course" className="auth-input" style={{padding: '5px', marginBottom: '4px', width: '60px'}} />
                                <input type="text" value={editForm.branch} onChange={(e) => setEditForm({...editForm, branch: e.target.value})} placeholder="Branch" className="auth-input" style={{padding: '5px', marginBottom: '4px', width: '60px'}} />
                                <input type="text" value={editForm.year} onChange={(e) => setEditForm({...editForm, year: e.target.value})} placeholder="Year" className="auth-input" style={{padding: '5px', marginBottom: 0, width: '60px'}} />
                              </td>
                              <td><span className="theme-badge">{p.selectedTheme}</span></td>
                            </>
                          )}
                          <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button onClick={() => handleSaveEdit(p._id)} className="auth-btn" style={{padding: '5px 10px', fontSize: '0.8rem', width: 'auto', display: 'inline-block', marginRight: '5px'}}>Save</button>
                            <button onClick={() => setEditingId(null)} className="auth-btn" style={{padding: '5px 10px', fontSize: '0.8rem', width: 'auto', display: 'inline-block', background: '#ccc', color: '#333'}}>Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{fontWeight: '500'}}>{p.name}</td>
                          <td>
                            <div>{p.email}</div>
                            <div style={{fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px'}}>{p.phone}</div>
                          </td>
                          
                          {activeTab === 'participant' && (
                            <>
                              <td>{p.rollNumber}</td>
                              <td>{p.course}{p.branch !== 'Other' ? ` - ${p.branch}` : ''} ({p.year})</td>
                              <td><span className="theme-badge">{p.selectedTheme}</span></td>
                            </>
                          )}
                          
                          <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                          <td>
                            {!p.isApproved && p.role === 'participant' && <button onClick={() => handleApprove(p._id)} style={{background: '#2ecc71', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px'}}>Approve</button>}
                            <button onClick={() => handleEditClick(p)} style={{background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', marginRight: '10px'}}>Edit</button>
                            <button onClick={() => handleDelete(p._id, p.role)} style={{background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer'}}>Delete</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  {participants.filter(p => p.role === activeTab).length === 0 && (
                    <tr>
                      <td colSpan={activeTab === 'participant' ? "7" : "4"} style={{textAlign: 'center', padding: '40px'}}>
                        No {activeTab}s registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
