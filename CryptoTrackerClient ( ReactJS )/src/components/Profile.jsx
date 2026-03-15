import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  getProfile,
  updateProfile,
  deleteUserAccount,
  updateUserPassword
} from "../Services/userService";

const Profile = () => {

  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleteProfile, setIsDeleteProfile] = useState(false);

  const [passwordData, setPasswordData] = useState({ newPassword: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    const fetchUser = async () => {

      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/login", { replace: true });
        return;
      }

      setAuthUser(session.user);

      const { data, error } = await getProfile(session.user.id);

      if (error) {
        setErrorMessage("Failed to fetch profile.");
        return;
      }

      setProfile(data);
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeAllModals();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const closeAllModals = () => {
    setIsEditProfile(false);
    setIsChangingPassword(false);
    setIsDeleteProfile(false);
    setPasswordData({ newPassword: "" });
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    setErrorMessage("");
    if (!profile.username || !profile.mobile) {
      setErrorMessage("All fields are required.");
      return;
    }

    const { error } = await updateProfile(authUser.id, {
      username: profile.username,
      mobile: profile.mobile,
    });

    if (error) {
      setErrorMessage("Unable to update profile. Please try again.");
      return;
    }

    closeAllModals();
  };

  const handleUpdatePassword = async () => {
    setErrorMessage("");

    if (!passwordData.newPassword) {
      setErrorMessage("Password cannot be empty.");
      return;
    }

    const { error } = await updateUserPassword(passwordData.newPassword);

    if (error) {
      setErrorMessage("Unable to update password. Please try again.");
      return;
    }

    closeAllModals();
  };

  const handleDeleteProfile = async () => {

    setErrorMessage("");

    if (!passwordData.newPassword) {
      setErrorMessage("Please enter your password to confirm deletion.");
      return;
    }

    const { error } = await deleteUserAccount(passwordData.newPassword);

    if (error) {
      setErrorMessage("Unable to delete account. Please verify your password and try again.");
      return;
    }

    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (!profile) return <LoadingText>Loading...</LoadingText>;

  return (
    <Background>
      <Card>
        <Title>My Profile</Title>

        <ProfileSection>
          <ProfileAvatar>
            {profileImage ? (
              <AvatarImage src={profileImage} alt="Profile" />
            ) : (
              profile?.username?.charAt(0)?.toUpperCase() || "U"
            )}
          </ProfileAvatar>

          <UploadLabel>
            Upload Photo
            <HiddenInput
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </UploadLabel> <br/>

          <Info><span>Email:</span> {authUser.email}</Info>
          <Info><span>Username:</span> {profile.username}</Info>
          <Info><span>Mobile:</span> {profile.mobile}</Info>
        </ProfileSection>


        <PrimaryButton onClick={() => { setErrorMessage(""); setIsEditProfile(true); }}>
          Edit Profile
        </PrimaryButton>

        <SecondaryButton onClick={() => { setErrorMessage(""); setIsChangingPassword(true); }}>
          Change Password
        </SecondaryButton>

        <DangerButton onClick={() => { setErrorMessage(""); setIsDeleteProfile(true); }}>
          Delete Profile
        </DangerButton>

      </Card>

      {isEditProfile && (
        <ModalOverlay onClick={closeAllModals}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Edit Profile</ModalTitle>

            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

            <FormWrapper>
              <CenteredInput
                name="username"
                value={profile.username}
                placeholder="Username"
                onChange={handleInputChange}
              />

              <CenteredInput
                name="mobile"
                value={profile.mobile}
                placeholder="Mobile"
                onChange={handleInputChange}
              />
            </FormWrapper>

            <PrimaryButton onClick={handleUpdateProfile}>
              Save Changes
            </PrimaryButton>

            <SecondaryButton onClick={closeAllModals}>
              Cancel
            </SecondaryButton>
          </ModalBox>
        </ModalOverlay>
      )}

      {isChangingPassword && (
        <ModalOverlay onClick={closeAllModals}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Change Password</ModalTitle>

            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

            <FormWrapper>
              <CenteredInput
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ newPassword: e.target.value })
                }
              />
            </FormWrapper>

            <PrimaryButton onClick={handleUpdatePassword}>
              Update Password
            </PrimaryButton>

            <SecondaryButton onClick={closeAllModals}>
              Cancel
            </SecondaryButton>
          </ModalBox>
        </ModalOverlay>
      )}

      {isDeleteProfile && (
        <ModalOverlay onClick={closeAllModals}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Delete Account</ModalTitle>
            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

            <FormWrapper>
              <CenteredInput
                type="password"
                placeholder="Enter Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ newPassword: e.target.value })
                }
              />
            </FormWrapper>

            <DangerButton onClick={handleDeleteProfile}>
              Confirm Delete
            </DangerButton>

            <SecondaryButton onClick={closeAllModals}>
              Cancel
            </SecondaryButton>
          </ModalBox>
        </ModalOverlay>
      )}
    </Background>
  );
};

export default Profile;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { transform: scale(0.85); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const Background = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  width: 420px;
  padding: 40px;
  border-radius: 20px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(15px);
  text-align: center;
  color: white;
`;

const Title = styled.h2`
  margin-bottom: 25px;
`;

const ProfileSection = styled.div`
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileAvatar = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: white;
  margin-bottom: 12px;
  box-shadow: 0 0 20px rgba(180, 200, 150, 4);
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const UploadLabel = styled.label`
  margin-top: 10px;
  font-size: 13px;
  cursor: pointer;
  color: #00c896;
  transition: 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Info = styled.p`
  margin: 8px 0;
  text-align: center;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.2s ease;
  z-index: 999;
`;

const ModalBox = styled.div`
  width: 360px;
  padding: 30px;
  border-radius: 18px;
  background: rgba(20,20,20,0.95);
  animation: ${scaleIn} 0.2s ease;
  text-align: center;
`;

const ModalTitle = styled.h3`
  margin-bottom: 20px;
  color: white;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;  /* TRUE CENTER */
  width: 100%;
`;

const CenteredInput = styled.input`
  width: 80%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: none;
  background: rgba(255,255,255,0.08);
  color: white;
  text-align: center;   /* TEXT centered */
`;

const BaseButton = styled.button`
  width: 80%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin: 6px auto;
  display: block;
`;

const PrimaryButton = styled(BaseButton)`
  background: #00c896;
  color: white;

  &:hover {
    background: #00a67e;
  }
`;

const SecondaryButton = styled(BaseButton)`
  background: #555;
  color: white;

  &:hover {
    background: #444;
  }
`;

const DangerButton = styled(BaseButton)`
  background: #ff4d4f;
  color: white;

  &:hover {
    background: #d9363e;
  }
`;

const ErrorText = styled.p`
  color: #ff4d4f;
  margin-bottom: 15px;
`;

const LoadingText = styled.p`
  text-align: center;
  margin-top: 50px;
  color: white;
`;