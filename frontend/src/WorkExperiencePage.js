import React, { useState, useEffect } from 'react';
import { logout, authenticatedFetch, API_BASE_URL, isAuthenticated } from './utils/auth';
import { useNavigate } from 'react-router-dom';

function WorkExperiencePage() {
  const navigate = useNavigate();
  const [workText, setWorkText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');

  // Authentication guard
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Fetch work experience from backend
  const fetchWorkExperience = async () => {
    try {
      setLoading(true);
      
      const response = await authenticatedFetch(`${API_BASE_URL}/work-experience/`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch work experience');
      }

      const data = await response.json();
      setWorkText(data.work || '');
      setError(null);
    } catch (err) {
      console.error('Error fetching work experience:', err);
      setError(`Failed to load work experience: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkExperience();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(workText);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const response = await authenticatedFetch(`${API_BASE_URL}/work-experience/`, {
        method: 'POST',
        body: JSON.stringify({ work: editText }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save work experience: ${errorText}`);
      }

      setWorkText(editText);
      setIsEditing(false);
      alert('Work experience saved successfully!');
    } catch (error) {
      console.error('Error saving work experience:', error);
      alert(`Failed to save work experience: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading work experience...</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      paddingTop: '60px'
    }}>
      {/* Top Navigation */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #dee2e6',
        padding: '12px 0',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <div style={{ padding: '0 24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <a href="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  backgroundColor: '#212529',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  marginRight: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="white" strokeWidth="2"/>
                    <polyline points="14,2 14,8 20,8" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#212529' }}>Portfolio Builder</div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>V 1.0</div>
                </div>
              </div>
            </a>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#6c757d' }}>
                Welcome, User
              </span>
              <button style={{
                backgroundColor: '#212529',
                color: 'white',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Edit Profile
              </button>
              <button 
                onClick={logout}
                style={{
                color: '#6c757d',
                backgroundColor: 'transparent',
                border: '1px solid #dee2e6',
                padding: '6px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ minHeight: 'calc(100vh - 60px)' }}>
        {/* Left Sidebar */}
        <div style={{
          position: 'fixed',
          left: 0,
          top: '60px',
          width: '250px',
          height: 'calc(100vh - 60px)',
          backgroundColor: 'white',
          borderRight: '1px solid #dee2e6',
          padding: '20px 0',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '0 20px' }}>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0 
            }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="/profile" style={{
                  color: '#6c757d',
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'block',
                  padding: '4px 0'
                }}>Profile</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/skills" style={{
                  color: '#6c757d',
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'block',
                  padding: '4px 0'
                }}>Skills</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/projects" style={{
                  color: '#6c757d',
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'block',
                  padding: '4px 0'
                }}>Projects</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/work-experience" style={{
                  color: '#212529',
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'block',
                  padding: '4px 0',
                  fontWeight: '500'
                }}>Work Experience</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/education" style={{
                  color: '#6c757d',
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'block',
                  padding: '4px 0'
                }}>Education</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/social-links" style={{
                  color: '#6c757d',
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'block',
                  padding: '4px 0'
                }}>Social Links</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ 
          marginLeft: '250px', 
          padding: '40px',
          minHeight: 'calc(100vh - 60px)'
        }}>
          {/* Breadcrumb */}
          <div style={{ 
            fontSize: '14px', 
            color: '#6c757d', 
            marginBottom: '20px' 
          }}>
            Portfolio Builder System &gt; Work Experience
          </div>

          {/* Work Experience Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #dee2e6',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#212529' }}>
                Work Experience
              </h2>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
              )}
            </div>

            {error && (
              <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '16px',
                border: '1px solid #f5c6cb'
              }}>
                {error}
              </div>
            )}

            {!isEditing ? (
              <div>
                {workText ? (
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    padding: '16px',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6',
                    fontSize: '14px'
                  }}>
                    {workText}
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    padding: '40px',
                    textAlign: 'center',
                    color: '#6c757d'
                  }}>
                    <p style={{ margin: '0 0 16px 0' }}>No work experience added yet.</p>
                    <button
                      onClick={handleEdit}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Add Work Experience
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#212529'
                  }}>
                    Work Experience
                  </label>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      fontSize: '14px',
                      minHeight: '200px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    placeholder="Add your work experience here...

Example:
Software Engineer at Google (2020-2023)
- Developed web applications using React and Node.js
- Led a team of 5 developers

Frontend Developer at Startup (2018-2020)
- Built responsive websites
- Improved page load times by 40%"
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleCancel}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#6c757d',
                      border: '1px solid #dee2e6',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      backgroundColor: saving ? '#6c757d' : '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: saving ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkExperiencePage;
