import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
    const [email, setNewEmail] = React.useState("");
    const [voornaam, setNewvoornaam] = React.useState("");
    const [achternaam, setNewachternaam] = React.useState("");
    const [geboortedag, setNewgeboortedag] = React.useState("");
    const [geboortemaand, setNewgeboortemaand] = React.useState("");
    const [geboortejaar, setNewgeboortejaar] = React.useState("");

    const navigate = useNavigate();
    const handleLogout = () => {
        navigate("/");
    };

    const handeleUpdate = () => {
        //code to update user info
    }

    const checkEmail = () => {
        if (email.includes("@")) {
            return "email is verified";
        }
        else return "email is not verified";
    }
    return (
        <div className="container-fluid px-4 py-3">
            <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body p-4">
                    <h2 className="h4 fw-bold mb-4" style={{ color: "#6c2bd9" }}>
                        Account Information
                    </h2>
                    <form onSubmit={(e) => {e.preventDefault();}}>
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label fw-semibold">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={email} 
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                                <div className="form-text text-muted">
                                    {checkEmail()}
                                </div>
                            </div>
                            
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Voornaam</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={voornaam} 
                                    onChange={(e) => setNewvoornaam(e.target.value)}
                                    placeholder="Enter your first name"
                                />
                            </div>
                            
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Achternaam</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={achternaam} 
                                    onChange={(e) => setNewachternaam(e.target.value)}
                                    placeholder="Enter your last name"
                                />
                            </div>
                            
                            <div className="col-12">
                                <label className="form-label fw-semibold">Geboortedatum</label>
                                <div className="row g-2">
                                    <div className="col-4">
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            value={geboortedag} 
                                            onChange={(e) => setNewgeboortedag(e.target.value)}
                                            placeholder="Dag"
                                            maxLength={2}
                                            max={31}
                                        />
                                    </div>
                                    <div className="col-4">
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            value={geboortemaand} 
                                            onChange={(e) => setNewgeboortemaand(e.target.value)}
                                            placeholder="Maand"
                                            maxLength={2}
                                            max={12}
                                        />
                                    </div>
                                    <div className="col-4">
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            value={geboortejaar} 
                                            onChange={(e) => setNewgeboortejaar(e.target.value)}
                                            placeholder="Jaar"
                                            maxLength={4}
                                            min={1900}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-12 mt-3">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    style={{ backgroundColor: "#6c2bd9", border: "none" }}
                                >
                                    Update Gegevens
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Application Settings Section */}
            <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body p-4">
                    <h2 className="h4 fw-bold mb-4" style={{ color: "#6c2bd9" }}>
                        Application Settings
                    </h2>
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <label className="form-label fw-semibold mb-0">Dark Mode</label>
                            <div className="form-text text-muted">Switch between light and dark theme</div>
                        </div>
                        <div className="form-check form-switch">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                style={{ backgroundColor: "#6c2bd9", borderColor: "#6c2bd9" }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Section */}
            <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body p-4">
                    <h2 className="h4 fw-bold mb-4" style={{ color: "#6c2bd9" }}>
                        Account Actions
                    </h2>
                    <form onSubmit={handleLogout}>
                        <button 
                            type="submit" 
                            className="btn btn-outline-danger"
                        >
                            Logout
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}   
export default UserInfo;