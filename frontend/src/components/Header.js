import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import logo from "./lightlogo.png";
import bell from "./bell.png";
import user from "./user.png";

function Header() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.style.backgroundColor = darkMode ? "#F2F6EB" : "#333";
    document.body.style.color = darkMode ? "black" : "white";
  };

  const handleLogout = () => {
    navigate("/login"); // Redirect to login page
  };

  return (
    <header style={styles.header}>
      {/* Logo */}
      <div style={{ height: "60px" }}>
        <img src={logo} alt="Logo" style={{ height: "100%" }} />
      </div>

      {/* Navigation */}
      <nav>
        <a href="/home" style={styles.navLink}>
          <b>Home</b>
        </a>
        <a href="/projects" style={styles.navLink}>
          <b>Projects</b>
        </a>
        <Link to="/chat" style={styles.navLink}>
          <b>Chat</b>
        </Link>
      </nav>

      {/* Icons */}
      <div style={styles.iconsContainer}>
        {/* Bell Icon */}
        <img src={bell} alt="Notifications" style={styles.icon} onClick={toggleNotifications} />
        {showNotifications && (
          <div style={styles.notificationBox}>
            <p>You have 3 new notifications</p>
            <p>Project update: New task assigned</p>
            <p>New message from team</p>
          </div>
        )}

        {/* User Icon */}
        <img src={user} alt="User" style={styles.icon} onClick={toggleUserMenu} />
        {showUserMenu && (
          <div style={styles.userMenu}>
            <p>Kalyani Krishna</p>
            <p>Email: kalyanikrishna465@gmail.com</p>
            <button onClick={toggleDarkMode} style={styles.toggleButton}>
              {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>
            <button onClick={handleLogout} style={styles.logoutButton}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

// 🔹 Styling with higher z-index
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F2F6EB",
    padding: "10px 20px",
    color: "black",
    boxShadow: "0px 4px 12px rgba(86, 130, 101, 0.8)",
    position: "static",
    zIndex: 999,
  },
  navLink: {
    color: "#568265",
    margin: "0 20px",
    textDecoration: "none",
    fontSize: "20px",
  },
  iconsContainer: {
    height: "40px",
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  icon: {
    height: "30px",
    marginLeft: "15px",
    cursor: "pointer",
    zIndex: 999,
  },
  notificationBox: {
    position: "absolute",
    top: "50px",
    right: "50px",
    background: "#F2F6EB",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "220px",
    fontSize: "14px",
    zIndex: 1000,
  },
  userMenu: {
    position: "absolute",
    top: "50px",
    right: "10px",
    background: "#F2F6EB",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "200px",
    fontSize: "14px",
    zIndex: 1000,
  },
  toggleButton: {
    background: "#568265",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
    marginTop: "5px",
  },
  logoutButton: {
    background: "#B85042",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
    marginTop: "5px",
  },
};

export default Header;
