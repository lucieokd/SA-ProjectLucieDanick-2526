import React, { useState, useContext, useEffect } from "react";
import { FaMoon, FaSun, FaUpload } from "react-icons/fa";
import { ThemeContext } from "./theme-context";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import { getUserByAuthId, updateUser } from "../../services/userService";
import { onAuthStateChanged, signOut } from "firebase/auth";

interface UserInfoProps {
  showApplicationSettings?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ showApplicationSettings = false }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    voornaam: "",
    achternaam: "",
    email: "",
    dag: "",
    maand: "",
    jaar: ""
  });

  // Haal user data op wanneer component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          console.log("Fetching user data for UID:", user.uid);
          const userData = await getUserByAuthId(user.uid);
          console.log("User data received:", userData);
          
          if (userData) {
            console.log("Setting form data:", {
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
            });
            setFormData({
              voornaam: userData.firstName || "",
              achternaam: userData.lastName || "",
              email: userData.email || "",
              dag: userData.geboorteDag?.toString() || "",
              maand: userData.geboorteMaand?.toString() || "",
              jaar: userData.geboorteJaar?.toString() || "",
            });
            setError(null); // Clear any previous errors
          } else {
            console.warn("No user data found in Firestore for UID:", user.uid);
            setError("User profile not found. Please update your profile information.");
            // Set email from auth as fallback
            setFormData(prev => ({
              ...prev,
              email: user.email || "",
            }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to load user profile. Please try refreshing the page.");
        } finally {
          setLoading(false);
        }
      } else {
        // Geen gebruiker ingelogd, redirect naar login
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChangeMode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    console.log(`${newTheme === "dark" ? "Dark" : "Light"} mode ingeschakeld`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "fullName") {
      const parts = value.trim().split(/\s+/);
      setFormData(prev => ({
        ...prev,
        voornaam: parts[0] || "",
        achternaam: parts.slice(1).join(" ") || ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) {
      console.error("No user logged in");
      return;
    }

    try {
      await updateUser(user.uid, {
        firstName: formData.voornaam,
        lastName: formData.achternaam,
        geboorteDag: parseInt(formData.dag),
        geboorteMaand: parseInt(formData.maand),
        geboorteJaar: parseInt(formData.jaar),
      });
      
      console.log('User info updated');
      setIsEditing(false);
      setError(null); // Clear any errors on successful update
    } catch (error: any) {
      console.error("Error updating user data:", error);
      setError(error.message || "Failed to update profile. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (showApplicationSettings) {
    return (
      <div className="application-settings">
        <div className="profile-field">
          <label>Theme preferences</label>
          <div className="theme-toggle-container">
            <button 
              type="button" 
              className="theme-toggle-btn" 
              onClick={handleChangeMode}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
        <button 
          type="button" 
          className="btn-logout" 
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="account-information">
      {error && (
        <div style={{ 
          padding: "12px", 
          marginBottom: "16px", 
          backgroundColor: "#fff3cd", 
          border: "1px solid #ffc107", 
          borderRadius: "4px",
          color: "#856404"
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSaveChanges}>
        <div className="profile-field-row">
          <div className="profile-field">
            <label htmlFor="voornaam">First Name</label>
            <input
              type="text"
              id="voornaam"
              name="voornaam"
              className="form-control"
              value={formData.voornaam}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="achternaam">Last Name</label>
            <input
              type="text"
              id="achternaam"
              name="achternaam"
              className="form-control"
              value={formData.achternaam}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="profile-row-2col">

          <div className="profile-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              readOnly={true}
              onChange={handleInputChange}
            />
            <p className="profile-helper-text">This is your login email address.</p>
          </div>

          <div className="profile-field">
            <label>Birthdate</label>
            <div className="birthdate-container">
              <input type="number" name="dag" className="form-control" value={formData.dag} readOnly={!isEditing} onChange={handleInputChange}/>
              <input type="number" name="maand" className="form-control" value={formData.maand} readOnly={!isEditing} onChange={handleInputChange}/>
              <input type="number" name="jaar" className="form-control" value={formData.jaar} readOnly={!isEditing} onChange={handleInputChange}/>
            </div>
          </div>

        </div>


        <div className="profile-field">
          <label htmlFor="avatar">Avatar</label>
          <div className="avatar-container">
            <div className="avatar-placeholder"></div>
            <button type="button" className="btn-edit-avatar">
              <FaUpload /> Edit Avatar
            </button>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            type="button" 
            className="btn-edit" 
            onClick={handleEdit}
            disabled={isEditing}
          >
            Edit
          </button>
          <button 
            type="submit" 
            className="btn-save-changes"
            disabled={!isEditing}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInfo;
