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

const UserInfo: React.FC<UserInfoProps> = ({
  showApplicationSettings = false,
}) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState({
    voornaam: "",
    achternaam: "",
    email: "",
  });
  const [formData, setFormData] = useState({
    voornaam: "",
    achternaam: "",
    email: "",
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
            const initialData = {
              voornaam: userData.firstName || "",
              achternaam: userData.lastName || "",
              email: userData.email || "",
            };
            setFormData(initialData);
            setOriginalData(initialData);
            setError(null); // Clear any previous errors
            setSuccess(null);
          } else {
            console.warn("No user data found in Firestore for UID:", user.uid);
            setError(
              "User profile not found. Please update your profile information."
            );
            // Set email from auth as fallback
            setFormData((prev) => ({
              ...prev,
              email: user.email || "",
            }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError(
            "Failed to load user profile. Please try refreshing the page."
          );
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
      setFormData((prev) => ({
        ...prev,
        voornaam: parts[0] || "",
        achternaam: parts.slice(1).join(" ") || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const validateForm = (): string | null => {
    if (!formData.voornaam.trim()) {
      return "Voornaam is verplicht";
    }
    if (!formData.achternaam.trim()) {
      return "Achternaam is verplicht";
    }

    return null;
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      setError("Geen gebruiker ingelogd");
      return;
    }

    // Validatie
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const updateData: any = {
        firstName: formData.voornaam.trim(),
        lastName: formData.achternaam.trim(),
      };
      await updateUser(user.uid, updateData);

      // Update ook originalData zodat cancel werkt met nieuwe data
      setOriginalData(formData);
      setIsEditing(false);
      setError(null);
      setSuccess("Profiel succesvol bijgewerkt!");

      // Verberg success message na 3 seconden
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error updating user data:", error);
      setError(
        error.message || "Fout bij bijwerken van profiel. Probeer het opnieuw."
      );
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
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (showApplicationSettings) {
    return (
      <div>
        <div className="mb-4">
          <label className="form-label fw-semibold">Theme preferences</label>
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn btn-link p-2"
              onClick={handleChangeMode}
              aria-label="Toggle theme"
              style={{ fontSize: "1.5rem", color: "#6c2bd9" }}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
        <button type="button" className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success mb-3" role="alert">
          {success}
        </div>
      )}
      <form onSubmit={handleSaveChanges}>
        <div className="row mb-3">
          <div className="col-md-6 mb-3 mb-md-0">
            <label htmlFor="voornaam" className="form-label fw-semibold">
              Voornaam
            </label>
            <input
              type="text"
              id="voornaam"
              name="voornaam"
              className={`form-control ${!isEditing ? "bg-light" : ""}`}
              value={formData.voornaam}
              readOnly={!isEditing}
              onChange={handleInputChange}
              placeholder="Voornaam"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="achternaam" className="form-label fw-semibold">
              Achternaam
            </label>
            <input
              type="text"
              id="achternaam"
              name="achternaam"
              className={`form-control ${!isEditing ? "bg-light" : ""}`}
              value={formData.achternaam}
              readOnly={!isEditing}
              onChange={handleInputChange}
              placeholder="Achternaam"
            />
          </div>
        </div>

        <div className="col-md-12">
          <label htmlFor="email" className="form-label fw-semibold">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control bg-light"
            value={formData.email}
            readOnly={true}
            onChange={handleInputChange}
          />
          <small className="form-text text-muted">
            Dit is je inlog e-mailadres.
          </small>
        </div>

        <div className="d-flex gap-2 mt-4">
          {!isEditing ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleEdit}
            >
              Bewerken
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Annuleren
              </button>
              <button type="submit" className="btn btn-primary">
                Opslaan
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserInfo;
