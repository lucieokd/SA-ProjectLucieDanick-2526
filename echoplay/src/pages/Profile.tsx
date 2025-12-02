import UserInfo from "../components/Profile/UserInfo";
import "../styles/profilepage.css";

const Profile = () => {
  return (
    <div className="profile-page">   
      <h1>Profile & Settings</h1>
      <div className="profile-content">
        <div className="profile-section">
          <h2 className="profile-section-title">Account Information</h2>
          <UserInfo />
        </div>
        <div className="profile-section">
          <h2 className="profile-section-title">Application Settings</h2>
          <UserInfo showApplicationSettings={true} />
        </div>
      </div>
    </div>
  );
}   
export default Profile;