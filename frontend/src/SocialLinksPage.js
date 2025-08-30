import React, { useState, useEffect } from 'react';
import { logout, authenticatedFetch, API_BASE_URL, isAuthenticated } from './utils/auth';
import { useNavigate } from 'react-router-dom';

function SocialLinksPage() {
  const navigate = useNavigate();
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    portfolio: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editLinks, setEditLinks] = useState({
    github: '',
    linkedin: '',
    portfolio: ''
  });

  // Authentication guard
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Fetch social links from backend
  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      
      const response = await authenticatedFetch(`${API_BASE_URL}/social-links/`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch social links');
      }

      const data = await response.json();
      setSocialLinks({
        github: data.github || '',
        linkedin: data.linkedin || '',
        portfolio: data.portfolio || ''
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching social links:', err);
      setError(`Failed to load social links: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditLinks(socialLinks);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditLinks({
      github: '',
      linkedin: '',
      portfolio: ''
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const response = await authenticatedFetch(`${API_BASE_URL}/social-links/`, {
        method: 'POST',
        body: JSON.stringify(editLinks),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save social links: ${errorText}`);
      }

      setSocialLinks(editLinks);
      setIsEditing(false);
      alert('Social links saved successfully!');
    } catch (error) {
      console.error('Error saving social links:', error);
      alert(`Failed to save social links: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading social links...</p>
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
                  color: '#6c757d',
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'block',
                  padding: '4px 0'
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
                  color: '#212529',
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'block',
                  padding: '4px 0',
                  fontWeight: '500'
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
            Portfolio Builder System &gt; Social Links
          </div>

          {/* Social Links Card */}
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
                Social Links
              </h2>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  style={{
                    backgroundColor: '#6f42c1',
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
                {Object.entries(socialLinks).some(([key, value]) => value) ? (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {socialLinks.github && (
                      <div style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <span style={{ fontSize: '20px' }}>🐙</span>
                        <div style={{ flex: 1 }}>
                          <strong style={{ color: '#212529', fontSize: '14px' }}>GitHub</strong>
                          <div style={{ color: '#6c757d', fontSize: '12px' }}>{socialLinks.github}</div>
                        </div>
                        <a
                          href={socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: '#6f42c1',
                            color: 'white',
                            border: 'none',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '12px'
                          }}
                        >
                          Visit
                        </a>
                      </div>
                    )}
                    {socialLinks.linkedin && (
                      <div style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <span style={{ fontSize: '20px' }}>💼</span>
                        <div style={{ flex: 1 }}>
                          <strong style={{ color: '#212529', fontSize: '14px' }}>LinkedIn</strong>
                          <div style={{ color: '#6c757d', fontSize: '12px' }}>{socialLinks.linkedin}</div>
                        </div>
                        <a
                          href={socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: '#6f42c1',
                            color: 'white',
                            border: 'none',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '12px'
                          }}
                        >
                          Visit
                        </a>
                      </div>
                    )}
                    {socialLinks.portfolio && (
                      <div style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <span style={{ fontSize: '20px' }}>🌐</span>
                        <div style={{ flex: 1 }}>
                          <strong style={{ color: '#212529', fontSize: '14px' }}>Portfolio</strong>
                          <div style={{ color: '#6c757d', fontSize: '12px' }}>{socialLinks.portfolio}</div>
                        </div>
                        <a
                          href={socialLinks.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: '#6f42c1',
                            color: 'white',
                            border: 'none',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '12px'
                          }}
                        >
                          Visit
                        </a>
                      </div>
                    )}
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
                    <p style={{ margin: '0 0 16px 0' }}>No social links added yet.</p>
                    <button
                      onClick={handleEdit}
                      style={{
                        backgroundColor: '#6f42c1',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Add Social Links
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
                    🐙 GitHub URL
                  </label>
                  <input
                    type="url"
                    value={editLinks.github}
                    onChange={(e) => setEditLinks({...editLinks, github: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="https://github.com/your-username"
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#212529'
                  }}>
                    💼 LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={editLinks.linkedin}
                    onChange={(e) => setEditLinks({...editLinks, linkedin: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#212529'
                  }}>
                    🌐 Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={editLinks.portfolio}
                    onChange={(e) => setEditLinks({...editLinks, portfolio: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="https://your-portfolio.com"
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
                      backgroundColor: saving ? '#6c757d' : '#6f42c1',
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

export default SocialLinksPage;
