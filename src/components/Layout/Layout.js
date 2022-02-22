import { Fragment } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Navi from "./Navi";
import Content from "./Content";

const Layout = (props) => {
  return (
    <Fragment>
      <Header>
        <Navi title={props.title} />
      </Header>
      <Content>{props.children}</Content>
      <Footer />
    </Fragment>
  );
};

export default Layout;
