import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Header = ({ user, handleLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <Logo onClick={() => handleNavigation(user ? "/profile" : "/signup")}>
        Crypto Tracker
      </Logo>

      <HamburgerIcon onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </HamburgerIcon>

      <Nav isMenuOpen={isMenuOpen}>
        {isMenuOpen && (
          <CloseButton onClick={closeMenu}>
            <span>&#10005;</span>
          </CloseButton>
        )}

        <NavLink onClick={() => handleNavigation("/home")}>Home</NavLink>
        <NavLink onClick={() => handleNavigation("/news")}>News</NavLink>
        <NavLink onClick={() => handleNavigation("/about")}>About</NavLink>

        {user ? (
          <>
            <NavLink onClick={() => handleNavigation("/myairdrops")}>
              My-Airdrops
            </NavLink>
            <NavLink onClick={() => handleNavigation("/airdrop")}>
              Airdrop
            </NavLink>
            <NavLink onClick={() => handleNavigation("/wishlist")}>
              WishList
            </NavLink>
            <NavLink onClick={() => handleNavigation("/profile")}>
              Profile
            </NavLink>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <NavLink onClick={() => handleNavigation("/signup")}>
              Signup
            </NavLink>
            <NavLink onClick={() => handleNavigation("/login")}>
              Login
            </NavLink>
          </>
        )}
      </Nav>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  color: #fff;
  height: 70px;
  display: flex;
  background: rgba(235, 230, 200, 0.18);
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  z-index: 1000;
  box-sizing: border-box;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

  @media (max-width: 480px) {
    height: 60px;
    padding: 8px 12px;
  }

  @media (max-width: 360px) {
    height: 55px;
    padding: 6px 10px;
  }
`;

const Logo = styled.h1`
  font-size: 1.65rem;
  font-weight: 200;
  cursor: pointer;
  letter-spacing: 0.8px;
  color: #ffffff;
  text-shadow:
    0 0 6px rgba(255, 255, 255, 0.35),
    0 0 12px rgba(255, 215, 0, 0.25),
    0 4px 10px rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease;
  margin: 0;
  white-space: nowrap;

  &:hover {
    text-shadow:
      0 0 10px rgba(255, 255, 255, 0.6),
      0 0 18px rgba(255, 215, 0, 0.5),
      0 6px 14px rgba(0, 0, 0, 0.7);
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
    letter-spacing: 0.5px;
  }

  @media (max-width: 360px) {
    font-size: 1.1rem;
    letter-spacing: 0.3px;
  }
`;

const HamburgerIcon = styled.div`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 30px;
  height: 25px;
  cursor: pointer;
  
  div {
    width: 25px;
    height: 4px;
    background-color: #fff;
    border-radius: 5px;
  }

  @media (max-width: 768px) {
    display: flex;
  }

  @media (max-width: 360px) {
    width: 26px;
    height: 22px;

    div {
      width: 22px;
      height: 3px;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 260px;
    background: #222;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 80px;
    box-sizing: border-box;
    overflow-y: auto;

    transform: ${({ isMenuOpen }) =>
      isMenuOpen ? "translateX(0)" : "translateX(100%)"};
    transition: transform 0.35s ease;
    z-index: 999;
  }

  @media (max-width: 480px) {
    width: 220px;
    padding-top: 70px;
  }

  @media (max-width: 360px) {
    width: 200px;
    padding-top: 65px;
  }
`;

const NavLink = styled.span`
  margin-right: 20px;
  font-size: 1.05rem;
  font-weight: 200;
  cursor: pointer;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 8px;
  letter-spacing: 0.4px;

  text-shadow:
    0 0 4px rgba(255, 255, 255, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.7);

  transition: all 0.25s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    text-shadow:
      0 0 8px rgba(255, 255, 255, 0.55),
      0 0 14px rgba(255, 215, 0, 0.35);
  }

  @media (max-width: 768px) {
    margin: 14px 0;
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    margin: 12px 0;
    font-size: 0.95rem;
    padding: 5px 10px;
  }

  @media (max-width: 360px) {
    margin: 10px 0;
    font-size: 0.85rem;
    padding: 4px 8px;
  }
`;

const Button = styled.button`
  background: rgba(255, 77, 77, 0.85);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 77, 77, 1);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    padding: 7px 12px;
    font-size: 0.9rem;
    margin-top: 15px;
  }

  @media (max-width: 360px) {
    padding: 6px 10px;
    font-size: 0.8rem;
    margin-top: 12px;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 30px;
  color: #fff;
  cursor: pointer;
  z-index: 1001;

  &:hover {
    color: #ffcc00;
  }

  @media (min-width: 769px) {
    display: none; /* Hide the close button on larger screens */
  }

  @media (max-width: 480px) {
    top: 12px;
    right: 15px;
    font-size: 26px;
  }

  @media (max-width: 360px) {
    top: 10px;
    right: 12px;
    font-size: 24px;
  }
`;

export default Header;