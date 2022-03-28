import { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from './Modal.module.css';
import successIcon from "../static/success.png";

const ModalOverlay = (props) => {
  return (
    <div className={`${classes.modal} alert alert-success alert-dismissible d-flex align-items-center fade show`}>
      <img alt="" src={successIcon} className={classes.successIcon} />
      <strong className="mx-2">Sukces!</strong>
      {props.children}
      <button
        type="button"
        className="btn-close"
        onClick={props.onClose}
      ></button>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const Modal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <ModalOverlay onClose={props.onClose}>{props.children}</ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default Modal;
