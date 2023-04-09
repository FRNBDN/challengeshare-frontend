import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import axios from "axios";
import Avatar from "./Avatar";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const loggedInItems = (
    <>
      <NavLink
        className={`d-none d-lg-block ${styles.NavLink}`}
        to={`profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentUser?.profile_image} />
        {currentUser?.username}
      </NavLink>
      <NavLink to="/" className={styles.NavLink} onClick={handleSignOut}>
        Sign Out
      </NavLink>
    </>
  );

  const loggedOutItems = (
    <>
      <>
        <NavLink to="/signin" className={styles.NavLink}>
          Sign In
        </NavLink>
        <NavLink to="/signup" className={styles.NavLink}>
          Sign Up
        </NavLink>
      </>
    </>
  );

  return (
    <>
      <Navbar expand="lg" className={`mb-3`}>
        <Container fluid>
          <NavLink to="/">
            <Navbar.Brand className={styles.LogoText}>
              <i className="fa-solid fa-share-nodes"></i> DARE/SHARE
            </Navbar.Brand>
          </NavLink>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">
                {currentUser ? (
                  <NavLink to={`profiles/${currentUser?.profile_id}`}>
                    <Avatar src={currentUser?.profile_image} />
                    {currentUser?.username}
                  </NavLink>
                ) : (
                  <>Menu</>
                )}
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body id="NavBarLinks">
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <NavLink to="/" className={styles.NavLink}>
                  Submissions
                </NavLink>
                <NavLink to="/challenges" className={styles.NavLink}>
                  Challenges
                </NavLink>
                {currentUser ? loggedInItems : loggedOutItems}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
