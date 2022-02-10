import { Link } from "react-router-dom";
import logo from "../static/logo.png";
import { Navbar, Nav, Container } from "react-bootstrap";
import classes from "./Navi.module.css";

const Navi = () => {
  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        className={classes.nav}
        variant="dark"
      >
        <Container>
          <Navbar.Brand as={Link} to="/home">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            BazOdlew
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto toggledNav">
              <Nav.Link
                className={classes.home}
                style={{ color: "white", padding: "0.5rem" }}
                as={Link}
                to="/home"
              >
                Strona główna
              </Nav.Link>
              <Nav.Link className={classes.links} as={Link} to="/analiza">
                Analiza chemiczna
              </Nav.Link>
              <Nav.Link className={classes.links} as={Link} to="/struktura">
                Struktura
              </Nav.Link>
              <Nav.Link className={classes.links} as={Link} to="/wlmech">
                Właściwości mechaniczne
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link
                eventKey={2}
                className={classes.links}
                as={Link}
                to="/podsumowanie"
              >
                Podsumowanie
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
export default Navi;
