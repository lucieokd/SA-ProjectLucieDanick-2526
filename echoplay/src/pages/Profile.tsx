import React, { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeContext } from "../components/Profile/theme-context";
import { AiOutlineUpload } from "react-icons/ai";
import "../styles/profilepage.css";

const Profile = () => {
  const { theme } = useContext(ThemeContext);
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane.doe@example.com");
  const [displayName, setDisplayName] = useState("JaneD");
  const [playbackQuality, setPlaybackQuality] = useState("high");
  const [notifications, setNotifications] = useState(true);

  const getThemeDisplayName = () => {
    return theme === "dark" ? "Dark" : "Light";
  };

  return (
    <div className="container-fluid px-4 py-5 profile-page" style={{
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-text)',
      minHeight: 'calc(100vh - 56px)'
    }}>
      <h1 className="mb-4 fw-bold" style={{ fontSize: '2.5rem' }}>Profile & Settings</h1>

      {/* Account Information Section */}
      <div className="card shadow-sm mb-4" style={{
        backgroundColor: 'var(--color-header-footer)',
        border: 'none',
        borderRadius: '8px'
      }}>
        <div className="card-body p-4">
          <h2 className="card-title fw-bold mb-4" style={{ fontSize: '1.5rem' }}>Account Information</h2>

          <div className="mb-4">
            <label htmlFor="name" className="form-label fw-semibold">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                backgroundColor: 'var(--color-header-footer)',
                color: 'var(--color-text)',
                borderColor: 'rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                backgroundColor: 'var(--color-header-footer)',
                color: 'var(--color-text)',
                borderColor: 'rgba(0, 0, 0, 0.1)'
              }}
            />
            <small className="form-text text-muted">This is your login email address.</small>
          </div>

          <div className="mb-4">
            <label htmlFor="displayName" className="form-label fw-semibold">Display Name</label>
            <input
              type="text"
              className="form-control"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={{
                backgroundColor: 'var(--color-header-footer)',
                color: 'var(--color-text)',
                borderColor: 'rgba(0, 0, 0, 0.1)'
              }}
            />
            <small className="form-text text-muted">How your name appears to others.</small>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Avatar</label>
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #f0e68c 0%, #d4e157 100%)',
                fontSize: '2rem',
                color: '#666',
                fontWeight: '600',
                border: '2px solid rgba(0, 0, 0, 0.1)'
              }}>
                JD
              </div>
              <button type="button" className="btn d-flex align-items-center gap-2" style={{
                backgroundColor: '#6c2bd9',
                color: 'white',
                border: 'none'
              }}>
                <AiOutlineUpload /> Edit Avatar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Settings Section */}
      <div className="card shadow-sm" style={{
        backgroundColor: 'var(--color-header-footer)',
        border: 'none',
        borderRadius: '8px'
      }}>
        <div className="card-body p-4">
          <h2 className="card-title fw-bold mb-4" style={{ fontSize: '1.5rem' }}>Application Settings</h2>

          <div className="mb-4">
            <label htmlFor="playbackQuality" className="form-label fw-semibold">Playback Quality</label>
            <select
              className="form-select"
              id="playbackQuality"
              value={playbackQuality}
              onChange={(e) => setPlaybackQuality(e.target.value)}
              style={{
                backgroundColor: 'var(--color-header-footer)',
                color: 'var(--color-text)',
                borderColor: 'rgba(0, 0, 0, 0.1)'
              }}
            >
              <option value="low">Low (128kbps)</option>
              <option value="medium">Medium (192kbps)</option>
              <option value="high">High (320kbps)</option>
            </select>
            <small className="form-text text-muted">Choose your default audio streaming quality.</small>
          </div>

          <div className="mb-4">
            <label htmlFor="notifications" className="form-label fw-semibold">Notifications</label>
            <div className="d-flex align-items-center gap-3">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <small className="form-text text-muted">Receive alerts for new music and app updates.</small>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Theme Preference</label>
            <div style={{ color: 'var(--color-text)', fontSize: '0.95rem', padding: '0.5rem 0' }}>
              {getThemeDisplayName()} (Controlled by sidebar)
            </div>
            <small className="form-text text-muted">Currently active theme for the application.</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;