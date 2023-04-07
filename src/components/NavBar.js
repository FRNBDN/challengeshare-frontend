import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  return (
    <>
      <Navbar expand="lg" className={`mb-3`}>
        <Container fluid>
          <Navbar.Brand className={styles.LogoText}>
            <i class="fa-solid fa-share-nodes"></i> DARE/SHARE
          </Navbar.Brand>
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
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link>Submissions</Nav.Link>
                <Nav.Link>Challenges</Nav.Link>
                <Nav.Link>Log In</Nav.Link>
                <NavDropdown title="Profile" id="offcanvasNavbarDropdown">
                  <NavDropdown.Item href="#action3">View</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">Log Out</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
