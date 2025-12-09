import UserInfo from "../components/Profile/UserInfo";

const Profile = () => {
  return (
    <div className="container-fluid px-4 py-4" style={{ minHeight: "calc(100vh - 56px)" }}>
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Profile & Settings</h1>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-11 col-xl-10 col-xxl-9">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title border-bottom pb-3 mb-4">Account Information</h2>
              <UserInfo />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h2 className="card-title border-bottom pb-3 mb-4">Application Settings</h2>
              <UserInfo showApplicationSettings={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}   
export default Profile;