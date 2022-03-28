import classes from "./Wlmech.module.css";
import { useRef, useState, useContext, useEffect } from "react";
import { Form, Button, Col, Row, FormControl, Table } from "react-bootstrap";
import { database } from "../../firebase/firebase";
import { ref, set, remove } from "firebase/database";

import Layout from "../Layout/Layout";
import Modal from "../UI/Modal";
import Pagination from "../Layout/Pagination";
import AuthContext from "../../store/auth-context";
import useInput from "../../hooks/use-input";
import errorIcon from "../static/error-icon.png";
import warningIcon from "../static/warning-icon.png";

const Wlmech = () => {
  // Manage data states
  const [showTable, setShowTable] = useState(false);
  const [datas, setDatas] = useState([]);
  const [btnTableText, setBtnTableText] = useState(false);
  const [showText, setShowText] = useState("Pokaż wyniki");
  const [showAddAlert, setAddShowAlert] = useState(false);
  const [showRemoveAlert, setRemoveShowAlert] = useState(false);

  const [mounted, setMounted] = useState(false);

  // use Context to retrieve auth token
  const authCtx = useContext(AuthContext);

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

  // Manage input states - Error managing
  let errorText = "Błędne dane!";
  // Input validation
  // Nr Wytopu
  const [wyt, setWyt] = useState("");
  const [wytTouched, setWytTouched] = useState(false);
  const [wytExist, setWytExist] = useState("");

  const wytValid = wyt.trim() !== "" && wytExist === "";
  const wytInvalid = !wytValid && wytTouched;
  let itemNr = "";
  const wytBlur = () => {
    setWytTouched(true);
    datas.map((item) => {
      itemNr = item.nrWyt;
      if (itemNr === wyt) {
        let temp = `${itemNr} już istnieje w bazie!`;
        setWytExist(temp);
      }
    });
  };
  const wytHandler = (event) => {
    setWytTouched(true);
    if (event.target.value.length <= 6 && event.target.value >= 0) {
      setWyt(event.target.value);
    }
    if (event.target.value === "" || event.target.value !== itemNr) {
      setWytExist("");
    }
  };

  // Gatunek
  const {
    value: gat,
    isValid: gatIsValid,
    hasError: gatHasError,
    valueChangeHandler: gatChange,
    inputBlurHandler: gatBlur,
    reset: resetGat,
  } = useInput((value) => value.trim() !== "", "25");

  // Rodz metalu
  const {
    value: rodz,
    isValid: rodzIsValid,
    hasError: rodzHasError,
    valueChangeHandler: rodzChange,
    inputBlurHandler: rodzBlur,
    reset: resetRodz,
  } = useInput((value) => value.trim() !== "", "25");

  // Wytrzymałość na rozciąganie Rm
  const {
    value: rm,
    isValid: rmIsValid,
    hasError: rmHasError,
    valueChangeHandler: rmChange,
    inputBlurHandler: rmBlur,
    reset: resetRm,
  } = useInput((value) => value.trim() !== "", "15", false);

  // Granica plastyczności
  const {
    value: granica,
    isValid: granicaIsValid,
    hasError: granicaHasError,
    valueChangeHandler: granicaChange,
    inputBlurHandler: granicaBlur,
    reset: resetGranica,
  } = useInput((value) => value.trim() !== "", "15", false);

  // Wydłużenie względne A10
  const {
    value: wydl,
    isValid: wydlIsValid,
    hasError: wydlHasError,
    valueChangeHandler: wydlChange,
    inputBlurHandler: wydlBlur,
    reset: resetWydl,
  } = useInput((value) => value.trim() !== "", "7", false);

  // Moduł Younga E
  const {
    value: modul,
    isValid: modulIsValid,
    hasError: modulHasError,
    valueChangeHandler: modulChange,
    inputBlurHandler: modulBlur,
    reset: resetModul,
  } = useInput((value) => value.trim() !== "", "10", false);

  // Twardość
  const {
    value: twar,
    isValid: twarIsValid,
    hasError: twarHasError,
    valueChangeHandler: twarChange,
    inputBlurHandler: twarBlur,
    reset: resetTwar,
  } = useInput((value) => value.trim() !== "", "10", false);

  // Udarność
  const {
    value: udar,
    isValid: udarIsValid,
    hasError: udarHasError,
    valueChangeHandler: udarChange,
    inputBlurHandler: udarBlur,
    reset: resetUdar,
  } = useInput((value) => value.trim() !== "", "10", false);

  // On submit form func
  const sendData = async (event) => {
    event.preventDefault();
    if (nrWytRef.current.value === "") {
      formIsValid(false);
      return;
    }
    const promises = [];
    const date = new Date();

    await set(ref(database, "wlmech/" + nrWytRef.current.value), {
      nrWyt: nrWytRef.current.value,
      gatunek: gatunekRef.current.value,
      rodzMet: rodzMetRef.current.value,
      rm: rmRef.current.value,
      granica: granicaRef.current.value,
      wydluzenie: wydluzenieRef.current.value,
      twardosc:
        twardoscRef.current.value + " " + twardoscSelectRef.current.value,
      udarnosc:
        udarnoscRef.current.value + " " + udarnoscSelectRef.current.value,
      young: youngRef.current.value,
      data: {
        dzien: date.getDate(),
        miesiac: date.getMonth() + 1,
        rok: date.getFullYear(),
        godzina: date.getHours(),
        minuta: date.getMinutes(),
      },
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

    setWyt("");
    setWytTouched(false);
    resetGat();
    resetRodz();
    resetRm();
    resetGranica();
    resetWydl();
    resetModul();
    resetTwar();
    resetUdar();
  };

  // Fetching data from database
  async function fetchData() {
    const token = authCtx.token;
    const response = await fetch(
      "https://bazodlew-default-rtdb.europe-west1.firebasedatabase.app/wlmech.json?auth=" +
        token
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
        data: {
          dzien: data[key].data.dzien,
          miesiac: data[key].data.miesiac,
          rok: data[key].data.rok,
          godzina: data[key].data.godzina,
          minuta: data[key].data.minuta,
        },
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
    setMounted(true);
  };

  const closeAlertHandler = (props) => {
    setAddShowAlert(false);
    setRemoveShowAlert(false);
  };

  // Data init
  useEffect(() => {
    fetchData();
  }, []);

  // Walidacja formularza

  let formIsValid = false;
  if (
    !wytInvalid &&
    gatIsValid &&
    rodzIsValid &&
    rmIsValid &&
    granicaIsValid &&
    wydlIsValid &&
    modulIsValid &&
    twarIsValid &&
    udarIsValid
  ) {
    formIsValid = true;
  }

  // Dynamic classes
  let wytClasses = "";
  let wytStar = "";

  if (wytInvalid) {
    wytClasses = classes.invalid;
    wytStar = classes.errorStar;
  }
  if (wytExist !== "") {
    wytClasses = classes.invalidWarning;
    wytStar = classes.warningStar;
  }
  if (!wytInvalid && wytExist === "") {
    wytClasses = "";
    wytStar = "";
  }

  const gatClasses = gatHasError ? classes.invalid : "";
  const gatStar = gatHasError ? classes.errorStar : "";

  const rodzClasses = rodzHasError ? classes.invalid : "";
  const rodzStar = rodzHasError ? classes.errorStar : "";

  const rmClasses = rmHasError ? classes.invalid : "";
  const rmStar = rmHasError ? classes.errorStar : "";

  const granicaClasses = granicaHasError ? classes.invalid : "";
  const granicaStar = granicaHasError ? classes.errorStar : "";

  const wydlClasses = wydlHasError ? classes.invalid : "";
  const wydlStar = wydlHasError ? classes.errorStar : "";

  const modulClasses = modulHasError ? classes.invalid : "";
  const modulStar = modulHasError ? classes.errorStar : "";

  const twarClasses = twarHasError ? classes.invalid : "";
  const twarStar = twarHasError ? classes.errorStar : "";

  const udarClasses = udarHasError ? classes.invalid : "";
  const udarStar = udarHasError ? classes.errorStar : "";

  return (
    <Layout title="wlmech" className={classes.wlmech}>
      <h1 className={classes.wlmech__title}>
        Formularz dodania wyników - właściwości mechaniczne
      </h1>
      <p>
        Wprowadź dane [{" "}
        <span className={classes.obowiazkowe}>* - pole obowiązkowe</span> ]:
      </p>
      <Form>
        <Row className="align-items-center">
          <Col xs={12} sm={6} xl={6} className="mb-3">
            <Form.Label htmlFor="wyt">
              Nr wytopu <span className={wytStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={nrWytRef}
              id="wyt"
              placeholder="Np. 2313"
              type="number"
              min="0"
              className={wytClasses}
              onChange={wytHandler}
              onBlur={wytBlur}
              value={wyt}
            />
            {wytInvalid && wytExist === "" && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
            {wytExist !== "" && (
              <img alt="" src={warningIcon} className={classes.warningIcon} />
            )}
            {wytInvalid && (
              <span className={classes.error}>
                {wytExist === "" && errorText}
              </span>
            )}
            {wytExist !== "" && (
              <span className={classes.warning}>{wytExist}</span>
            )}
          </Col>
          <Col xs={12} sm={6} xl={6} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              Wytrzymałość na rozciąganie R<sub>m</sub> <i>[MPa]</i>{" "}
              <span className={rmStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={rmRef}
              id="inlineFormInputName"
              placeholder="Rm w [MPa]"
              type="number"
              value={rm}
              className={rmClasses}
              onChange={rmChange}
              onBlur={rmBlur}
              required
            />
            {rmHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
            {rmHasError && <span className={classes.error}>{errorText}</span>}
          </Col>
          <Col xs={12} sm={6} xl={6} className="mb-3">
            <Form.Label htmlFor="gat">
              Gatunek <span className={gatStar}>*</span>
            </Form.Label>
            <FormControl
              ref={gatunekRef}
              id="gat"
              type="text"
              list="gatunek"
              placeholder="Np. GJS 500-7"
              value={gat}
              className={gatClasses}
              onChange={gatChange}
              onBlur={gatBlur}
              required
            />
            {gatHasError && <span className={classes.error}>{errorText}</span>}
            {gatHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
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
            <Form.Label htmlFor="granica">
              Granica plastyczności R<sub>p0,2</sub> <i>[MPa]</i>{" "}
              <span className={granicaStar}>*</span>
            </Form.Label>
            <FormControl
              ref={granicaRef}
              id="granica"
              placeholder="Rp0,2 w [MPa]"
              type="number"
              value={granica}
              className={granicaClasses}
              onChange={granicaChange}
              onBlur={granicaBlur}
              required
            />
            {granicaHasError && (
              <span className={classes.error}>{errorText}</span>
            )}
            {granicaHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={6} xl={6} className="mb-3">
            <Form.Label htmlFor="rodz">
              Rodzaj metalu <span className={rodzStar}>*</span>
            </Form.Label>
            <FormControl
              ref={rodzMetRef}
              id="rodz"
              type="text"
              list="rodzMet"
              placeholder="Np. sfero, ADI, szare, SiMo itd."
              value={rodz}
              className={rodzClasses}
              onChange={rodzChange}
              onBlur={rodzBlur}
              required
            />
            {rodzHasError && <span className={classes.error}>{errorText}</span>}
            {rodzHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
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
            <Form.Label htmlFor="wydl">
              Wydłużenie względne A<sub>10</sub> [%]{" "}
              <span className={wydlStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={wydluzenieRef}
              id="wydl"
              placeholder="Wydłużenie względne A10 w %"
              type="number"
              min="0"
              value={wydl}
              className={wydlClasses}
              onChange={wydlChange}
              onBlur={wydlBlur}
              required
            />
            {wydlHasError && <span className={classes.error}>{errorText}</span>}
            {wydlHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>

          <Col xs={12} sm={6} xl={3} className="mb-3">
            <Row className={classes.twardosc}>
              <Col xs={4} sm={5} xl={4}>
                <Form.Label htmlFor="twar">Wybierz</Form.Label>
                <Form.Select aria-label="Wybierz" ref={twardoscSelectRef}>
                  <option value="HB">HB</option>
                  <option value="HV">HV</option>
                  <option value="HRV">HRC</option>
                </Form.Select>
              </Col>
              <Col xs={8} sm={7} xl={8} className={classes.twardoscInput}>
                <Form.Label htmlFor="twardosc">
                  Twardość <span className={twarStar}>*</span>
                </Form.Label>
                <FormControl
                  ref={twardoscRef}
                  id="twardosc"
                  placeholder="Twardość"
                  type="number"
                  value={twar}
                  className={twarClasses}
                  onChange={twarChange}
                  onBlur={twarBlur}
                  required
                />
                {twarHasError && (
                  <img alt="" src={errorIcon} className={classes.errorIcon} />
                )}
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={6} xl={3} className="mb-3">
            <Row className={classes.udarnosc}>
              <Col xs={4} sm={5} xl={4}>
                <Form.Label htmlFor="udar">Wybierz</Form.Label>
                <Form.Select aria-label="Wybierz" ref={udarnoscSelectRef}>
                  <option value="KC">KC</option>
                  <option value="KV">KV</option>
                  <option value="KU">KU</option>
                </Form.Select>
              </Col>
              <Col xs={8} sm={7} xl={8} className={classes.udarnoscInput}>
                <Form.Label htmlFor="udarnosc">
                  Udarność <span className={udarStar}>*</span>
                </Form.Label>
                <FormControl
                  ref={udarnoscRef}
                  id="udarnosc"
                  placeholder="Udarność"
                  type="number"
                  value={udar}
                  className={udarClasses}
                  onChange={udarChange}
                  onBlur={udarBlur}
                  required
                />
                {udarHasError && (
                  <img alt="" src={errorIcon} className={classes.errorIcon} />
                )}
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={6} xl={6} className="mb-3">
            <Form.Label htmlFor="modul">
              Moduł Younga E [GPa] <span className={modulStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={youngRef}
              id="modul"
              placeholder="Moduł Younga E w [GPa]"
              type="number"
              value={modul}
              className={modulClasses}
              onChange={modulChange}
              onBlur={modulBlur}
              required
            />
            {modulHasError && (
              <span className={classes.error}>{errorText}</span>
            )}
            {modulHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col xs={12} sm={12} xl={6} className="offset-xl-3">
            <Button
              disabled={!formIsValid}
              onClick={sendData}
              className={classes.submitBtn}
              type="submit"
            >
              Dodaj wyniki
            </Button>
          </Col>
        </Row>

        {showAddAlert && (
          <Modal onClose={closeAlertHandler}>Wprowadzono wyniki!</Modal>
        )}
      </Form>
      <Row>
        <Col xs={12} sm={6} xl={2}>
          <Button
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
                <th>Data dodania</th>
                <th>Nr wytopu</th>
                <th>Gatunek</th>
                <th>Rodzaj metalu</th>
                <th>
                  Wytrzymałość na rozciąganie R<sub>m</sub>[<i>MPa</i>]
                </th>
                <th>
                  Granica plastyczności R<sub>p0,2</sub> [<i>MPa</i>]
                </th>
                <th>
                  Wydłużenie względne A<sub>10</sub> [<i>%</i>]
                </th>
                <th>Twardość</th>
                <th>Udarność</th>
                <th>
                  Moduł Younga E [<i>GPa</i>]
                </th>
                <th>Usuń</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {currentRecords.map((item, i) => {
                return (
                  <tr key={i} className="align-items-center">
                    <td className={classes.time}>
                      {`${item.data.dzien}/${item.data.miesiac}/${item.data.rok}`}
                      <span className={classes.timeHover}>
                        {item.data.minuta <= 9 &&
                          item.data.minuta >= 0 &&
                          item.data.godzina + ":0" + item.data.minuta}
                        {item.data.minuta > 9 && item.data.godzina + ":" + item.data.minuta}
                      </span>
                    </td>
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
      {showTable &&
        mounted &&
        currentRecords.length === 0 &&
        paginate((prev) => prev - 1)}
    </Layout>
  );
};

export default Wlmech;
