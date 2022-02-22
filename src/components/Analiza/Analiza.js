import classes from "./Analiza.module.css";
import { useRef, useState } from "react";
import { Form, Button, Col, Row, FormControl, Table } from "react-bootstrap";
import { database } from "../../firebase/firebase";
import { ref, set, remove } from "firebase/database";

import Layout from "../Layout/Layout";
import Modal from "../UI/Modal";
import Pagination from "../Layout/Pagination";

const Analiza = () => {
  // Manage data states
  const [showTable, setShowTable] = useState(false);
  const [datas, setDatas] = useState([]);
  const [btnTableText, setBtnTableText] = useState(false);
  const [showText, setShowText] = useState("Pokaż wyniki");
  const [formIsValid, setFormIsValid] = useState(false);
  const [showAddAlert, setAddShowAlert] = useState(false);
  const [showRemoveAlert, setRemoveShowAlert] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recPerPage] = useState(2);

  // Pagination func setting current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination logic const's
  const indexOfLastRec = currentPage * recPerPage;
  const indexOfFirstRec = indexOfLastRec - recPerPage;
  const currentRecords = datas.slice(indexOfFirstRec, indexOfLastRec);

  // Ref's for inputs
  const nrWytRef = useRef();
  const gatunekRef = useRef();
  const rodzMetRef = useRef();
  const wegielRef = useRef();
  const krzemRef = useRef();
  const manganRef = useRef();
  const magnezRef = useRef();
  const fosforRef = useRef();
  const siarkaRef = useRef();
  const miedzRef = useRef();
  const cerRef = useRef();
  const lantanRef = useRef();
  const cyrkonRef = useRef();
  const bizmutRef = useRef();
  const wapnRef = useRef();
  const showBtnRef = useRef();

  // On submit form func
  const sendData = async (event) => {
    event.preventDefault();
    if (nrWytRef.current.value === "") {
      formIsValid(false);
      return;
    }
    const promises = [];
    await set(ref(database, "analiza/" + nrWytRef.current.value), {
      nrWyt: nrWytRef.current.value,
      rodzMet: rodzMetRef.current.value,
      gatunek: gatunekRef.current.value,
      wegiel: wegielRef.current.value,
      krzem: krzemRef.current.value,
      mangan: manganRef.current.value,
      magnez: magnezRef.current.value,
      fosfor: fosforRef.current.value,
      siarka: siarkaRef.current.value,
      miedz: miedzRef.current.value,
      cer: cerRef.current.value,
      lantan: lantanRef.current.value,
      cyrkon: cyrkonRef.current.value,
      bizmut: bizmutRef.current.value,
      wapn: wapnRef.current.value,
    });

    Promise.all(promises)
      .then(setAddShowAlert(true))
      .then(setTimeout(() => setAddShowAlert(false), 3000))
      .then(setTimeout(() => fetchData(), 500))
      .catch((err) => console.log(err));

    // Clear inputs
    nrWytRef.current.value = "";
    gatunekRef.current.value = "";
    rodzMetRef.current.value = "";
    wegielRef.current.value = "";
    krzemRef.current.value = "";
    manganRef.current.value = "";
    magnezRef.current.value = "";
    fosforRef.current.value = "";
    siarkaRef.current.value = "";
    miedzRef.current.value = "";
    cerRef.current.value = "";
    lantanRef.current.value = "";
    cyrkonRef.current.value = "";
    bizmutRef.current.value = "";
    wapnRef.current.value = "";
  };

  // Fetching data from database
  async function fetchData() {
    const response = await fetch(
      "https://bazodlew-default-rtdb.europe-west1.firebasedatabase.app/analiza.json"
    );
    const data = await response.json();
    const baseItems = [];
    for (const key in data) {
      baseItems.push({
        id: key,
        nrWyt: data[key].nrWyt,
        gatunek: data[key].gatunek,
        rodzMet: data[key].rodzMet,
        wegiel: data[key].wegiel,
        krzem: data[key].krzem,
        mangan: data[key].mangan,
        magnez: data[key].magnez,
        fosfor: data[key].fosfor,
        siarka: data[key].siarka,
        miedz: data[key].miedz,
        cer: data[key].cer,
        lantan: data[key].lantan,
        cyrkon: data[key].cyrkon,
        bizmut: data[key].bizmut,
        wapn: data[key].wapn,
      });
    }
    setDatas(baseItems);
  }

  // Listing all images and saving it to setImgUrls state

  const listImages = async () => {
    if (btnTableText) {
      setShowText("Pokaż wyniki");
    } else {
      setShowText("Ukryj wyniki");
    }
    setBtnTableText((prevState) => !prevState);

    setShowTable((prevState) => !prevState);
    await fetchData();
  };

  const closeAlertHandler = (props) => {
    setAddShowAlert(false);
    setRemoveShowAlert(false);
  };

  return (
    <Layout className={classes.analiza}>
      <h1 className={classes.analiza__title}>
        Formularz dodania wyników - analiza chemiczna
      </h1>
      <p>Wprowadź dane:</p>
      <Form>
        <Row className="align-items-center">
          <Col xs={12} sm={4} xl={4} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">Nr wytopu</Form.Label>
            <Form.Control
              ref={nrWytRef}
              id="inlineFormInputName"
              placeholder="Np. 2313"
              type="number"
              min="0"
            />
          </Col>
          <Col xs={12} sm={4} xl={4} className="mb-3">
            <Form.Label htmlFor="inlineFormInputGroupUsername">
              Rodzaj metalu
            </Form.Label>
            <FormControl
              ref={rodzMetRef}
              id="inlineFormInputGroupUsername"
              type="text"
              list="rodzMet"
              placeholder="Np. sfero, ADI, szare, SiMo itd."
            />
            <datalist id="rodzMet">
              <option value="Żeliwo sferoidalne" />
              <option value="Żeliwo ADI" />
              <option value="Żeliwo szare" />
              <option value="Żeliwo białe" />
              <option value="Żeliwo wermikularne" />
              <option value="Żeliwo SiMo" />
            </datalist>
          </Col>
          <Col xs={12} sm={4} xl={4} className="mb-3">
            <Form.Label htmlFor="inlineFormInputGroupUsername">
              Gatunek
            </Form.Label>
            <FormControl
              ref={gatunekRef}
              id="inlineFormInputGroupUsername"
              type="text"
              list="gatunek"
              placeholder="Np. GJS 500-7"
            />
            <datalist id="gatunek">
              <option value="GJS-400-18 LT" />
              <option value="GJS-400-18" />
              <option value="GJS-400-15" />
              <option value="GJS-500-7" />
              <option value="GJS-600-3" />
              <option value="GJL-150" />
              <option value="GJL-200" />
              <option value="GJL-250" />
              <option value="GJL-300" />
            </datalist>
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              C [<i>węgiel</i>] [%]
            </Form.Label>
            <Form.Control
              ref={wegielRef}
              id="inlineFormInputName"
              placeholder="udział % C"
              type="number"
              min="0"
              max="100"
            />
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="inlineFormInputGroupUsername">
              Si [<i>krzem</i>] [%]
            </Form.Label>
            <FormControl
              ref={krzemRef}
              id="inlineFormInputGroupUsername"
              placeholder="udział % Si"
              type="number"
              min="0"
              max="100"
            />
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              Mn [<i>mangan</i>] [%]
            </Form.Label>
            <Form.Control
              ref={manganRef}
              id="inlineFormInputName"
              placeholder="udział % Mn"
              type="number"
              min="0"
              max="100"
            />
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="inlineFormInputGroupUsername">
              Mg [<i>magnez</i>] [%]
            </Form.Label>
            <FormControl
              ref={magnezRef}
              id="inlineFormInputGroupUsername"
              placeholder="udział % Mg"
              type="number"
              min="0"
              max="100"
            />
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              P [<i>fosfor</i>] [%]
            </Form.Label>
            <Form.Control
              ref={fosforRef}
              id="inlineFormInputName"
              placeholder="udział % P"
              type="number"
              min="0"
              max="100"
            />
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              S [<i>siarka</i>] [%]
            </Form.Label>
            <Form.Control
              ref={siarkaRef}
              id="inlineFormInputName"
              placeholder="udział % S"
              type="number"
              min="0"
              max="100"
            />
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              Cu [<i>miedź</i>] [%]
            </Form.Label>
            <Form.Control
              ref={miedzRef}
              id="inlineFormInputName"
              placeholder="udział % Cu"
              type="number"
              min="0"
              max="100"
            />
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              Ce [<i>cer</i>] [%]
            </Form.Label>
            <Form.Control
              ref={cerRef}
              id="inlineFormInputName"
              placeholder="udział % Ce"
              type="number"
              min="0"
              max="100"
            />
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              La [<i>lantan</i>] [%]
            </Form.Label>
            <Form.Control
              ref={lantanRef}
              id="inlineFormInputName"
              placeholder="udział % La"
              type="number"
              min="0"
              max="100"
            />
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              Zr [<i>cyrkon</i>] [%]
            </Form.Label>
            <Form.Control
              ref={cyrkonRef}
              id="inlineFormInputName"
              placeholder="udział % Zr"
              type="number"
              min="0"
              max="100"
            />
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              Bi [<i>bizmut</i>] [%]
            </Form.Label>
            <Form.Control
              ref={bizmutRef}
              id="inlineFormInputName"
              placeholder="udział % Bi"
              type="number"
              min="0"
              max="100"
            />
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              Ca [<i>wapń</i>] [%]
            </Form.Label>
            <Form.Control
              ref={wapnRef}
              id="inlineFormInputName"
              placeholder="udział % Ca"
              type="number"
              min="0"
              max="100"
            />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col xs={12} sm={12} xl={6} className="offset-xl-3">
            <Button
              onClick={sendData}
              className={classes.submitBtn}
              type="submit"
            >
              Dodaj wyniki
            </Button>
          </Col>
        </Row>

        {showAddAlert && (
          <Modal onClose={closeAlertHandler}>
            Wprowadzono wyniki do bazy danych!
          </Modal>
        )}
      </Form>
      <Row>
        <Col xs={12} sm={6} xl={2}>
          <Button
            disabled={formIsValid}
            onClick={listImages}
            className={classes.showBtn}
            ref={showBtnRef}
          >
            {showText}
          </Button>
        </Col>
      </Row>

      {showTable && currentRecords.length > 0 && (
        <div className="table-responsive">
          <Table
            className={classes.dataTable}
            striped
            borderless
            variant="light"
          >
            <thead className="tbHead text-center">
              <tr className="align-items-center">
                <th>Nr wytopu</th>
                <th>Gatunek</th>
                <th>Rodzaj metalu</th>
                <th>C</th>
                <th>Si</th>
                <th>Mn</th>
                <th>Mg</th>
                <th>P</th>
                <th>S</th>
                <th>Cu</th>
                <th>Ce</th>
                <th>La</th>
                <th>Zr</th>
                <th>Bi</th>
                <th>Ca</th>
                <th>Usuń</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {currentRecords.map((item, i) => {
                return (
                  <tr key={i} className="align-items-center">
                    <td>{item.nrWyt}</td>
                    <td>{item.gatunek}</td>
                    <td>{item.rodzMet}</td>
                    <td>{item.wegiel}</td>
                    <td>{item.krzem}</td>
                    <td>{item.mangan}</td>
                    <td>{item.magnez}</td>
                    <td>{item.fosfor}</td>
                    <td>{item.siarka}</td>
                    <td>{item.miedz}</td>
                    <td>{item.cer}</td>
                    <td>{item.lantan}</td>
                    <td>{item.cyrkon}</td>
                    <td>{item.bizmut}</td>
                    <td>{item.wapn}</td>
                    <td className="text-center">
                      <button
                        className={classes.deleteIcon}
                        onClick={(e) => {
                          e.preventDefault();
                          remove(ref(database, "analiza/" + item.nrWyt))
                            .then(setRemoveShowAlert(true))
                            .then(
                              setTimeout(() => setRemoveShowAlert(false), 3000)
                            )
                            .then(setTimeout(() => fetchData(), 500))
                            .catch((error) =>
                              alert("Nie udało się usunąć rekordu: " + error)
                            );
                        }}
                      ></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
      {showRemoveAlert && (
        <Modal onClose={closeAlertHandler}>Usunięto rekord z bazy!</Modal>
      )}
      {showTable && currentRecords.length > 0 && (
        <Pagination
          currentPage={currentPage}
          className={classes.pagination}
          recPerPage={recPerPage}
          totalRecs={datas.length}
          paginate={paginate}
        />
      )}
      {showTable && currentRecords.length === 0 && (
        <p className={classes.errorMessage}>Brak wyników w bazie!</p>
      )}
    </Layout>
  );
};

export default Analiza;
