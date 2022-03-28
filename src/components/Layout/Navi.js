import { Link } from "react-router-dom";
import logo from "../static/logo.png";
import { Navbar, Nav, Container } from "react-bootstrap";
import classes from "./Navi.module.css";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";

const Navi = (props) => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
  }

  let homeClass = { backgroundColor: "", color: "white", padding: "0.5rem" };
  let analizaClass = { backgroundColor: "", color: "white", padding: "0.5rem" };
  let strukturaClass = {
    backgroundColor: "",
    color: "white",
    padding: "0.5rem",
  };
  let wlmechClass = { backgroundColor: "", color: "white", padding: "0.5rem" };
  let podsumowanieClass = {
    backgroundColor: "",
    color: "white",
    padding: "0.5rem",
  };
  let loginClass = {
    backgroundColor: "",
    color: "white",
    padding: "0.5rem",
  };

  if (props.title === "home") {
    homeClass = {
      backgroundColor: "#126E82",
      color: "white",
      padding: "0.5rem",
    };
  }
  if (props.title === "analiza") {
    analizaClass = {
      backgroundColor: "#126E82",
      color: "white",
      padding: "0.5rem",
    };
  }
  if (props.title === "struktura") {
    strukturaClass = {
      backgroundColor: "#126E82",
      color: "white",
      padding: "0.5rem",
    };
  }
  if (props.title === "wlmech") {
    wlmechClass = {
      backgroundColor: "#126E82",
      color: "white",
      padding: "0.5rem",
    };
  }
  if (props.title === "podsumowanie") {
    podsumowanieClass = {
      backgroundColor: "#126E82",
      color: "white",
      padding: "0.5rem",
    };
  }
  if (props.title === "login") {
    loginClass = {
      backgroundColor: "#126E82",
      color: "white",
      padding: "0.5rem",
    };
  }

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
                style={homeClass}
                as={Link}
                to="/home"
              >
                Strona główna
              </Nav.Link>
              {isLoggedIn && (<Nav.Link
                style={analizaClass}
                className={classes.links}
                as={Link}
                to="/analiza"
              >
                Analiza chemiczna
              </Nav.Link>)}
              {isLoggedIn && (<Nav.Link
                style={strukturaClass}
                className={classes.links}
                as={Link}
                to="/struktura"
              >
                Struktura
              </Nav.Link>)}
              {isLoggedIn && (<Nav.Link
                style={wlmechClass}
                className={classes.links}
                as={Link}
                to="/wlmech"
              >
                Właściwości mechaniczne
              </Nav.Link>)}
            </Nav>
            <Nav className="toggledNav">
            {isLoggedIn && (<Nav.Link
                style={podsumowanieClass}
                eventKey={2}
                className={classes.links}
                as={Link}
                to="/podsumowanie"
              >
                Podsumowanie
              </Nav.Link>)}
              {!isLoggedIn && (<Nav.Link
                style={loginClass}
                className={`${classes.links} ${classes.login}`}
                as={Link}
                to="/login"
              >
                Zaloguj się
              </Nav.Link>)}
              {isLoggedIn && (<Nav.Link
                style={loginClass}
                className={`${classes.links} ${classes.login}`}
                as={Link}
                to="/"
                onClick={logoutHandler}
              >
                Wyloguj się
              </Nav.Link>)}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
export default Navi;
