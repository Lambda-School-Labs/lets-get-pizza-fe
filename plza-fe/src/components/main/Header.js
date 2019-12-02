import React from "react";
import { NavLink } from "react-router-dom";
import { Container, Menu, Dropdown } from "semantic-ui-react";
import { hasToken, logoutUser } from "../../utils/auth";

const UserProfile = () => (
  <>
    <Menu.Item as={NavLink} to="/users/profile">
      Profile
    </Menu.Item>
    <Menu.Item onClick={() => logoutUser()}>Logout</Menu.Item>
  </>
);

const AuthenticateOptions = () => (
  <>
    <Menu.Item as={NavLink} to="/users/register">
      Register
    </Menu.Item>
    <Menu.Item as={NavLink} to="/users/login">
      Log in
    </Menu.Item>
  </>
);

export default function Masthead() {
  return (
    <Menu stackable style={{ borderRadius: 0 }}>
      <Container>
        <Menu.Item>
          <div style={{ width: "102px", padding: "0 12px" }}>
            <img width="100%" src="https://i.imgur.com/os2t6S3.png" />
          </div>
        </Menu.Item>
        <Menu.Item as={NavLink} exact to="/">
          Home
        </Menu.Item>
        <Menu.Item as={NavLink} to="/locations/map">
          Map
        </Menu.Item>
        <Menu.Item as={NavLink} to="/locations/search">
          Search
        </Menu.Item>
        <Dropdown text="About" pointing className="link item">
          <Dropdown.Menu>
            <Dropdown.Item as={NavLink} to="/pages/eaters">
              User Features
            </Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/pages/businesses">
              Business Features
            </Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/pages/about">
              About Our Team
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Menu.Menu position="right">
          {hasToken ? <UserProfile /> : <AuthenticateOptions />}
        </Menu.Menu>
      </Container>
    </Menu>
  );
}