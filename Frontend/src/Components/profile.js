import React, { useEffect, useState } from "react";
import "./profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in first.");
      return;
    }

    fetch("http://localhost:4004/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setProfile(data);
        }
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile. Try again.");
      });
  }, []);

  if (error) {
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  }

  if (!profile) {
    return <div style={{ textAlign: "center" }}>Loading profile...</div>;
  }

  return (
    <div style={{ textAlign: "center" }} className="mainCont">
      <h2>Profile Page</h2>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </div>
  );
};

export default Profile;
