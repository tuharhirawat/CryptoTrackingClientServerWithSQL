import React from "react";
import styled from "styled-components";

const FormInput = ({ type, placeholder, name, onChange, value }) => {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={onChange}
      value={value}
      required
    />
  );
};

export default FormInput;

const Input = styled.input`
  width: 93%;
  padding: 8px;
  margin-bottom: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.8rem;

  &:focus {
    outline: none;
    border-color: #333;
  }

  &:hover {
    border: 1px solid;
    border-image: linear-gradient(45deg, #ff0000, #ff9900, #33cc33, #3399ff, #9900cc, #ff66cc);
    border-image-slice: 1;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
  }

  @media (max-width: 480px) {
    padding: 10px;
    margin-bottom: 8px;
    font-size: 0.85rem;
  }

  @media (max-width: 360px) {
    padding: 8px;
    margin-bottom: 6px;
    font-size: 0.75rem;
    border-radius: 3px;
  }
`;