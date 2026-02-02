import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import FormInput from "../Components/FormInput";
import { supabase } from "../supabaseClient";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateInput = async (name, value) => {
    if (name === "password") {
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/.test(
          value
        )
      ) {
        return "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.";
      }
    }

    if (name === "confirmPassword" && value !== formData.password) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));

    const error = await validateInput(name, value);
    if (error) setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    let validationErrors = {};

    if (!formData.name) validationErrors.name = "Name is required.";
    if (!formData.mobile)
      validationErrors.mobile = "Mobile number is required.";
    else if (!/^\d{10}$/.test(formData.mobile))
      validationErrors.mobile = "Mobile number must be exactly 10 digits.";

    if (!formData.email)
      validationErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      validationErrors.email = "Invalid email format.";

    if (!formData.password)
      validationErrors.password = "Password is required.";
    if (!formData.confirmPassword)
      validationErrors.confirmPassword = "Confirm Password is required.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormStatus("loading");

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .or(
        `username.eq.${formData.name},mobile.eq.${formData.mobile}`
      );

    if (existingProfile?.length > 0) {
      setFormStatus("error");
      setErrors({
        general: "User already exists. Please login instead.",
      });
      // setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (!data?.user) {
      setFormStatus("error");
      setErrors({
        general: "User already exists. Please login instead.",
      });
      // setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (error) {
      setFormStatus("error");
      setErrors({ general: error.message });
      return;
    }

    localStorage.setItem(
      "pendingProfile",
      JSON.stringify({
        username: formData.name,
        mobile: formData.mobile,
      })
    );

    setFormStatus("success");
    setSuccessMessage("Signup successful! Please verify your email.");

    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <PageContainer>
      <SignupForm onSubmit={handleSubmit}>
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        <h2>Sign Up</h2>
        {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}

        <FormInput
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}

        <FormInput
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Mobile Number"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
        />
        {errors.mobile && <ErrorMessage>{errors.mobile}</ErrorMessage>}

        <FormInput
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

        <FormInput
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

        <FormInput
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
        )}

        <SubmitButton type="submit" disabled={formStatus === "loading"}>
          {formStatus === "loading" ? "Signing Up..." : "Sign Up"}
        </SubmitButton>
      </SignupForm>
    </PageContainer>
  );
};

export default Signup;

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
  min-height: 90dvh;
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

const SignupForm = styled.form`
  width: 100%;
  max-width: 300px;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #ccc;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  // animation: ${slideIn} 1s ease-in-out;

  display: flex;
  flex-direction: column;
  align-items: center;
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

const ErrorMessage = styled.div`
  width: 100%;
  color: red;
  font-size: 0.75rem;
  text-align: left;

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }

  @media (max-width: 360px) {
    font-size: 0.65rem;
  }
`;

const SuccessMessage = styled.div`
  width: 100%;
  color: green;
  font-weight: bold;
  font-size: 0.85rem;
  text-align: center;
  margin-bottom: 8px;

  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin-bottom: 6px;
  }

  @media (max-width: 360px) {
    font-size: 0.7rem;
  }
`;
