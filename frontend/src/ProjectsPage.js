import React, { useState, useEffect } from 'react';
import { logout, authenticatedFetch, API_BASE_URL, isAuthenticated } from './utils/auth';
import { useNavigate } from 'react-router-dom';

function ProjectsPage() {
  const navigate = useNavigate();
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Authentication guard
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Fetch projects from backend
  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching projects...');
      
      const response = await authenticatedFetch(`${API_BASE_URL}/projects/`, {
        method: 'GET',
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const projects = await response.json();
      console.log('Received projects:', projects);
      console.log('Projects type:', typeof projects);
      console.log('Is array:', Array.isArray(projects));
      
      // Handle different response formats (same as skills page)
      let projectsArray = [];
      if (Array.isArray(projects)) {
        projectsArray = projects;
      } else if (projects && typeof projects === 'object' && projects.results) {
        // Paginated response
        projectsArray = projects.results;
      } else if (projects && typeof projects === 'object') {
        // Single object response - convert to array
        projectsArray = [projects];
      } else {
        // Unexpected format
        console.warn('Unexpected projects response format:', projects);
        projectsArray = [];
      }
      
      // Convert backend format to frontend format
      const formattedProjects = projectsArray.map((project, index) => ({
        id: index + 1, // Add id for frontend use
        title: project.title,
        description: project.description,
        links: project.links ? (
          typeof project.links === 'string' ? 
            JSON.parse(project.links) : 
            project.links
        ) : [],
        skills: project.skills ? project.skills.map(skill => skill.name) : []
      }));
      
      setAllProjects(formattedProjects);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(`Failed to load projects: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [editingProject, setEditingProject] = useState(null);

  // Get all unique skills from all projects for filter dropdown
  const allSkills = [...new Set(allProjects.flatMap(project => project.skills))].sort();
  // Simulate API call to fetch projects by skill
  const fetchProjectsBySkill = async (skill) => {
    setIsLoading(true);
    try {
      // In real implementation: const response = await fetch(`/projects?skill=${skill}`);
      // const projects = await response.json();
      
      // For demo: simulate API delay and filter locally
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (skill) {
        const filtered = allProjects.filter(project => 
          project.skills.some(projectSkill => 
            projectSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        setFilteredProjects(filtered);
      } else {
        setFilteredProjects(allProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Error fetching projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle skill filter change
  const handleSkillFilterChange = (skill) => {
    setSelectedSkillFilter(skill);
    fetchProjectsBySkill(skill);
  };

  // Clear filter and show all projects
  const clearFilter = () => {
    setSelectedSkillFilter('');
    setFilteredProjects(allProjects);
  };

  // Update filteredProjects when allProjects changes
  React.useEffect(() => {
    if (selectedSkillFilter) {
      // Filter projects by skill
      const filtered = allProjects.filter(project => 
        project.skills.some(skill => 
          skill.toLowerCase().includes(selectedSkillFilter.toLowerCase())
        )
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(allProjects);
    }
  }, [allProjects, selectedSkillFilter]);

  // Available skills for selection (commented out - not used yet)
  // const availableSkills = [
  //   'React', 'JavaScript', 'Node.js', 'Python', 'MongoDB', 'Express', 
  //   'Firebase', 'CSS3', 'HTML5', 'UI/UX Design', 'API Integration', 
  //   'Chart.js', 'TypeScript', 'Vue.js', 'Angular', 'PostgreSQL', 'MySQL'
  // ];

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    links: [{ type: 'Live Demo', url: '' }],
    skills: [],
    currentSkill: ''
  });

  const linkTypes = ['Live Demo', 'GitHub', 'Documentation', 'Video Demo', 'Case Study', 'Blog Post'];

  const handleAddProjectMode = () => {
    setIsAddingProject(true);
    setNewProject({
      title: '',
      description: '',
      links: [{ type: 'Live Demo', url: '' }],
      skills: [],
      currentSkill: ''
    });
  };

  const handleNewProjectChange = (field, value) => {
    setNewProject(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    const skillToAdd = newProject.currentSkill?.trim();
    if (skillToAdd && !newProject.skills.includes(skillToAdd)) {
      setNewProject(prev => ({
        ...prev,
        skills: [...prev.skills, skillToAdd],
        currentSkill: ''
      }));
    } else if (newProject.skills.includes(skillToAdd)) {
      alert('This skill is already added!');
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setNewProject(prev => ({
      ...prev,
      skills: prev.skills.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = newProject.links.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    );
    setNewProject(prev => ({ ...prev, links: updatedLinks }));
  };

  const addMoreLink = () => {
    setNewProject(prev => ({
      ...prev,
      links: [...prev.links, { type: 'GitHub', url: '' }]
    }));
  };

  const removeLink = (index) => {
    if (newProject.links.length > 1) {
      setNewProject(prev => ({
        ...prev,
        links: prev.links.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSaveProject = async () => {
    if (!newProject.title.trim()) {
      alert('Please enter a project title');
      return;
    }
    if (!newProject.description.trim()) {
      alert('Please enter a project description');
      return;
    }

    const validLinks = newProject.links.filter(link => link.url.trim() !== '');
    
    // Convert skills array from strings to objects expected by backend
    const skillsData = newProject.skills.map(skillName => ({
      name: skillName,
      level: 'Expert' // Skills added to projects are set to Expert level
    }));
    
    const projectToSave = {
      title: newProject.title,
      description: newProject.description,
      links: JSON.stringify(validLinks), // Backend expects JSON string
      skills: skillsData
    };

    try {
      setSaving(true);
      
      const response = await authenticatedFetch(`${API_BASE_URL}/projects/`, {
        method: 'POST',
        body: JSON.stringify(projectToSave),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save project: ${errorText}`);
      }

      const savedProject = await response.json();
      console.log('Project saved:', savedProject);
      
      // Add to local state with frontend format
      const frontendProject = {
        id: Math.max(...allProjects.map(p => p.id), 0) + 1,
        title: savedProject.title,
        description: savedProject.description,
        links: validLinks,
        skills: newProject.skills
      };

      setAllProjects([frontendProject, ...allProjects]);
      setNewProject({
        title: '',
        description: '',
        links: [{ type: 'Live Demo', url: '' }],
        skills: [],
        currentSkill: ''
      });
      setIsAddingProject(false);
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert(`Failed to save project: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelAddProject = () => {
    setNewProject({
      title: '',
      description: '',
      links: [{ type: 'Live Demo', url: '' }],
      skills: [],
      currentSkill: ''
    });
    setIsAddingProject(false);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setAllProjects(allProjects.filter(project => project.id !== projectId));
    }
  };

  const handleEditProject = (project) => {
    setEditingProject({ ...project });
  };

  const getSkillColor = (skill) => {
    const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997'];
    const index = skill.length % colors.length;
    return colors[index];
  };

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
                  color: '#6c757d',
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'block',
                  padding: '4px 0'
                }}>Skills</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/projects" style={{
                  color: '#212529',
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'block',
                  padding: '4px 0',
                  fontWeight: '500'
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
            Portfolio Builder System &gt; Projects
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
                My Projects
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#6c757d',
                margin: '0'
              }}>
                Showcase your work and achievements ({filteredProjects.length} {selectedSkillFilter ? 'filtered' : 'total'} projects)
                {selectedSkillFilter && (
                  <span style={{ fontSize: '14px', color: '#007bff', fontWeight: '500' }}>
                    {' '}• Filtered by: {selectedSkillFilter}
                  </span>
                )}
              </p>
            </div>
            {!isAddingProject && (
              <button
                onClick={handleAddProjectMode}
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
                Add New Project
              </button>
            )}
          </div>

          {/* Search and Filter Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #dee2e6',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#212529',
                  marginBottom: '8px'
                }}>
                  Filter by Skill
                </label>
                <select
                  value={selectedSkillFilter}
                  onChange={(e) => handleSkillFilterChange(e.target.value)}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="">All Skills</option>
                  {allSkills.map((skill) => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
              
              {selectedSkillFilter && (
                <div style={{ marginTop: '20px' }}>
                  <button
                    onClick={clearFilter}
                    disabled={isLoading}
                    style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.6 : 1
                    }}
                  >
                    Clear Filter
                  </button>
                </div>
              )}
              
              {isLoading && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#6c757d',
                  fontSize: '14px',
                  marginTop: '20px'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #dee2e6',
                    borderTop: '2px solid #6c757d',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Loading projects...
                </div>
              )}
            </div>

            {/* Results Summary */}
            {!isLoading && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#495057'
              }}>
                {selectedSkillFilter ? (
                  <>
                    Found <strong>{filteredProjects.length}</strong> project{filteredProjects.length !== 1 ? 's' : ''} using <strong>{selectedSkillFilter}</strong>
                    {filteredProjects.length === 0 && (
                      <span style={{ color: '#6c757d' }}> - Try selecting a different skill or <button onClick={clearFilter} style={{ color: '#007bff', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>view all projects</button></span>
                    )}
                  </>
                ) : (
                  <>Showing all <strong>{filteredProjects.length}</strong> project{filteredProjects.length !== 1 ? 's' : ''}</>
                )}
              </div>
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
              <div style={{ fontSize: '16px', color: '#6c757d' }}>Loading your projects...</div>
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
                onClick={fetchProjects}
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

          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>

          {/* Existing Projects Display */}
          {!loading && !isAddingProject && filteredProjects.length > 0 && (
            <div style={{ 
              display: 'grid', 
              gap: '24px',
              marginBottom: '32px'
            }}>
              {filteredProjects.map((project) => (
                <div key={project.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6',
                  padding: '32px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  {/* Project Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <h2 style={{
                      fontSize: '24px',
                      fontWeight: '600',
                      color: '#212529',
                      margin: '0',
                      flex: 1
                    }}>
                      {project.title}
                    </h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditProject(project)}
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Project Description */}
                  <p style={{
                    fontSize: '16px',
                    color: '#495057',
                    lineHeight: '1.5',
                    marginBottom: '20px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {project.description}
                  </p>

                  {/* Project Skills */}
                  {project.skills.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#212529',
                        marginBottom: '8px'
                      }}>
                        Technologies Used
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {project.skills.map((skill, index) => (
                          <span key={index} style={{
                            backgroundColor: getSkillColor(skill),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Links */}
                  {project.links.length > 0 && (
                    <div>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#212529',
                        marginBottom: '8px'
                      }}>
                        Project Links
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {project.links.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              backgroundColor: '#f8f9fa',
                              color: '#495057',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              fontSize: '14px',
                              textDecoration: 'none',
                              border: '1px solid #dee2e6',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#e9ecef';
                              e.target.style.color = '#212529';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = '#f8f9fa';
                              e.target.style.color = '#495057';
                            }}
                          >
                            {link.type}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !isAddingProject && filteredProjects.length === 0 && !isLoading && (
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
              }}>
                {selectedSkillFilter ? '🔍' : '💼'}
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#212529',
                marginBottom: '8px'
              }}>
                {selectedSkillFilter ? `No Projects Found with "${selectedSkillFilter}"` : 'No Projects Added Yet'}
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#6c757d',
                marginBottom: '24px'
              }}>
                {selectedSkillFilter 
                  ? `Try selecting a different skill or view all projects to see your work.`
                  : 'Start showcasing your work by adding your first project'
                }
              </p>
              {selectedSkillFilter ? (
                <button
                  onClick={clearFilter}
                  style={{
                    backgroundColor: '#212529',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginRight: '12px'
                  }}
                >
                  View All Projects
                </button>
              ) : (
                <button
                  onClick={handleAddProjectMode}
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
                  Add Your First Project
                </button>
              )}
            </div>
          )}

          {/* Add New Project Form */}
          {isAddingProject && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
              padding: '32px'
            }}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#212529',
                  marginBottom: '8px'
                }}>
                  Add New Project
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#6c757d',
                  margin: '0'
                }}>
                  Share your work and showcase your skills
                </p>
              </div>

              {/* Project Title */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#212529',
                  marginBottom: '8px'
                }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => handleNewProjectChange('title', e.target.value)}
                  placeholder="e.g. E-commerce Website, Mobile App, AI Chatbot"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    fontSize: '16px',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Project Description */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#212529',
                  marginBottom: '8px'
                }}>
                  Project Description *
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => handleNewProjectChange('description', e.target.value)}
                  placeholder="Describe your project, the technologies used, challenges faced, and key features implemented..."
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    fontSize: '16px',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Project Links */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#212529',
                  marginBottom: '12px'
                }}>
                  Project Links
                </label>
                {newProject.links.map((link, index) => (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr auto',
                    gap: '12px',
                    marginBottom: '12px',
                    alignItems: 'center'
                  }}>
                    <select
                      value={link.type}
                      onChange={(e) => handleLinkChange(index, 'type', e.target.value)}
                      style={{
                        padding: '10px 12px',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    >
                      {linkTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                      placeholder="https://..."
                      style={{
                        padding: '10px 12px',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    />
                    {newProject.links.length > 1 && (
                      <button
                        onClick={() => removeLink(index)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '10px 12px',
                          borderRadius: '4px',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addMoreLink}
                  style={{
                    backgroundColor: 'white',
                    color: '#212529',
                    border: '2px dashed #dee2e6',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  + Add More Link
                </button>
              </div>

              {/* Skills Selection */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#212529',
                  marginBottom: '12px'
                }}>
                  Technologies Used ({newProject.skills.length} skills)
                </label>
                
                {/* Add Skill Input */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '16px',
                  alignItems: 'flex-end'
                }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      value={newProject.currentSkill || ''}
                      onChange={(e) => handleNewProjectChange('currentSkill', e.target.value)}
                      placeholder="e.g. React, Python, Node.js, MongoDB..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
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
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    disabled={!newProject.currentSkill || !newProject.currentSkill.trim()}
                    style={{
                      backgroundColor: newProject.currentSkill && newProject.currentSkill.trim() ? '#212529' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: newProject.currentSkill && newProject.currentSkill.trim() ? 'pointer' : 'not-allowed',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Add Skill
                  </button>
                </div>

                {/* Skills Display */}
                {newProject.skills.length > 0 && (
                  <div>
                    <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>
                      Added skills:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {newProject.skills.map((skill, index) => (
                        <div key={index} style={{
                          backgroundColor: getSkillColor(skill),
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          fontSize: '14px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span>{skill}</span>
                          <button
                            onClick={() => handleRemoveSkill(index)}
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold'
                            }}
                            title="Remove skill"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleCancelAddProject}
                  style={{
                    backgroundColor: 'white',
                    color: '#6c757d',
                    border: '1px solid #dee2e6',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProject}
                  disabled={saving}
                  style={{
                    backgroundColor: saving ? '#6c757d' : '#212529',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
