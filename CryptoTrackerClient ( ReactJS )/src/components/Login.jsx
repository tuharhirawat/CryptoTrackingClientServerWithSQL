import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import FormInput from "../Components/FormInput";
import { loginUser } from "../Services/userService";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await loginUser(
        formData.email,
        formData.password
      );

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      navigate("/airdrop");
    } catch (err) {
      setError("Unable to fetch profile data.");
    }

    setLoading(false);
  };

  return (
    <PageContainer>
      <LoginForm onSubmit={handleSubmit}>
        <h2>Login</h2>

        <FormInput
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <FormInput
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Login"}
        </SubmitButton>

        {error && <ErrorText>{error}</ErrorText>}
      </LoginForm>
    </PageContainer>
  );
};

export default Login;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const PageContainer = styled.div`
  width: 100%;
  min-height: 70dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  box-sizing: border-box;
  margin: 0;
  // animation: ${fadeIn} 1s ease-in-out;

  @media (max-width: 480px) {
    padding: 10px;
  }

  @media (max-width: 320px) {
    padding: 8px;
  }
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 300px;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #ccc;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  // animation: ${slideIn} 1s ease-in-out;
  gap: 6px;
  transition: all 0.3s ease;

  h2 {
    margin: 0 0 8px 0;
    font-size: 1.3rem;
    margin-bottom: 10px;
  }

  &:hover {
    border: 3px solid;
    border-image: linear-gradient(
      45deg,
      #ff0000,
      #ff9900,
      #33cc33,
      #3399ff,
      #9900cc,
      #ff66cc
    );
    border-image-slice: 1;
    box-shadow: 0 0 18px rgba(255, 215, 0, 0.8);
  }

  @media (max-width: 480px) {
    max-width: 75%;
    padding: 16px;
    gap: 5px;

    h2 {
      font-size: 1.1rem;
      margin-bottom: 8px;
    }
  }

  @media (max-width: 360px) {
    padding: 12px;
    border-radius: 8px;

    h2 {
      font-size: 1rem;
      margin-bottom: 6px;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  margin-top: 6px;
  padding: 8px;
  font-size: 0.9rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background-color: rgb(60, 50, 54);
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background-color: gold;
    color: black;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 10px 8px;
    font-size: 0.85rem;
    margin-top: 8px;
  }

  @media (max-width: 360px) {
    padding: 8px;
    font-size: 0.8rem;
  }
`;

const ErrorText = styled.p`
  width: 100%;
  color: red;
  font-size: 0.75rem;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }

  @media (max-width: 360px) {
    font-size: 0.65rem;
  }
`;