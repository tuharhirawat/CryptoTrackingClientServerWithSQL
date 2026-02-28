import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components"; // Import GlobalStyle
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = ({ setIsLoggedIn, currentUser }) => {
  const [user, setUser] = useState(currentUser || null);
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [changePassword, setChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setUpdatedUser(parsedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    setChangePassword(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateInputs = () => {
    if (!updatedUser.username || !updatedUser.email || !updatedUser.mobileNumber) {
      setErrorMessage("All fields are required.");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(updatedUser.email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5232/api/Users/${user.id}`);
      if (response.status === 200) {
        setUpdatedUser(response.data);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      alert("Failed to fetch user data. Please try again.");
    }
  };

  const handleUpdateProfile = async () => {
    if (!validateInputs()) return;

    try {
      const response = await axios.put(`http://localhost:5232/api/Users/${user.id}`, updatedUser);
      if (response.status === 200) {
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const response = await axios.delete(`http://localhost:5232/api/Users/${user.id}`);
      if (response.status === 204) {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
        navigate("/signup");
        alert("Profile deleted successfully.");
      }
    } catch (err) {
      console.error("Error deleting profile:", err);
      alert("Failed to delete profile. Please try again.");
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <GlobalStyle />
      <Background>
        <ProfileContainer confirmationVisible={confirmationVisible}>
          <h2>Welcome, {user.username}</h2>

          {confirmationVisible && (
            <ConfirmationBox>
              <ConfirmationMessage>
                Are you sure you want to delete your profile?
              </ConfirmationMessage>
              <ButtonContainer>
                <DeleteConfirmationButton onClick={handleDeleteProfile}>Yes</DeleteConfirmationButton>
                <CancelConfirmationButton onClick={() => setConfirmationVisible(false)}>No</CancelConfirmationButton>
              </ButtonContainer>
            </ConfirmationBox>
          )}

          {editing ? (
            <div>
              {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
              <FormInput
                type="text"
                name="username"
                value={updatedUser.username || ""}
                placeholder="Name"
                onChange={handleInputChange}
              />
              <FormInput
                type="text"
                name="mobileNumber"
                value={updatedUser.mobileNumber || ""}
                placeholder="Mobile Number"
                onChange={handleInputChange}
              />
              <FormInput
                type="email"
                name="email"
                value={updatedUser.email || ""}
                placeholder="Email"
                onChange={handleInputChange}
              />
              <ActionButton onClick={handleUpdateProfile}>Save</ActionButton>
              <CancelButton onClick={handleEditToggle}>Cancel</CancelButton>
            </div>
          ) : changePassword ? (
            <div>
              <FormInput
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
              <FormInput
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
              <ActionButton onClick={handleUpdatePassword}>Update Password</ActionButton>
              <CancelButton onClick={() => setChangePassword(false)}>Cancel</CancelButton>
            </div>
          ) : (
            <ProfileDetails>
              <p>
                <strong>Name:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Mobile:</strong> {user.mobileNumber}
              </p>
              <EditButton onClick={handleEditToggle}>Edit Profile</EditButton>
              <DeleteButton onClick={() => setConfirmationVisible(true)}>Delete Profile</DeleteButton>
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </ProfileDetails>
          )}
        </ProfileContainer>
      </Background>
    </>
  );
};

export default Profile;

// Global style to define keyframes for animations
const GlobalStyle = createGlobalStyle`
  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    30% {
      background-position: 100% 50%;
    }
    60%{
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const Background = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  // background: linear-gradient(45deg, #ff6f61, #ffcc00, #ff0099);
  background-size: 400% 400%;
  animation: gradientAnimation 10s ease infinite;
  color: white;
  padding: 20px;
  transition: background 0.5s ease-in-out;
`;

const ProfileContainer = styled.div`
  position: relative;
  background: linear-gradient(45deg, #ff6f61, #ffcc00, #ff0099);
  background-size: 400% 400%;
  animation: gradientAnimation 10s ease infinite;
  padding: 30px;
  width: 80%;
  max-width: 500px;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  box-sizing: border-box;

  // Disable hover effect when confirmation box is visible
  &:hover {
    transform: ${({ confirmationVisible }) => (confirmationVisible ? 'none' : 'scale(1.05)')};
    box-shadow: ${({ confirmationVisible }) => (confirmationVisible ? 'none' : '0 0 50px rgba(0, 0, 0, 0.5)')};
  }
`;


const ProfileDetails = styled.div`
  margin: 20px 0;
  text-align: left;
  padding: 10px;
  display:flex;
  flex-direction:column;
  font-size: 1.2rem;

  p {
    margin-left:10px;
    color: #fff;
    font-size: 1.1rem;
  }
`;

const FormInput = styled.input`
  width: 85%;
  padding: 16px;
  margin: 15px;
  border: none;
  border-radius: 10px;
  background-color: #333;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    outline: none;
    border: 2px solid #ffcc00;
    background-color: #444;
  }
`;

const ActionButton = styled.button`
  background-color: #ff6f61;
  color: #fff;
  border: none;
  padding: 15px 25px;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 15px;
  width: 100%;

  &:hover {
    background-color: #ff004f;
    transform: scale(1.05);
  }
`;

const EditButton = styled(ActionButton)`
  background-color: #4CAF50;

  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled(ActionButton)`
  background-color: #777;

  &:hover {
    background-color: #555;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #ff0000;

  &:hover {
    background-color: #cc0000;
  }
`;

const LogoutButton = styled(ActionButton)`
  background-color: #007bff;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 1.2rem;
`;


const ConfirmationBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7); /* Darker background */
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ConfirmationMessage = styled.h3`
  color: white;
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
`;

const DeleteConfirmationButton = styled.button`
  background-color: #777;
  color: white;
  padding: 12px 20px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: gold;
  }
`;

const CancelConfirmationButton = styled.button`
  background-color: #777;
  color: white;
  padding: 12px 20px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: gold;
  }
`;
