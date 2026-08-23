import { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardData } from '../services/participantService';
import settingsService from '../services/settingsService';
import { uploadSubmission, getMySubmission, getSubmissionsByTheme, voteForSubmission } from '../services/submissionService';
import { AuthContext } from '../context/AuthContext';
import { THEMES } from './Register'; // Assuming THEMES is exported or we can redefine them
import '../styles/Dashboard.css';
import { UploadCloud, CheckCircle, Image as ImageIcon } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Contestant states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadEnabled, setUploadEnabled] = useState(false);
  const fileInputRef = useRef(null);

  // Viewer states
  const [viewerThemes, setViewerThemes] = useState([
    'Nature & Greenery',
    'Reflections & Perspectives',
    'Views Through a Frame',
    'Everyday Objects, Extraordinary Frames'
  ]);
  const [selectedViewerTheme, setSelectedViewerTheme] = useState(null);
  const [themeSubmissions, setThemeSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [votingSubmissionId, setVotingSubmissionId] = useState(null); // For the confirmation modal
  const [viewingImage, setViewingImage] = useState(null); // For the full screen lightbox

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
        
        if (user.role === 'participant') {
          try {
            const [sub, settings] = await Promise.all([
              getMySubmission().catch(() => null),
              settingsService.getSettings()
            ]);
            if (sub) setMySubmission(sub);
            if (settings) setUploadEnabled(settings.uploadEnabled);
          } catch (e) {
            console.log("Error loading participant data", e);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const sub = await uploadSubmission(formData);
      setMySubmission(sub);
      setUploadSuccess(true);
    } catch (err) {
      alert(err.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const loadThemeSubmissions = async (themeTitle) => {
    setSelectedViewerTheme(themeTitle);
    setLoadingSubmissions(true);
    try {
      const subs = await getSubmissionsByTheme(themeTitle);
      setThemeSubmissions(subs);
    } catch (err) {
      alert('Failed to load submissions for this theme.');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleVoteConfirm = async () => {
    if (!votingSubmissionId) return;
    try {
      const res = await voteForSubmission(votingSubmissionId);
      alert('Vote cast successfully!');
      // Update local state to reflect voted theme
      const updatedUser = { ...user, votedThemes: res.votedThemes };
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Very basic context update hack or trigger context refresh
      window.location.reload(); // Quick refresh to update state correctly
    } catch (err) {
      alert(err.message || 'Failed to cast vote.');
      setVotingSubmissionId(null);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your event profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error container" style={{ paddingTop: '120px' }}>
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  
    if (!data || !data.participant) {
      return (
        <div className="dashboard-error container" style={{ paddingTop: '120px' }}>
          <h2>Error Loading Dashboard Data</h2>
          <p>We could not find your participant data.</p>
        </div>
      );
    }
    const { participant, eventUpdates } = data;


  return (
    <div className="dashboard-container" style={{ paddingBottom: '60px' }}>
      <div className="dashboard-header">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome, {participant?.name ? participant.name.split(' ')[0] : 'Participant'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {user.role === 'participant' ? 'Participant Portal' : 'Viewer Portal'}
          </motion.p>
        </div>
      </div>

      {user.role === 'participant' ? (
        <div className="container dashboard-grid">
          <motion.div 
            className="dashboard-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* CONTESTANT VIEW */}
            <div className="dash-card profile-card" style={{ marginBottom: '24px' }}>
              <h3>Participant Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="label">Name</span>
                  <span className="value">{participant.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Roll Number</span>
                  <span className="value">{participant.rollNumber}</span>
                </div>
                <div className="info-item">
                  <span className="label">Theme</span>
                  <span className="value">{participant.selectedTheme}</span>
                </div>
              </div>
            </div>

            <div className="dash-card submission-card">
              <h3>Your Submission</h3>
              {mySubmission ? (
                <div className="submitted-view">
                  <div className="success-banner" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                    <CheckCircle size={20} />
                    <strong>Image Submitted Successfully!</strong>
                  </div>
                  <img src={mySubmission.imageUrl} alt="My Submission" style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                  <p style={{ marginTop: '15px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>You have successfully submitted your image for the <strong>{mySubmission.theme}</strong> category. Good luck!</p>
                </div>
              ) : (
                <div className="upload-view">
                  {uploadEnabled ? (
                    <>
                      <p style={{ marginBottom: '15px', color: 'var(--color-text-secondary)' }}>Upload your best photo for your selected theme. You can only submit <strong>ONE</strong> image.</p>
                      
                      <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        style={{ display: 'none' }} 
                      />

                      {!previewUrl ? (
                        <div 
                          className="upload-dropzone" 
                          onClick={() => fileInputRef.current.click()}
                          style={{ border: '2px dashed var(--color-border)', borderRadius: '8px', padding: '40px', textAlign: 'center', cursor: 'pointer', transition: '0.2s' }}
                        >
                          <UploadCloud size={40} color="var(--color-accent)" style={{ marginBottom: '10px' }} />
                          <p>Click to select your image</p>
                          <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>JPG, JPEG, or PNG</span>
                        </div>
                      ) : (
                        <div className="upload-preview">
                          <img src={previewUrl} alt="Preview" style={{ width: '100%', borderRadius: '8px', marginBottom: '15px', maxHeight: '400px', objectFit: 'contain', background: '#000' }} />
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="nav-btn-outline" style={{ flex: 1 }} onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} disabled={uploading}>Change</button>
                            <button className="nav-btn" style={{ flex: 2 }} onClick={handleUpload} disabled={uploading}>
                              {uploading ? 'Uploading...' : 'Submit Final Image'}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px dashed #ccc', marginTop: '20px' }}>
                      <h4 style={{ color: '#666', margin: 0, fontWeight: 500 }}>Uploading time will open soon stay tuned ..</h4>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            className="dashboard-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="dash-card updates-card">
              <h3>Event Updates</h3>
              {eventUpdates.map(update => (
                <div key={update.id} className="update-item">
                  <div className="update-date">{new Date(update.date).toLocaleDateString()}</div>
                  <h4>{update.title}</h4>
                  <p>{update.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        // VIEWER VIEW
        <div className="container" style={{ marginTop: '30px' }}>
          {!selectedViewerTheme ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="dash-card profile-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Voting Categories</h3>
                <p style={{ marginBottom: '25px', color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>Select a theme below to view the submissions in full screen and cast your vote.</p>
                
                <div className="viewer-themes-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {viewerThemes.map(theme => {
                    const hasVoted = user.votedThemes?.includes(theme);
                    
                    return (
                      <div 
                        key={theme} 
                        onClick={() => loadThemeSubmissions(theme)}
                        style={{ 
                          padding: '30px 20px', 
                          border: `1px solid var(--color-border)`, 
                          borderRadius: '12px', 
                          cursor: 'pointer',
                          background: 'rgba(139, 115, 85, 0.05)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                          transition: '0.3s'
                        }}
                        className="theme-hover-card"
                      >
                        <span style={{ fontWeight: '600', fontSize: '1.2rem', marginBottom: '10px' }}>{theme}</span>
                        {hasVoted ? (
                          <span style={{ fontSize: '0.85rem', background: '#2ecc71', color: '#fff', padding: '4px 12px', borderRadius: '12px' }}>Vote Cast</span>
                        ) : (
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-accent)' }}>Click to view & vote</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            // FULL SCREEN THEME GALLERY
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--color-bg)', zIndex: 100, overflowY: 'auto', padding: '120px 20px 60px 20px' }}
            >
              <div className="container" style={{ maxWidth: '1200px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', marginBottom: '40px', gap: '15px' }}>
                  <div style={{ flex: '1', minWidth: '100px' }}>
                    <button className="nav-btn-outline" onClick={() => setSelectedViewerTheme(null)} style={{ border: 'none', padding: '5px 10px', background: 'transparent', color: 'var(--color-text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: '500' }}>&larr; Back</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.2rem', margin: 0, fontWeight: '600', fontFamily: 'system-ui, -apple-system, sans-serif', color: 'var(--color-text-primary)', letterSpacing: '-0.5px' }}>{selectedViewerTheme}</h3>
                  </div>
                  <div style={{ display: 'flex', flex: '1', justifyContent: 'flex-end', alignItems: 'center', gap: '15px', minWidth: '100px' }}>
                    {user.votedThemes?.includes(selectedViewerTheme) && (
                      <span style={{ color: '#2ecc71', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                        <CheckCircle size={14} /> Voted
                      </span>
                    )}
                    <span style={{ fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: '600' }}>{themeSubmissions.length} ENTRIES</span>
                  </div>
                </div>

                {loadingSubmissions ? (
                  <div style={{ padding: '80px', textAlign: 'center', fontSize: '1.2rem' }}>Loading breathtaking shots...</div>
                ) : themeSubmissions.length === 0 ? (
                  <div style={{ padding: '80px', textAlign: 'center', color: 'var(--color-text-secondary)', border: '1px dashed var(--color-border)', borderRadius: '12px' }}>
                    <ImageIcon size={60} style={{ opacity: 0.3, margin: '0 auto 15px' }} />
                    <p style={{ fontSize: '1.2rem' }}>No submissions yet for this theme.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
                    {themeSubmissions.map((sub, index) => (
                      <div key={sub._id} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {/* Image Frame */}
                        <div 
                          style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer' }}
                          onClick={() => setViewingImage(sub)}
                          className="theme-gallery-image"
                        >
                          <img src={sub.imageUrl} alt="Submission" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                          
                          {/* Hover Overlay */}
                          <div className="gallery-hover-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s', fontSize: '1.1rem', fontWeight: '500' }}>
                            <span>Click to see image and vote</span>
                          </div>
                        </div>
                        
                        {/* Meta Data & Vote Button */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'var(--color-text-primary)', fontWeight: '500' }}>{sub.title || `Entry #${index + 1}`}</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>by Participant</p>
                          </div>
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); setViewingImage(sub); }}
                            disabled={user.votedThemes?.includes(selectedViewerTheme)}
                            style={{ 
                              background: 'transparent',
                              border: '1px solid var(--color-border)',
                              color: user.votedThemes?.includes(selectedViewerTheme) ? 'var(--color-text-secondary)' : 'var(--color-accent)',
                              padding: '6px 15px',
                              fontSize: '0.75rem',
                              letterSpacing: '1px',
                              textTransform: 'uppercase',
                              cursor: user.votedThemes?.includes(selectedViewerTheme) ? 'not-allowed' : 'pointer',
                              transition: '0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontWeight: '600'
                            }}
                          >
                            {user.votedThemes?.includes(selectedViewerTheme) ? 'VOTED /' : 'VOTE /'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Full Screen Image Lightbox */}
      <AnimatePresence>
        {viewingImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <button 
              onClick={() => setViewingImage(null)}
              style={{ position: 'absolute', top: '30px', right: '40px', background: 'transparent', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}
            >
              &times;
            </button>
            
            <img 
              src={viewingImage.imageUrl} 
              alt="Full screen" 
              style={{ maxWidth: '90%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} 
            />

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <button 
                onClick={() => {
                  setVotingSubmissionId(viewingImage._id);
                  setViewingImage(null); // Close lightbox to show confirmation modal
                }}
                disabled={user.votedThemes?.includes(selectedViewerTheme)}
                style={{
                  background: user.votedThemes?.includes(selectedViewerTheme) ? '#555' : 'var(--color-accent)',
                  color: '#fff',
                  border: 'none',
                  padding: '15px 40px',
                  borderRadius: '30px',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  cursor: user.votedThemes?.includes(selectedViewerTheme) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}
              >
                {user.votedThemes?.includes(selectedViewerTheme) ? 'Vote Already Cast in this Theme' : 'Vote for this Photography'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voting Confirmation Modal */}
      {votingSubmissionId && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div className="modal-content" style={{ background: 'var(--color-surface)', padding: '40px', borderRadius: '12px', maxWidth: '500px', width: '90%', textAlign: 'center', border: '1px solid var(--color-border)' }}>
            <h2 style={{ marginBottom: '15px', fontSize: '1.8rem' }}>Confirm Your Vote</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Are you sure you want to cast your vote for this image? <br/><br/>You can only cast <strong>one vote</strong> per theme category. This action is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button className="nav-btn-outline" onClick={() => setVotingSubmissionId(null)} style={{ flex: 1 }}>Cancel</button>
              <button className="nav-btn" onClick={handleVoteConfirm} style={{ flex: 1 }}>Yes, Cast Vote</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
