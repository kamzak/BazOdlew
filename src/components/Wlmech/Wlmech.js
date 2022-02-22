import classes from "./Wlmech.module.css";
import { useRef, useState } from "react";
import { Form, Button, Col, Row, FormControl, Table } from "react-bootstrap";
import { database } from "../../firebase/firebase";
import { ref, set, remove } from "firebase/database";

import Layout from "../Layout/Layout";
import Modal from "../UI/Modal";
import Pagination from "../Layout/Pagination";

const Wlmech = () => {
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
  const [recPerPage] = useState(3);

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
  const rmRef = useRef();
  const granicaRef = useRef();
  const wydluzenieRef = useRef();
  const twardoscRef = useRef();
  const twardoscSelectRef = useRef();
  const udarnoscRef = useRef();
  const udarnoscSelectRef = useRef();
  const youngRef = useRef();
  const showBtnRef = useRef();

  // On submit form func
  const sendData = async (event) => {
    event.preventDefault();
    if (nrWytRef.current.value === "") {
      formIsValid(false);
      return;
    }
    const promises = [];
    await set(ref(database, "wlmech/" + nrWytRef.current.value), {
      nrWyt: nrWytRef.current.value,
      gatunek: gatunekRef.current.value,
      rodzMet: rodzMetRef.current.value,
      rm: rmRef.current.value,
      granica: granicaRef.current.value,
      wydluzenie: wydluzenieRef.current.value,
      twardosc: twardoscRef.current.value + ' ' + twardoscSelectRef.current.value,
      udarnosc: udarnoscRef.current.value + ' ' + udarnoscSelectRef.current.value,
      young: youngRef.current.value,
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
    rmRef.current.value = "";
    granicaRef.current.value = "";
    wydluzenieRef.current.value = "";
    twardoscRef.current.value = "";
    udarnoscRef.current.value = "";
    youngRef.current.value = "";
  };

  // Fetching data from database
  async function fetchData() {
    const response = await fetch(
      "https://bazodlew-default-rtdb.europe-west1.firebasedatabase.app/wlmech.json"
    );
    const data = await response.json();
    const baseItems = [];
    for (const key in data) {
      baseItems.push({
        id: key,
        nrWyt: data[key].nrWyt,
        gatunek: data[key].gatunek,
        rodzMet: data[key].rodzMet,
        rm: data[key].rm,
        granica: data[key].granica,
        wydluzenie: data[key].wydluzenie,
        twardosc: data[key].twardosc,
        udarnosc: data[key].udarnosc,
        young: data[key].young,
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
    <Layout title='wlmech' className={classes.wlmech}>
      <h1 className={classes.wlmech__title}>
        Formularz dodania wyników - właściwości mechaniczne
      </h1>
      <p>Wprowadź dane:</p>
      <Form>
        <Row className="align-items-center">
          <Col xs={12} sm={6} xl={6} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">Nr wytopu</Form.Label>
            <Form.Control
              ref={nrWytRef}
              id="inlineFormInputName"
              placeholder="Np. 2313"
              type="number"
              min="0"
            />
          </Col>
          <Col xs={12} sm={6} xl={6} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              Wytrzymałość na rozciąganie R<sub>m</sub> <i>[MPa]</i>
            </Form.Label>
            <Form.Control
              ref={rmRef}
              id="inlineFormInputName"
              placeholder="Rm w [MPa]"
              type="number"
              min="0"
            />
          </Col>
          <Col xs={12} sm={6} xl={6} className="mb-3">
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
          <Col xs={12} sm={6} xl={6} className="mb-3">
            <Form.Label htmlFor="inlineFormInputGroupUsername">
              Granica plastyczności R<sub>p0,2</sub> <i>[MPa]</i>
            </Form.Label>
            <FormControl
              ref={granicaRef}
              id="inlineFormInputGroupUsername"
              placeholder="Rp0,2 w [MPa]"
              type="number"
              min="0"
            />
          </Col>
          <Col xs={12} sm={6} xl={6} className="mb-3">
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
          
          
          <Col xs={12} sm={6} xl={6} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              Wydłużenie względne A<sub>10</sub> [%]
            </Form.Label>
            <Form.Control
              ref={wydluzenieRef}
              id="inlineFormInputName"
              placeholder="Wydłużenie względne A10 w %"
              type="number"
              min="0"
            />
          </Col>
          
          <Col xs={12} sm={4} xl={3} className="mb-3">
            <Row className={classes.twardosc} className="align-items-center">
              <Col xs={4} sm={4} xl={4}>
                <Form.Label htmlFor="inlineFormInputGroupUsername">
                  Wybierz
                </Form.Label>
                <Form.Select aria-label="Wybierz" ref={twardoscSelectRef}>
                  <option value="HB">HB</option>
                  <option value="HV">HV</option>
                  <option value="HRV">HRC</option>
                </Form.Select>
              </Col>
              <Col xs={8} sm={8} xl={8}>
                <Form.Label htmlFor="inlineFormInputGroupUsername">
                  Twardość
                </Form.Label>
                <FormControl
                  ref={twardoscRef}
                  id="inlineFormInputGroupUsername"
                  placeholder="Twardość"
                  type="number"
                  min="0"
                />
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={4} xl={3} className="mb-3">
            <Row className={classes.udarnosc} className="align-items-center">
              <Col xs={4} sm={4} xl={4}>
                <Form.Label htmlFor="inlineFormInputGroupUsername">
                  Wybierz
                </Form.Label>
                <Form.Select aria-label="Wybierz" ref={udarnoscSelectRef}>
                  <option value="KC">KC</option>
                  <option value="KV">KV</option>
                  <option value="KU">KU</option>
                </Form.Select>
              </Col>
              <Col xs={8} sm={8} xl={8}>
                <Form.Label htmlFor="inlineFormInputGroupUsername">
                  Udarność
                </Form.Label>
                <FormControl
                  ref={udarnoscRef}
                  id="inlineFormInputGroupUsername"
                  placeholder="Udarność"
                  type="number"
                  min="0"
                />
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={4} xl={6} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              Moduł Younga E [GPa]
            </Form.Label>
            <Form.Control
              ref={youngRef}
              id="inlineFormInputName"
              placeholder="Moduł Younga E w [GPa]"
              type="number"
              min="0"
            />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col xs={12} sm={12} xl={6} className="offset-md-3">
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
                <th>Wytrzymałość na rozciąganie R<sub>m</sub>[<i>MPa</i>]</th>
                <th>Granica plastyczności R<sub>p0,2</sub> [<i>MPa</i>]</th>
                <th>Wydłużenie względne A<sub>10</sub> [<i>%</i>]</th>
                <th>Twardość</th>
                <th>Udarność</th>
                <th>Moduł Younga E [<i>GPa</i>]</th>
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
                    <td>{item.rm}</td>
                    <td>{item.granica}</td>
                    <td>{item.wydluzenie}</td>
                    <td>{item.twardosc}</td>
                    <td>{item.udarnosc}</td>
                    <td>{item.young}</td>
                    <td className="text-center">
                      <button
                        className={classes.deleteIcon}
                        onClick={(e) => {
                          e.preventDefault();
                          remove(ref(database, "wlmech/" + item.nrWyt))
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

export default Wlmech;
