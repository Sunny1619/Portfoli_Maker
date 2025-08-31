import React, { useState, useEffect } from 'react';
import { authenticatedFetch, logout, API_BASE_URL, isAuthenticated } from './utils/auth';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Authentication guard
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Fetch profile data from backend
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      const response = await authenticatedFetch(`${API_BASE_URL}/profile/`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProfileData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data. Please try again.');
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const getSkillLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'expert': return '#28a745';
      case 'advanced': return '#007bff';
      case 'intermediate': return '#ffc107';
      case 'beginner': return '#6c757d';
      default: return '#6c757d';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading profile...</div>
          <div style={{ color: '#6c757d' }}>Please wait while we fetch your data</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !profileData) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px', color: '#dc3545' }}>Error loading profile</div>
          <div style={{ color: '#6c757d', marginBottom: '20px' }}>{error}</div>
          <button 
            onClick={fetchProfileData}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, sans-serif',
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
                Welcome, {profileData?.user?.first_name || 'User'}
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
                  color: '#212529',
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'block',
                  padding: '4px 0',
                  fontWeight: '500'
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
            Portfolio Builder System &gt; Profile Dashboard
          </div>

          {/* Profile Header */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #dee2e6',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#212529',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                <span style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}>
                  {profileData.user.first_name?.[0] || 'U'}{profileData.user.last_name?.[0] || 'N'}
                </span>
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#212529', margin: '0 0 4px' }}>
                  {profileData.user.first_name || ''} {profileData.user.last_name || ''}
                </h2>
                <p style={{ fontSize: '14px', color: '#6c757d', margin: '0' }}>
                  @{profileData.user.username} • {profileData.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* Left Column */}
            <div>
              {/* Skills Section */}
              <div id="skills" style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#212529', marginBottom: '16px' }}>
                  Skills ({profileData.skills?.length || 0})
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profileData.skills?.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <div key={index} style={{
                        backgroundColor: '#f8f9fa',
                        border: `1px solid ${getSkillLevelColor(skill.level)}`,
                        borderRadius: '16px',
                        padding: '6px 12px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span style={{ fontWeight: '500', color: '#212529' }}>{skill.name}</span>
                        <span style={{ 
                          fontSize: '12px', 
                          color: getSkillLevelColor(skill.level),
                          fontWeight: '500'
                        }}>
                          {skill.level}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '14px', color: '#6c757d', margin: '0' }}>
                      No skills added yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Work Experience Section */}
              <div id="work" style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#212529', marginBottom: '16px' }}>
                  Work Experience
                </h3>
                <p style={{ fontSize: '14px', color: '#6c757d', lineHeight: '1.6', margin: '0' }}>
                  {profileData.work || 'No work experience added yet.'}
                </p>
              </div>

              {/* Education Section */}
              <div id="education" style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#212529', marginBottom: '16px' }}>
                  Education
                </h3>
                <p style={{ fontSize: '14px', color: '#6c757d', lineHeight: '1.6', margin: '0' }}>
                  {profileData.education || 'No education information added yet.'}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Projects Section */}
              <div id="projects" style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#212529', marginBottom: '16px' }}>
                  Projects ({profileData.projects?.length || 0})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {profileData.projects?.length > 0 ? (
                    profileData.projects.map((project, index) => (
                      <div key={index} style={{
                        border: '1px solid #dee2e6',
                        borderRadius: '6px',
                        padding: '16px'
                      }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#212529', margin: '0 0 8px' }}>
                          {project.title}
                        </h4>
                        <p style={{ fontSize: '14px', color: '#6c757d', lineHeight: '1.5', margin: '0 0 12px' }}>
                          {project.description}
                        </p>
                        {project.links && (() => {
                          try {
                            const parsedLinks = JSON.parse(project.links);
                            if (Array.isArray(parsedLinks) && parsedLinks.length > 0) {
                              return (
                                <div style={{ marginBottom: '8px' }}>
                                  {parsedLinks.map((link, linkIndex) => (
                                    <a 
                                      key={linkIndex}
                                      href={link.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      style={{
                                        fontSize: '13px',
                                        color: '#212529',
                                        textDecoration: 'none',
                                        fontWeight: '500',
                                        display: 'inline-block',
                                        marginRight: '12px',
                                        marginBottom: '4px'
                                      }}
                                    >
                                      🔗 {link.type}
                                    </a>
                                  ))}
                                </div>
                              );
                            }
                          } catch (e) {
                            // If JSON parsing fails, treat as direct URL (backwards compatibility)
                            return (
                              <a href={project.links} target="_blank" rel="noopener noreferrer" style={{
                                fontSize: '13px',
                                color: '#212529',
                                textDecoration: 'none',
                                fontWeight: '500',
                                display: 'block',
                                marginBottom: '8px'
                              }}>
                                🔗 View Project
                              </a>
                            );
                          }
                          return null;
                        })()}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {project.skills?.map((skill, skillIndex) => (
                            <span key={skillIndex} style={{
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #dee2e6',
                              borderRadius: '12px',
                              padding: '2px 8px',
                              fontSize: '12px',
                              color: '#6c757d'
                            }}>
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '14px', color: '#6c757d', margin: '0' }}>
                      No projects added yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Social Links Section */}
              <div id="links" style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#212529', marginBottom: '16px' }}>
                  Social Links
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {profileData.github && (
                    <a href={profileData.github} target="_blank" rel="noopener noreferrer" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#212529',
                      textDecoration: 'none',
                      padding: '8px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px'
                    }}>
                      <span>🐙</span> GitHub
                    </a>
                  )}
                  {profileData.linkedin && (
                    <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#212529',
                      textDecoration: 'none',
                      padding: '8px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px'
                    }}>
                      <span>💼</span> LinkedIn
                    </a>
                  )}
                  {profileData.portfolio && (
                    <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#212529',
                      textDecoration: 'none',
                      padding: '8px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px'
                    }}>
                      <span>🌐</span> Portfolio Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
