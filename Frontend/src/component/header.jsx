import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import logo from '../assets/logo.png';
import userPhoto from '../assets/ahmedfathy.jpg';
import './header.css'; // Add CSS styling here
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";

function NavScrollExample() {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const toggleNotificationDropdown = () => setShowNotificationDropdown(!showNotificationDropdown);
  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown);
  const handleMouseOut = (e) => {
    e.target.value = "";
    e.target.blur();
  };

  return (
    <Navbar expand="lg" className="bg-body-light">
      <Container fluid className="d-flex align-items-center">

        {/* Logo */}
        <Navbar.Brand href="#" className="me-auto">
          <img src={logo} alt="Logo" width="95" height="60" className="d-inline-block align-top" />{' '}
        </Navbar.Brand>

        


        {/* Notification Bell and User Profile */}
        <Nav className="d-flex align-items-center ms-auto">
          {/* Search Bar */}
          <div className="box">
            <form name="search">
              <input
                type="text"
                className="input"
                name="txt"
                onMouseOut={handleMouseOut}
              />
            </form>
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
          {/* Notification Bell */}
          <Nav.Item className="d-flex align-items-center mx-4 position-relative">
            <button onClick={toggleNotificationDropdown} className="notification-bell">
                <FontAwesomeIcon icon={faBell} className="bell-icon" />
            </button>
            {showNotificationDropdown && (
                <Dropdown.Menu show className="notification-dropdown">
                    <Dropdown.Item>No new notifications</Dropdown.Item>
                </Dropdown.Menu>
            )}
        </Nav.Item>


          {/* User Profile */}
          <Nav.Item className="user-profile d-flex align-items-center mx-4">
            <img
              src={userPhoto}
              alt="User"
              className="user-photo"
              onClick={toggleUserDropdown}
            />
            <span onClick={toggleUserDropdown}>Ahmed Fathy</span>
            {showUserDropdown && (
              <Dropdown.Menu show className="user-dropdown">
                <Dropdown.Item href="#profile">Profile</Dropdown.Item>
                <Dropdown.Item href="#settings">Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#logout">Logout</Dropdown.Item>
              </Dropdown.Menu>
            )}
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
