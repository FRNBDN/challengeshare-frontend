import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <Navbar expand="lg" className={`mb-3`}>
        <Container fluid>
          <NavLink to="/">
            <Navbar.Brand className={styles.LogoText}>
              <i class="fa-solid fa-share-nodes"></i> DARE/SHARE
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
                Offcanvas
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body id="NavBarLinks">
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <NavLink exact to="/" className={styles.NavLink}>
                  Submissions
                </NavLink>
                <NavLink to="/challenges" className={styles.NavLink}>
                  Challenges
                </NavLink>
                <NavLink to="/signin" className={styles.NavLink}>
                  Sign in
                </NavLink>
                <NavLink to="/signup" className={styles.NavLink}>
                  Sign up
                </NavLink>
                <NavLink to="/" className={styles.NavLink}>
                  Profile
                </NavLink>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
