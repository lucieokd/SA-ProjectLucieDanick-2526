import EchoPlaylogo from '../assets/EchoPlay-Logo(WObackground).png'; 

function HeaderLogo() {
  return (
    <div className="header-logo">
      <img src={EchoPlaylogo} alt="EchoPlay Logo" 
      className="logo-image"
      style={{
        width: '500px'
      }} />
    </div>
  );
}

export default HeaderLogo;