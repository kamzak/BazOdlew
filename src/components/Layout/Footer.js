import classes from "./Footer.module.css";
import { Container, Col, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <Container fluid>
      <Row className="text-center">
        <Col className={classes.footer}>
          <footer>
            <span>Copyright © 2022 by Kamil Żak</span>
          </footer>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
