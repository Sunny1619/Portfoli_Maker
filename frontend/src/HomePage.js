import React, { useState, useEffect } from 'react';
function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.user) {
            setUser(data.user);
          }
        });
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Top Navigation */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #dee2e6',
        padding: '12px 0'
      }}>
        <div style={{ padding: '0 24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
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
            <div style={{ display: 'flex', gap: '12px' }}>
              {user ? (
                <>
                  <span style={{
                    color: '#212529',
                    fontWeight: '500',
                    fontSize: '14px',
                    marginRight: '8px'
                  }}>
                    {user.first_name} {user.last_name}
                  </span>
                  <a href="/profile" style={{
                    backgroundColor: '#212529',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '6px 16px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Profile
                  </a>
                </>
              ) : (
                <>
                  <a href="/login" style={{
                    color: '#6c757d',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    padding: '6px 16px',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    backgroundColor: 'white'
                  }}>
                    Login
                  </a>
                  <a href="/register" style={{
                    backgroundColor: '#212529',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '6px 16px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Register
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Centered */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)',
        padding: '40px'
      }}>
        <div style={{ 
          textAlign: 'center', 
          maxWidth: '800px',
          width: '100%'
        }}>
          {/* Main Title */}
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#212529',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            Welcome to Portfolio Builder
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '18px',
            color: '#6c757d',
            marginBottom: '48px',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 48px'
          }}>
            Create stunning professional portfolios to showcase your skills, projects, and achievements. 
            Build your online presence and impress employers with our intuitive portfolio builder.
          </p>

          {/* Call to Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '64px',
            flexWrap: 'wrap'
          }}>
            <a href="/register" style={{
              backgroundColor: '#212529',
              color: 'white',
              textDecoration: 'none',
              padding: '16px 32px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'inline-block',
              minWidth: '160px'
            }}>
              Get Started
            </a>
            <a href="/login" style={{
              backgroundColor: 'white',
              color: '#212529',
              border: '1px solid #dee2e6',
              textDecoration: 'none',
              padding: '16px 32px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'inline-block',
              minWidth: '160px'
            }}>
              Sign In
            </a>
          </div>

          {/* Features Preview */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#212529',
              marginBottom: '32px'
            }}>
              Why Choose Portfolio Builder?
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '32px',
              marginTop: '32px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#212529',
                  marginBottom: '12px'
                }}>
                  Professional Templates
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6c757d',
                  lineHeight: '1.6',
                  margin: '0'
                }}>
                  Choose from beautifully designed templates that make your work stand out.
                </p>
              </div>

              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#212529',
                  marginBottom: '12px'
                }}>
                  Easy to Use
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6c757d',
                  lineHeight: '1.6',
                  margin: '0'
                }}>
                  Intuitive interface that lets you build your portfolio in minutes, not hours.
                </p>
              </div>

              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#212529',
                  marginBottom: '12px'
                }}>
                  Share Instantly
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6c757d',
                  lineHeight: '1.6',
                  margin: '0'
                }}>
                  Get a personalized URL to share your portfolio with employers and clients.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div style={{
            padding: '24px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <p style={{
              fontSize: '16px',
              color: '#6c757d',
              marginBottom: '16px',
              margin: '0 0 16px'
            }}>
              Ready to showcase your professional journey?
            </p>
            <a href="/register" style={{
              backgroundColor: '#212529',
              color: 'white',
              textDecoration: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-block'
            }}>
              Create Your Portfolio Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
