import classes from "./Analiza.module.css";
import { useContext, useRef, useState, useEffect } from "react";
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

const Analiza = () => {
  // Manage data states
  const [showTable, setShowTable] = useState(false);
  const [datas, setDatas] = useState([]);
  const [btnTableText, setBtnTableText] = useState(false);
  const [showText, setShowText] = useState("Pokaż wyniki");
  const [showAddAlert, setAddShowAlert] = useState(false);
  const [showRemoveAlert, setRemoveShowAlert] = useState(false);

  const [mounted, setMounted] = useState(false);

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

  // C
  const {
    value: C,
    isValid: CIsValid,
    hasError: CHasError,
    valueChangeHandler: CChange,
    inputBlurHandler: CBlur,
    reset: resetC,
  } = useInput((value) => value.trim() !== "", "7", false, true);

  // Si
  const {
    value: Si,
    isValid: SiIsValid,
    hasError: SiHasError,
    valueChangeHandler: SiChange,
    inputBlurHandler: SiBlur,
    reset: resetSi,
  } = useInput((value) => value.trim() !== "", "7", false, true);

  // Mn
  const {
    value: Mn,
    isValid: MnIsValid,
    hasError: MnHasError,
    valueChangeHandler: MnChange,
    inputBlurHandler: MnBlur,
    reset: resetMn,
  } = useInput((value) => value.trim() !== "", "7", false, true);

  // Mg
  const {
    value: Mg,
    isValid: MgIsValid,
    hasError: MgHasError,
    valueChangeHandler: MgChange,
    inputBlurHandler: MgBlur,
    reset: resetMg,
  } = useInput((value) => value.trim() !== "", "7", false, true);

  // P
  const {
    value: P,
    isValid: PIsValid,
    hasError: PHasError,
    valueChangeHandler: PChange,
    inputBlurHandler: PBlur,
    reset: resetP,
  } = useInput((value) => value.trim() !== "", "7", false, true);

  // S
  const {
    value: S,
    isValid: SIsValid,
    hasError: SHasError,
    valueChangeHandler: SChange,
    inputBlurHandler: SBlur,
    reset: resetS,
  } = useInput((value) => value.trim() !== "", "7", false, true);

  // Cu
  const {
    value: Cu,
    isValid: CuIsValid,
    hasError: CuHasError,
    valueChangeHandler: CuChange,
    inputBlurHandler: CuBlur,
    reset: resetCu,
  } = useInput((value) => value.trim() !== "", "7", false, true);

  // Ce
  const {
    value: Ce,
    isValid: CeIsValid,
    hasError: CeHasError,
    valueChangeHandler: CeChange,
    inputBlurHandler: CeBlur,
    reset: resetCe,
  } = useInput((value) => value.trim() !== "", "7", false, true);

  // La
  const {
    value: La,
    isValid: LaIsValid,
    hasError: LaHasError,
    valueChangeHandler: LaChange,
    inputBlurHandler: LaBlur,
    reset: resetLa,
  } = useInput((value) => value.trim() !== "", "7", false, true);

  // Zr
  const {
    value: Zr,
    isValid: ZrIsValid,
    hasError: ZrHasError,
    valueChangeHandler: ZrChange,
    inputBlurHandler: ZrBlur,
    reset: resetZr,
  } = useInput((value) => value.trim() !== "", "7", false, true);

  // Bi
  const {
    value: Bi,
    isValid: BiIsValid,
    hasError: BiHasError,
    valueChangeHandler: BiChange,
    inputBlurHandler: BiBlur,
    reset: resetBi,
  } = useInput((value) => value.trim() !== "", "7", false, true);

  // Ca
  const {
    value: Ca,
    isValid: CaIsValid,
    hasError: CaHasError,
    valueChangeHandler: CaChange,
    inputBlurHandler: CaBlur,
    reset: resetCa,
  } = useInput((value) => value.trim() !== "", "7", false, true);

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

    if (!wytValid) {
      return;
    }
    const promises = [];
    const date = new Date();
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

    setWyt("");
    setWytTouched(false);
    resetGat();
    resetRodz();
    resetC();
    resetSi();
    resetMn();
    resetMg();
    resetP();
    resetS();
    resetCu();
    resetCe();
    resetLa();
    resetZr();
    resetBi();
    resetCa();
  };

  // Fetching data from database
  async function fetchData() {
    const token = authCtx.token;
    const response = await fetch(
      "https://bazodlew-default-rtdb.europe-west1.firebasedatabase.app/analiza.json?auth=" +
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
  // Fetching data once
  useEffect(() => {
    fetchData();
  });

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

  // Walidacja formularza

  let formIsValid = false;
  if (
    !wytInvalid &&
    gatIsValid &&
    rodzIsValid &&
    CIsValid &&
    SiIsValid &&
    MnIsValid &&
    MgIsValid &&
    PIsValid &&
    SIsValid &&
    CuIsValid &&
    CeIsValid &&
    LaIsValid &&
    ZrIsValid &&
    BiIsValid &&
    CaIsValid
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

  const CClasses = CHasError ? classes.invalid : "";
  const CStar = CHasError ? classes.errorStar : "";

  const SiClasses = SiHasError ? classes.invalid : "";
  const SiStar = SiHasError ? classes.errorStar : "";

  const MnClasses = MnHasError ? classes.invalid : "";
  const MnStar = MnHasError ? classes.errorStar : "";

  const MgClasses = MgHasError ? classes.invalid : "";
  const MgStar = MgHasError ? classes.errorStar : "";

  const PClasses = PHasError ? classes.invalid : "";
  const PStar = PHasError ? classes.errorStar : "";

  const SClasses = SHasError ? classes.invalid : "";
  const SStar = SHasError ? classes.errorStar : "";

  const CuClasses = CuHasError ? classes.invalid : "";
  const CuStar = CuHasError ? classes.errorStar : "";

  const CeClasses = CeHasError ? classes.invalid : "";
  const CeStar = CeHasError ? classes.errorStar : "";

  const LaClasses = LaHasError ? classes.invalid : "";
  const LaStar = LaHasError ? classes.errorStar : "";

  const ZrClasses = ZrHasError ? classes.invalid : "";
  const ZrStar = ZrHasError ? classes.errorStar : "";

  const BiClasses = BiHasError ? classes.invalid : "";
  const BiStar = BiHasError ? classes.errorStar : "";

  const CaClasses = CaHasError ? classes.invalid : "";
  const CaStar = CaHasError ? classes.errorStar : "";

  return (
    <Layout title="analiza" className={classes.analiza}>
      <h1 className={classes.analiza__title}>
        Formularz dodania wyników - analiza chemiczna
      </h1>
      <p>Wprowadź dane [ <span className={classes.obowiazkowe}>* - pole obowiązkowe</span> ]:</p>
      <Form>
        <Row className="align-items-center">
          <Col xs={12} sm={4} xl={4} className="mb-3">
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
          <Col xs={12} sm={4} xl={4} className="mb-3">
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
          <Col xs={12} sm={4} xl={4} className="mb-3">
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
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="C">
              C [<i>węgiel</i>] [%] <span className={CStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={wegielRef}
              id="C"
              placeholder="udział % C"
              type="number"
              min="0"
              max="100"
              value={C}
              className={CClasses}
              onChange={CChange}
              onBlur={CBlur}
              required
            />
            {CHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="Si">
              Si [<i>krzem</i>] [%] <span className={SiStar}>*</span>
            </Form.Label>
            <FormControl
              ref={krzemRef}
              id="Si"
              placeholder="udział % Si"
              type="number"
              min="0"
              max="100"
              value={Si}
              className={SiClasses}
              onChange={SiChange}
              onBlur={SiBlur}
              required
            />
            {SiHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="Mn">
              Mn [<i>mangan</i>] [%] <span className={MnStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={manganRef}
              id="Mn"
              placeholder="udział % Mn"
              type="number"
              min="0"
              max="100"
              value={Mn}
              className={MnClasses}
              onChange={MnChange}
              onBlur={MnBlur}
              required
            />
            {MnHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="Mg">
              Mg [<i>magnez</i>] [%] <span className={MgStar}>*</span>
            </Form.Label>
            <FormControl
              ref={magnezRef}
              id="inlineFormInputGroupUsername"
              placeholder="udział % Mg"
              type="number"
              min="0"
              max="100"
              value={Mg}
              className={MgClasses}
              onChange={MgChange}
              onBlur={MgBlur}
              required
            />
            {MgHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="P">
              P [<i>fosfor</i>] [%] <span className={PStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={fosforRef}
              id="P"
              placeholder="udział % P"
              type="number"
              min="0"
              max="100"
              value={P}
              className={PClasses}
              onChange={PChange}
              onBlur={PBlur}
              required
            />
            {PHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="S">
              S [<i>siarka</i>] [%] <span className={SStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={siarkaRef}
              id="S"
              placeholder="udział % S"
              type="number"
              min="0"
              max="100"
              value={S}
              className={SClasses}
              onChange={SChange}
              onBlur={SBlur}
              required
            />
            {SHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="Cu">
              Cu [<i>miedź</i>] [%] <span className={CuStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={miedzRef}
              id="Cu"
              placeholder="udział % Cu"
              type="number"
              min="0"
              max="100"
              value={Cu}
              className={CuClasses}
              onChange={CuChange}
              onBlur={CuBlur}
              required
            />
            {CuHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="Ce">
              Ce [<i>cer</i>] [%] <span className={CeStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={cerRef}
              id="Ce"
              placeholder="udział % Ce"
              type="number"
              min="0"
              max="100"
              value={Ce}
              className={CeClasses}
              onChange={CeChange}
              onBlur={CeBlur}
              required
            />
            {CeHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="La">
              La [<i>lantan</i>] [%] <span className={LaStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={lantanRef}
              id="La"
              placeholder="udział % La"
              type="number"
              min="0"
              max="100"
              value={La}
              className={LaClasses}
              onChange={LaChange}
              onBlur={LaBlur}
              required
            />
            {LaHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="Zr">
              Zr [<i>cyrkon</i>] [%] <span className={ZrStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={cyrkonRef}
              id="inlineFormInputName"
              placeholder="udział % Zr"
              type="number"
              min="0"
              max="100"
              value={Zr}
              className={ZrClasses}
              onChange={ZrChange}
              onBlur={ZrBlur}
              required
            />
            {ZrHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="Bi">
              Bi [<i>bizmut</i>] [%] <span className={BiStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={bizmutRef}
              id="Bi"
              placeholder="udział % Bi"
              type="number"
              min="0"
              max="100"
              value={Bi}
              className={BiClasses}
              onChange={BiChange}
              onBlur={BiBlur}
              required
            />
            {BiHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={3} xl={2} className="mb-3">
            <Form.Label htmlFor="Ca">
              Ca [<i>wapń</i>] [%] <span className={CaStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={wapnRef}
              id="Ca"
              placeholder="udział % Ca"
              type="number"
              min="0"
              max="100"
              value={Ca}
              className={CaClasses}
              onChange={CaChange}
              onBlur={CaBlur}
              required
            />
            {CaHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col xs={12} sm={12} xl={6} className="offset-xl-3">
            <Button
              onClick={sendData}
              className={classes.submitBtn}
              type="submit"
              disabled={!formIsValid}
            >
              Dodaj wyniki
            </Button>
          </Col>
        </Row>

        {showAddAlert && (
          <Modal onClose={closeAlertHandler}>
            Wprowadzono wyniki!
          </Modal>
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
                <th style={{ width: "5%" }}>Nr wytopu</th>
                <th style={{ width: "9.5%" }}>Gatunek</th>
                <th style={{ width: "9.75%" }}>Rodzaj metalu</th>
                <th style={{ width: "6%" }}>C</th>
                <th style={{ width: "6%" }}>Si</th>
                <th style={{ width: "6%" }}>Mn</th>
                <th style={{ width: "6%" }}>Mg</th>
                <th style={{ width: "6%" }}>P</th>
                <th style={{ width: "6%" }}>S</th>
                <th style={{ width: "6%" }}>Cu</th>
                <th style={{ width: "6%" }}>Ce</th>
                <th style={{ width: "6%" }}>La</th>
                <th style={{ width: "6%" }}>Zr</th>
                <th style={{ width: "6%" }}>Bi</th>
                <th style={{ width: "6%" }}>Ca</th>
                <th style={{ width: "3.75%" }}>Usuń</th>
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
      {showTable &&
        mounted &&
        currentRecords.length === 0 &&
        paginate((prev) => prev - 1)}
    </Layout>
  );
};

export default Analiza;
