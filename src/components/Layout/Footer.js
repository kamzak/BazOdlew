import classes from "./Footer.module.css";
import { Container, Col, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <Container fluid>
      <Row className={classes.footer}>
        <Col xs={12} className="text-center">
          <footer>
            <span>Copyright © 2022 by Kamil Żak</span>
          </footer>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
