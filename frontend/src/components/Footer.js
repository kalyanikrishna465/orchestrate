import React from "react";

const Footer = () => {
  return (
    <footer style={{ 
      background: "rgba(86, 130, 101, 0.9)", // Same green shade with transparency
      color: "#fff",
      textAlign: "center",
      padding: "15px 0",
      position: "relative",
      bottom: "0",
      width: "100%",
      fontSize: "14px",
      fontWeight: "bold",
    }}>
      <p>&copy; {new Date().getFullYear()} Orchestrate. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
