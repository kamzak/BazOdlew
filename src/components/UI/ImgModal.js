import { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./ImgModal.module.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClose} />;
};

const ModalOverlay = (props) => {
  return (
    <div className={`${classes.modal}`}>
      <span className={classes.close} onClick={props.onClose}>X</span>
      <img className={classes.modalImg} src={props.src} alt="" />
      {props.children}
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const ImgModal = (props) => {
  return (
    <Fragment>
            {ReactDOM.createPortal(
        <Backdrop onClose={props.onClose} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay src={props.src} onClose={props.onClose}>{props.children}</ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default ImgModal;
