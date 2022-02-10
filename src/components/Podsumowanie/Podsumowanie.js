import classes from "./Podsumowanie.module.css";
import { Image, Form, Button } from "react-bootstrap";
import Layout from "../Layout/Layout";
import zdj from './lol.jpg';


const Podsumowanie = () => {
  return (
      <Layout>
        <h1>Podsumowanie wyników</h1>
        <div className="d-flex justify-content-between text-center">
          <Image className="mx-auto" roundedCircle fluid src={zdj} style={{'width': '700px'}} alt="lol"/>
        </div>
      </Layout>
  );
};

export default Podsumowanie;
