import { useRef, useState, useContext, useEffect } from "react";
import { Form, Button, Col, Row, FormControl, Table } from "react-bootstrap";
import { auth, storage, database } from "../../firebase/firebase";
import { ref, set, remove } from "firebase/database";

import Layout from "../Layout/Layout";
import Modal from "../UI/Modal";
import Pagination from "../Layout/Pagination";
import classes from "./Struktura.module.css";
import AuthContext from "../../store/auth-context";
import useInput from "../../hooks/use-input";
import errorIcon from "../static/error-icon.png";
import warningIcon from "../static/warning-icon.png";
import ImgModal from "../UI/ImgModal";

const Struktura = () => {
  // Manage data states
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [progress, setProgress] = useState(0.0);
  const [imgUrls, setImgUrls] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [datas, setDatas] = useState([]);
  const [btnTableText, setBtnTableText] = useState(false);
  const [showText, setShowText] = useState("Pokaż wyniki");
  const [showAddAlert, setAddShowAlert] = useState(false);
  const [showRemoveAlert, setRemoveShowAlert] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);
  const [modalImgUrl, setModalImgUrl] = useState('');

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
  const liczbWydzRef = useRef();
  const stpSferRef = useRef();
  const udzGrafRef = useRef();
  const udzPerlRef = useRef();
  const udzFerrRef = useRef();
  const img1Ref = useRef();
  const img2Ref = useRef();
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
  // Liczb wydz
  const {
    value: wydz,
    isValid: wydzIsValid,
    hasError: wydzHasError,
    valueChangeHandler: wydzChange,
    inputBlurHandler: wydzBlur,
    reset: resetWydz,
  } = useInput((value) => value.trim() !== "", "15", false);
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
  // Stopień sferoidalności
  const {
    value: sfer,
    isValid: sferIsValid,
    hasError: sferHasError,
    valueChangeHandler: sferChange,
    inputBlurHandler: sferBlur,
    reset: resetSfer,
  } = useInput((value) => value.trim() !== "", "7", false, true);

  // Udział grafitu
  const {
    value: graf,
    isValid: grafIsValid,
    hasError: grafHasError,
    valueChangeHandler: grafChange,
    inputBlurHandler: grafBlur,
    reset: resetGraf,
  } = useInput((value) => value.trim() !== "", "7", false, true);

  // Udział perlitu
  const {
    value: perl,
    isValid: perlIsValid,
    hasError: perlHasError,
    valueChangeHandler: perlChange,
    inputBlurHandler: perlBlur,
    reset: resetPerl,
  } = useInput((value) => value.trim() !== "", "7", false, true);

  // Udział ferrytu
  const {
    value: fer,
    isValid: ferIsValid,
    hasError: ferHasError,
    valueChangeHandler: ferChange,
    inputBlurHandler: ferBlur,
    reset: resetFer,
  } = useInput((value) => value.trim() !== "", "7", false, true);

  // Zdjęcie przed trawieniem
  const [zdj1, setZdj1] = useState("");
  const [zdj1Touched, setZdj1Touched] = useState(false);

  const zdj1Valid = zdj1 > 0;
  const zdj1Invalid = !zdj1Valid && zdj1Touched;

  const zdj1Blur = () => {
    setZdj1Touched(true);
  };

  // Zdjęcie po trawieniem
  const [zdj2, setZdj2] = useState("");
  const [zdj2Touched, setZdj2Touched] = useState(false);

  const zdj2Valid = zdj2 > 0;
  const zdj2Invalid = !zdj2Valid && zdj2Touched;

  const zdj2Blur = () => {
    setZdj2Touched(true);
  };

  // Insert first image func
  const handleChange1 = (e) => {
    setZdj1(img1Ref.current.files.length);
    if (e.target.files[0]) {
      setImage1(e.target.files[0]);
    }
  };
  // Insert second image func
  const handleChange2 = (e) => {
    setZdj2(img1Ref.current.files.length);
    if (e.target.files[0]) {
      setImage2(e.target.files[0]);
    }
  };

  // Walidacja formularza

  let formIsValid = false;
  if (
    !wytInvalid &&
    wydzIsValid &&
    gatIsValid &&
    sferIsValid &&
    rodzIsValid &&
    grafIsValid &&
    perlIsValid &&
    ferIsValid &&
    zdj1Valid &&
    zdj2Valid
  ) {
    formIsValid = true;
  }

  // On submit form func
  const sendData = async (event) => {
    event.preventDefault();
    let count = 1;
    const promises = [];
    const date = new Date();
    await set(ref(database, "struktura/" + nrWytRef.current.value), {
      nrWyt: nrWytRef.current.value,
      gatunek: gatunekRef.current.value,
      rodzMet: rodzMetRef.current.value,
      liczbWydz: liczbWydzRef.current.value,
      stpSfer: stpSferRef.current.value,
      udzGraf: udzGrafRef.current.value,
      udzPerl: udzPerlRef.current.value,
      udzFerr: udzFerrRef.current.value,
      data: {
        dzien: date.getDate(),
        miesiac: date.getMonth() + 1,
        rok: date.getFullYear(),
        godzina: date.getHours(),
        minuta: date.getMinutes(),
      },
    })
      .then(() => {
        const uploadTask1 = storage
          .ref(`/images/${nrWytRef.current.value}_${count}.jpeg`)
          .put(image1);
        promises.push(uploadTask1);
        uploadTask1.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
            console.log(error);
          }
        );
        count = count + 1;
      })
      .then(() => {
        const uploadTask2 = storage
          .ref(`/images/${nrWytRef.current.value}_${count}.jpeg`)
          .put(image2);
        promises.push(uploadTask2);
        uploadTask2.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
            console.log(error);
          },
          () => {
            storage
              .ref()
              .child("images/")
              .listAll()
              .then(setImgUrls([]))
              .then((res) => {
                res.items.forEach((item) => {
                  item.getDownloadURL().then((url) => {
                    setImgUrls((arr) => [...arr, url]);
                  });
                });
              })
              .catch((err) => {
                console.log(err.message);
              });
          }
        );
        count = count + 1;
      });

    Promise.all(promises)
      .then(fetchData())
      .then(setAddShowAlert(true))
      .then(setTimeout(() => setAddShowAlert(false), 3000))
      .catch((err) => console.log(err));

    // Clear inputs
    nrWytRef.current.value = "";
    gatunekRef.current.value = "";
    rodzMetRef.current.value = "";
    liczbWydzRef.current.value = "";
    stpSferRef.current.value = "";
    udzGrafRef.current.value = "";
    udzPerlRef.current.value = "";
    udzFerrRef.current.value = "";
    img1Ref.current.value = null;
    img2Ref.current.value = null;
    setWyt("");
    setWytTouched(false);
    resetWydz();
    resetGat();
    resetRodz();
    resetSfer();
    resetGraf();
    resetPerl();
    resetFer();
  };

  // Fetching data from database
  async function fetchData() {
    const token = authCtx.token;
    const response = await fetch(
      "https://bazodlew-default-rtdb.europe-west1.firebasedatabase.app/struktura.json?auth=" +
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
        liczbWydz: data[key].liczbWydz,
        stpSfer: data[key].stpSfer,
        udzGraf: data[key].udzGraf,
        udzPerl: data[key].udzPerl,
        udzFerr: data[key].udzFerr,
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

  const fetchImages = async () => {
    await storage
      .ref()
      .child("images/")
      .listAll()
      .then(setImgUrls([]))
      .then((res) => {
        res.items.forEach((item) => {
          item.getDownloadURL().then((url) => {
            setImgUrls((arr) => [...arr, url]);
          });
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const imgModalHandler = () => {
    setShowImgModal((prevState) => !prevState);
  };

  const listImages = async () => {
    if (btnTableText) {
      setShowText("Pokaż wyniki");
    } else {
      setShowText("Ukryj wyniki");
    }
    setBtnTableText((prevState) => !prevState);

    setShowTable((prevState) => !prevState);
    setMounted(true);
  };

  const closeAlertHandler = (props) => {
    setAddShowAlert(false);
    setRemoveShowAlert(false);
  };

  useEffect(() => {
    fetchImages();
    fetchData();
  }, []);

  const renderTable = () => {
    return currentRecords.map((item, i) => {
      return (
        <tr key={i} className="align-items-center">
          <td className={classes.time}>
            {`${item.data.dzien}/${item.data.miesiac}/${item.data.rok}`}
            <span className={classes.timeHover}>
              {item.data.minuta <= 9 &&
                item.data.minuta >= 0 &&
                item.data.godzina + ":0" + item.data.minuta}
              {item.data.minuta > 9 &&
                item.data.godzina + ":" + item.data.minuta}
            </span>
          </td>
          <td>{item.nrWyt}</td>
          <td>{item.gatunek}</td>
          <td>{item.rodzMet}</td>
          <td>{item.liczbWydz}</td>
          <td>{item.stpSfer}</td>
          <td>{item.udzGraf}</td>
          <td>{item.udzPerl}</td>
          <td>{item.udzFerr}</td>
          <td className={classes.imgCont}>
            {imgUrls.map((url, i) => {
              let url1 = url.split("2F");
              let url2 = url1[1].split("?alt");
              let url3 = url2[0];
              let count = 0;
              if (
                url3 === `${item.nrWyt}_1` ||
                url3 === `${item.nrWyt}_1.jpeg`
              ) {
                if (count === 0) {
                  count++;
                  return (
                    <div key={i} onClick={() => {
                      imgModalHandler();
                      setModalImgUrl(url);
                    }}>
                      <img key={i} className={classes.zdj} src={url} alt="" />
                      <div className={classes.middle}>
                        <div className={classes.text}>
                          Kliknij aby powiększyć
                        </div>
                      </div>
                    </div>
                  );
                }
              }
            })}
          </td>
          <td className={classes.imgCont}>
            {imgUrls.map((url, i) => {
              let url1 = url.split("2F");
              let url2 = url1[1].split("?alt");
              let url3 = url2[0];
              let count = 0;
              if (
                url3 === `${item.nrWyt}_2` ||
                url3 === `${item.nrWyt}_2.jpeg`
              ) {
                if (count === 0) {
                  count++;
                  return (
                    <div key={i} onClick={() => {
                      imgModalHandler();
                      setModalImgUrl(url);
                    }}>
                      <img key={i} className={classes.zdj} src={url} alt="" />
                      <div className={classes.middle}>
                        <div className={classes.text}>
                          Kliknij aby powiększyć
                        </div>
                      </div>
                    </div>
                  );
                }
              }
            })}
          </td>
          <td className="text-center">
            <button
              className={classes.deleteIcon}
              onClick={(e) => {
                e.preventDefault();
                imgUrls.map((url) => {
                  if (
                    url.includes(`${item.nrWyt}_1`) ||
                    url.includes(`${item.nrWyt}_2`)
                  ) {
                    storage.refFromURL(url).delete();
                  }
                });
                remove(ref(database, "struktura/" + item.nrWyt))
                  .then(setRemoveShowAlert(true))
                  .then(setTimeout(() => setRemoveShowAlert(false), 3000))
                  .then(setTimeout(() => fetchData(), 500))
                  .catch((error) =>
                    alert("Nie udało się usunąć rekordu: " + error)
                  );
              }}
            ></button>
          </td>
        </tr>
      );
    });
  };
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

  const wydzClasses = wydzHasError ? classes.invalid : "";
  const wydzStar = wydzHasError ? classes.errorStar : "";

  const gatClasses = gatHasError ? classes.invalid : "";
  const gatStar = gatHasError ? classes.errorStar : "";

  const rodzClasses = rodzHasError ? classes.invalid : "";
  const rodzStar = rodzHasError ? classes.errorStar : "";

  const sferClasses = sferHasError ? classes.invalid : "";
  const sferStar = sferHasError ? classes.errorStar : "";

  const grafClasses = grafHasError ? classes.invalid : "";
  const grafStar = grafHasError ? classes.errorStar : "";

  const perlClasses = perlHasError ? classes.invalid : "";
  const perlStar = perlHasError ? classes.errorStar : "";

  const ferClasses = ferHasError ? classes.invalid : "";
  const ferStar = ferHasError ? classes.errorStar : "";

  const zdj1Classes = zdj1Invalid ? classes.invalid : "";
  const zdj1Star = zdj1Invalid ? classes.errorStar : "";

  const zdj2Classes = zdj2Invalid ? classes.invalid : "";
  const zdj2Star = zdj2Invalid ? classes.errorStar : "";

  return (
    <Layout title="struktura" className={classes.struktura}>
      <h1 className={classes.struktura__title}>
        Formularz dodania wyników - struktura
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
            {wytInvalid && (
              <span className={classes.error}>
                {wytExist === "" && errorText}
              </span>
            )}
            {wytExist !== "" && (
              <span className={classes.warning}>{wytExist}</span>
            )}
            {wytInvalid && wytExist === "" && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
            {wytExist !== "" && (
              <img alt="" src={warningIcon} className={classes.warningIcon} />
            )}
          </Col>
          <Col xs={12} sm={6} xl={6} className="mb-3">
            <Form.Label htmlFor="wydz">
              Liczba wydzieleń grafitu [1/mm<sup>2</sup>]{" "}
              <span className={wydzStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={liczbWydzRef}
              id="wydz"
              placeholder="Np. 2313"
              type="number"
              min="0"
              value={wydz}
              className={wydzClasses}
              onChange={wydzChange}
              onBlur={wydzBlur}
              required
            />
            {wydzHasError && <span className={classes.error}>{errorText}</span>}
            {wydzHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
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
            <Form.Label htmlFor="sfer">
              Stopień sferoidalności grafitu [%]{" "}
              <span className={sferStar}>*</span>
            </Form.Label>
            <FormControl
              ref={stpSferRef}
              id="sfer"
              placeholder="Sferoidalność"
              type="number"
              min="0"
              max="100"
              value={sfer}
              className={sferClasses}
              onChange={sferChange}
              onBlur={sferBlur}
              required
            />
            {sferHasError && <span className={classes.error}>{errorText}</span>}
            {sferHasError && (
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

          <Col xs={12} sm={6} xl={3} className="mb-3">
            <Form.Label htmlFor="graf">
              Udział grafitu [%] <span className={grafStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={udzGrafRef}
              id="graf"
              placeholder="Udział % grafitu"
              type="number"
              min="0"
              max="100"
              value={graf}
              className={grafClasses}
              onChange={grafChange}
              onBlur={grafBlur}
              required
            />
            {grafHasError && <span className={classes.error}>{errorText}</span>}
            {grafHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={6} xl={3} className="mb-3">
            <Form.Label htmlFor="perl">
              Udział perlitu [%] <span className={perlStar}>*</span>
            </Form.Label>
            <FormControl
              ref={udzPerlRef}
              id="perl"
              placeholder="Udział % perlitu"
              type="number"
              min="0"
              max="100"
              value={perl}
              className={perlClasses}
              onChange={perlChange}
              onBlur={perlBlur}
              required
            />
            {perlHasError && <span className={classes.error}>{errorText}</span>}
            {perlHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={6} xl={6} className="mb-3">
            <Form.Label htmlFor="zdj1">
              Zdjęcie struktury przed trawieniem{" "}
              <span className={zdj1Star}>*</span>
            </Form.Label>
            <FormControl
              id="zdj1"
              ref={img1Ref}
              placeholder="Zdjęcie przed trawieniem"
              type="file"
              onChange={handleChange1}
              className={zdj1Classes}
              onBlur={zdj1Blur}
              required
            />
            {zdj1Invalid && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={6} xl={3} className="mb-3">
            <Form.Label htmlFor="fer">
              Udział ferrytu [%] <span className={ferStar}>*</span>
            </Form.Label>
            <Form.Control
              ref={udzFerrRef}
              id="fer"
              placeholder="Udział % ferrytu"
              type="number"
              min="0"
              max="100"
              value={fer}
              className={ferClasses}
              onChange={ferChange}
              onBlur={ferBlur}
              required
            />
            {ferHasError && <span className={classes.error}>{errorText}</span>}
            {ferHasError && (
              <img alt="" src={errorIcon} className={classes.errorIcon} />
            )}
          </Col>
          <Col xs={12} sm={6} xl={6} className="mb-3">
            <Form.Label htmlFor="zdj2">
              Zdjęcie struktury po trawieniu <span className={zdj2Star}>*</span>
            </Form.Label>
            <FormControl
              id="zdj2"
              ref={img2Ref}
              placeholder="Zdjęcie po trawieniu"
              type="file"
              onChange={handleChange2}
              className={zdj2Classes}
              onBlur={zdj2Blur}
              required
            />
            {zdj2Invalid && (
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
                  Liczba wydzieleń grafitu [1/mm<sup>2</sup>]
                </th>
                <th>Stopień sferoidalności grafitu [%]</th>
                <th>Udział grafitu [%]</th>
                <th>Udział perlitu [%]</th>
                <th>Udział ferrytu [%]</th>
                <th style={{ width: "12.5%" }}>Zdjęcie przed trawieniem</th>
                <th style={{ width: "12.5%" }}>Zdjęcie po trawieniu</th>
                <th>Usuń</th>
              </tr>
            </thead>
            <tbody className="text-center">{renderTable()}</tbody>
          </Table>
        </div>
      )}
      {showImgModal && (
        <ImgModal
          src={modalImgUrl}
          onClose={imgModalHandler}
        ></ImgModal>
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
        <p className={classes.error}>Brak wyników w bazie!</p>
      )}
      {showTable &&
        mounted &&
        currentRecords.length === 0 &&
        paginate((prev) => prev - 1)}
    </Layout>
  );
};

export default Struktura;
