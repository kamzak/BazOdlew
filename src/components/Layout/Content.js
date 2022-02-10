import classes from './Content.module.css';
import { Container } from "react-bootstrap";

const Content = (props) => {
    return <Container className={classes.content}>
        {props.children}
    </Container>
};

export default Content;