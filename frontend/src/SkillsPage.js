import React, { useState, useEffect } from 'react';
import { authenticatedFetch, logout, API_BASE_URL, isAuthenticated } from './utils/auth';
import { useNavigate } from 'react-router-dom';

function SkillsPage() {
  const navigate = useNavigate();
  const [existingSkills, setExistingSkills] = useState([]);
  const [newSkills, setNewSkills] = useState([]);
  const [isAddingSkills, setIsAddingSkills] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  // Authentication guard
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Fetch skills from backend
  const fetchSkills = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching skills...');
      
      const response = await authenticatedFetch(`${API_BASE_URL}/skills/`, {
        method: 'GET',
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const skills = await response.json();
      console.log('Received skills:', skills);
      console.log('Skills type:', typeof skills);
      console.log('Is array:', Array.isArray(skills));
      
      // Handle different response formats
      let skillsArray = [];
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (skills && typeof skills === 'object' && skills.results) {
        // Paginated response
        skillsArray = skills.results;
      } else if (skills && typeof skills === 'object') {
        // Single object response - convert to array
        skillsArray = [skills];
      } else {
        // Unexpected format
        console.warn('Unexpected skills response format:', skills);
        skillsArray = [];
      }
      
      setExistingSkills(skillsArray.map((skill, index) => ({
        id: index + 1, // Add id for frontend use
        name: skill.name,
        level: skill.level
      })));
      setError(null);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError(`Failed to load skills: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Save new skills to backend
  const saveNewSkills = async () => {
    try {
      setSaving(true);
      
      // Filter out empty skills
      const validSkills = newSkills.filter(skill => skill.name.trim() !== '');
      
      if (validSkills.length === 0) {
        setError('Please add at least one skill');
        return;
      }

      const response = await authenticatedFetch(`${API_BASE_URL}/skills/`, {
        method: 'POST',
        body: JSON.stringify(validSkills),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save skills');
      }

      // Refresh skills list
      await fetchSkills();
      
      // Reset form
      setIsAddingSkills(false);
      setNewSkills([]);
      setError(null);
    } catch (err) {
      console.error('Error saving skills:', err);
      setError(err.message || 'Failed to save skills');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const getSkillLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'expert': return '#28a745';
      case 'advanced': return '#007bff';
      case 'intermediate': return '#ffc107';
      case 'beginner': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const handleAddNewSkillsMode = () => {
    setIsAddingSkills(true);
    setNewSkills([{ name: '', level: 'Beginner' }]);
  };

  const handleNewSkillChange = (index, field, value) => {
    const updatedSkills = newSkills.map((skill, i) => 
      i === index ? { ...skill, [field]: value } : skill
    );
    setNewSkills(updatedSkills);
  };

  const addMoreNewSkill = () => {
    setNewSkills([...newSkills, { name: '', level: 'Beginner' }]);
  };

  const removeNewSkill = (index) => {
    if (newSkills.length > 1) {
      setNewSkills(newSkills.filter((_, i) => i !== index));
    }
  };

  const handleSaveNewSkills = async () => {
    await saveNewSkills();
  };

  const handleCancelAddSkills = () => {
    setNewSkills([]);
    setIsAddingSkills(false);
  };

  const groupSkillsByLevel = (skills) => {
    return skillLevels.reduce((acc, level) => {
      acc[level] = skills.filter(skill => skill.level === level);
      return acc;
    }, {});
  };

  const groupedSkills = groupSkillsByLevel(existingSkills);

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
              <a href="/profile" style={{
                color: '#6c757d',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                padding: '6px 16px',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                backgroundColor: 'white'
              }}>
                Back to Profile
              </a>
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
                  color: '#212529',
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'block',
                  padding: '4px 0',
                  fontWeight: '500'
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
            Portfolio Builder System &gt; Skills
          </div>

          {/* Page Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end',
            marginBottom: '32px' 
          }}>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#212529',
                marginBottom: '8px'
              }}>
                My Skills
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#6c757d',
                margin: '0'
              }}>
                Manage your technical and professional skills ({existingSkills.length} total)
              </p>
            </div>
            {!isAddingSkills && (
              <button
                onClick={handleAddNewSkillsMode}
                style={{
                  backgroundColor: '#212529',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1a1e21'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#212529'}
              >
                <span style={{ fontSize: '16px' }}>+</span>
                Add New Skills
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              <div style={{ fontSize: '16px', color: '#6c757d' }}>Loading your skills...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              color: '#721c24',
              padding: '16px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
              <button 
                onClick={fetchSkills}
                style={{
                  marginLeft: '10px',
                  backgroundColor: '#721c24',
                  color: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '2px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Existing Skills Display */}
          {!loading && !isAddingSkills && existingSkills.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              {skillLevels.map(level => {
                const levelSkills = groupedSkills[level];
                if (levelSkills.length === 0) return null;
                
                return (
                  <div key={level} style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6',
                    marginBottom: '20px',
                    overflow: 'hidden'
                  }}>
                    {/* Level Header */}
                    <div style={{
                      backgroundColor: '#f8f9fa',
                      padding: '16px 24px',
                      borderBottom: '1px solid #dee2e6',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: getSkillLevelColor(level)
                      }}></div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#212529',
                        margin: '0'
                      }}>
                        {level} ({levelSkills.length})
                      </h3>
                    </div>

                    {/* Skills Grid */}
                    <div style={{
                      padding: '24px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '16px'
                    }}>
                      {levelSkills.map((skill) => (
                        <div key={skill.id} style={{
                          border: '1px solid #dee2e6',
                          borderRadius: '6px',
                          padding: '16px',
                          backgroundColor: '#f8f9fa'
                        }}>
                          <div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '500',
                              color: '#212529',
                              marginBottom: '4px'
                            }}>
                              {skill.name}
                            </div>
                            <div style={{
                              fontSize: '14px',
                              color: getSkillLevelColor(skill.level),
                              fontWeight: '500'
                            }}>
                              {skill.level}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && !isAddingSkills && existingSkills.length === 0 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '2px dashed #dee2e6',
              padding: '60px',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
                opacity: '0.5'
              }}>🎯</div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#212529',
                marginBottom: '8px'
              }}>
                No Skills Added Yet
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#6c757d',
                marginBottom: '24px'
              }}>
                Start building your portfolio by adding your technical and professional skills
              </p>
              <button
                onClick={handleAddNewSkillsMode}
                style={{
                  backgroundColor: '#212529',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Add Your First Skills
              </button>
            </div>
          )}

          {/* Add New Skills Form */}
          {isAddingSkills && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
              padding: '32px',
              maxWidth: '800px'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#212529',
                  marginBottom: '8px'
                }}>
                  Add New Skills ({newSkills.length})
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6c757d',
                  margin: '0'
                }}>
                  Add multiple skills and select your proficiency level for each
                </p>
              </div>

              {/* New Skills List */}
              <div style={{ marginBottom: '24px' }}>
                {newSkills.map((skill, index) => (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr auto',
                    gap: '16px',
                    alignItems: 'end',
                    marginBottom: '16px',
                    padding: '16px',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#212529',
                        marginBottom: '6px'
                      }}>
                        Skill Name
                      </label>
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => handleNewSkillChange(index, 'name', e.target.value)}
                        placeholder="e.g. React, Python, UI Design"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #dee2e6',
                          borderRadius: '4px',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#212529',
                        marginBottom: '6px'
                      }}>
                        Level
                      </label>
                      <select
                        value={skill.level}
                        onChange={(e) => handleNewSkillChange(index, 'level', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #dee2e6',
                          borderRadius: '4px',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          boxSizing: 'border-box',
                          color: getSkillLevelColor(skill.level),
                          fontWeight: '500'
                        }}
                      >
                        {skillLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      {newSkills.length > 1 && (
                        <button
                          onClick={() => removeNewSkill(index)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '10px 12px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Button */}
              <div style={{ marginBottom: '24px' }}>
                <button
                  onClick={addMoreNewSkill}
                  style={{
                    backgroundColor: 'white',
                    color: '#212529',
                    border: '2px dashed #dee2e6',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  + Add More Skill
                </button>
              </div>

              {/* Preview Section */}
              {newSkills.some(skill => skill.name.trim() !== '') && (
                <div style={{
                  borderTop: '1px solid #dee2e6',
                  paddingTop: '24px',
                  marginBottom: '24px'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#212529',
                    marginBottom: '16px'
                  }}>
                    Preview
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {newSkills
                      .filter(skill => skill.name.trim() !== '')
                      .map((skill, index) => (
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
                      ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleCancelAddSkills}
                  style={{
                    backgroundColor: 'white',
                    color: '#6c757d',
                    border: '1px solid #dee2e6',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNewSkills}
                  disabled={saving}
                  style={{
                    backgroundColor: saving ? '#6c757d' : '#212529',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Saving...' : 'Save All Skills'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SkillsPage;
