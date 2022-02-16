import { useRef, useState } from "react";
import { Form, Button, Col, Row, FormControl, Table } from "react-bootstrap";
import { storage, database } from "../../firebase/firebase";
import { ref, set, remove } from "firebase/database";

import Layout from "../Layout/Layout";
import Modal from "../UI/Modal";
import Pagination from "../Layout/Pagination";
import classes from "./Struktura.module.css";

const Struktura = () => {
  // Manage data states
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [imgUrls, setImgUrls] = useState([]);
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
  const rodzMetRef = useRef();
  const liczbWydzRef = useRef();
  const stpSferRef = useRef();
  const udzGrafRef = useRef();
  const udzPerlRef = useRef();
  const udzFerrRef = useRef();
  const img1Ref = useRef();
  const img2Ref = useRef();
  const showBtnRef = useRef();

  // Insert first image func
  const handleChange1 = (e) => {
    setImages([]);
    for (let i = 0; i < e.target.files.length; i++) {
      if (e.target.files[0]) {
        const newImage = e.target.files[i];
        newImage["id"] = Math.random();
        setImages((prevState) => [...prevState, newImage]);
      }
    }
  };
  // Insert second image func
  const handleChange2 = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      if (e.target.files[0]) {
        const newImage = e.target.files[i];
        newImage["id"] = Math.random();
        setImages((prevState) => [...prevState, newImage]);
      }
    }
  };

  // On submit form func
  const sendData = async (event) => {
    event.preventDefault();
    if (nrWytRef.current.value === "") {
      formIsValid(false);
      return;
    }
    let count = 1;
    const promises = [];
    await set(ref(database, "struktura/" + nrWytRef.current.value), {
      nrWyt: nrWytRef.current.value,
      rodzMet: rodzMetRef.current.value,
      liczbWydz: liczbWydzRef.current.value,
      stpSfer: stpSferRef.current.value,
      udzGraf: udzGrafRef.current.value,
      udzPerl: udzPerlRef.current.value,
      udzFerr: udzFerrRef.current.value,
    }).then(
      images.map((image) => {
        const uploadTask = storage
          .ref(`/images/${nrWytRef.current.value}_${count}`)
          .put(image);
        promises.push(uploadTask);
        uploadTask.on(
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
    );

    Promise.all(promises)
      .then(setAddShowAlert(true))
      .then(setTimeout(() => setAddShowAlert(false), 3000))
      .catch((err) => console.log(err));

    // Clear inputs
    nrWytRef.current.value = "";
    rodzMetRef.current.value = "";
    liczbWydzRef.current.value = "";
    stpSferRef.current.value = "";
    udzGrafRef.current.value = "";
    udzPerlRef.current.value = "";
    udzFerrRef.current.value = "";
    img1Ref.current.value = null;
    img2Ref.current.value = null;
  };

  // Fetching data from database
  async function fetchData() {
    const response = await fetch(
      "https://bazodlew-default-rtdb.europe-west1.firebasedatabase.app/struktura.json"
    );
    const data = await response.json();
    const baseItems = [];
    for (const key in data) {
      baseItems.push({
        id: key,
        nrWyt: data[key].nrWyt,
        rodzMet: data[key].rodzMet,
        liczbWydz: data[key].liczbWydz,
        stpSfer: data[key].stpSfer,
        udzGraf: data[key].udzGraf,
        udzPerl: data[key].udzPerl,
        udzFerr: data[key].udzFerr,
      });
      setDatas(baseItems);
    }
  }

  // Listing all images and saving it to setImgUrls state
  const listImages = async () => {
    if (btnTableText) {
      setShowText("Pokaż wyniki");
    } else {
      setShowText("Ukryj wyniki");
    }
    setBtnTableText((prevState) => !prevState);
    await fetchData();
    setShowTable((prevState) => !prevState);
    if (!showTable) {
      await storage
        .ref()
        .child("images/")
        .listAll()
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
    } else {
      setImgUrls([]);
    }
  };
  const closeAlertHandler = (props) => {
    setAddShowAlert(false);
    setRemoveShowAlert(false);
  };

  return (
    <Layout className={classes.struktura}>
      <h1 className={classes.struktura__title}>
        Formularz dodania wyników - struktura
      </h1>
      <p>Wprowadź dane:</p>
      <Form>
        <Row className="align-items-center">
          <Col xs={12} sm={6} xl={3} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">Nr wytopu</Form.Label>
            <Form.Control
              ref={nrWytRef}
              id="inlineFormInputName"
              placeholder="Np. 2313"
              type="number"
              min="0"
            />
          </Col>
          <Col xs={12} sm={6} xl={3} className="mb-3">
            <Form.Label htmlFor="inlineFormInputGroupUsername">
              Rodzaj metalu
            </Form.Label>
            <FormControl
              ref={rodzMetRef}
              id="inlineFormInputGroupUsername"
              placeholder="Np. sfero, ADI, szare, SiMo itd."
            />
          </Col>
          <Col xs={12} sm={6} xl={3} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              Liczba wydzieleń grafitu [1/mm<sup>2</sup>]
            </Form.Label>
            <Form.Control
              ref={liczbWydzRef}
              id="inlineFormInputName"
              placeholder="Np. 2313"
              type="number"
              min="0"
            />
          </Col>
          <Col xs={12} sm={6} xl={3} className="mb-3">
            <Form.Label htmlFor="inlineFormInputGroupUsername">
              Stopień sferoidalności grafitu [%]
            </Form.Label>
            <FormControl
              ref={stpSferRef}
              id="inlineFormInputGroupUsername"
              placeholder="Sferoidalność"
              type="number"
              min="0"
              max="100"
            />
          </Col>
          <Col xs={12} sm={6} xl={3} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              Udział grafitu [%]
            </Form.Label>
            <Form.Control
              ref={udzGrafRef}
              id="inlineFormInputName"
              placeholder="Udział % grafitu w strukturze"
              type="number"
              min="0"
              max="100"
            />
          </Col>
          <Col xs={12} sm={6} xl={3} className="mb-3">
            <Form.Label htmlFor="inlineFormInputGroupUsername">
              Udział perlitu [%]
            </Form.Label>
            <FormControl
              ref={udzPerlRef}
              id="inlineFormInputGroupUsername"
              placeholder="Udział % perlitu w strukturze"
              type="number"
              min="0"
              max="100"
            />
          </Col>
          <Col xs={12} sm={6} xl={3} className="mb-3">
            <Form.Label htmlFor="inlineFormInputName">
              Udział ferrytu [%]
            </Form.Label>
            <Form.Control
              ref={udzFerrRef}
              id="inlineFormInputName"
              placeholder="Udział % ferrytu w strukturze"
              type="number"
              min="0"
              max="100"
            />
          </Col>
          <Col xs={12} sm={6} xl={3} className="mb-3">
            <Form.Label htmlFor="inlineFormInputGroupUsername">
              Zdjęcie struktury przed trawieniem
            </Form.Label>
            <FormControl
              id="inlineFormInputGroupUsername"
              ref={img1Ref}
              placeholder="Zdjęcie przed trawieniem"
              type="file"
              onChange={handleChange1}
            />
            <Form.Label htmlFor="inlineFormInputGroupUsername">
              Zdjęcie struktury po trawieniu
            </Form.Label>
            <FormControl
              id="inlineFormInputGroupUsername"
              ref={img2Ref}
              placeholder="Zdjęcie po trawieniu"
              type="file"
              onChange={handleChange2}
            />
            <progress value={progress} max="100" />
          </Col>
        </Row>
        <Button onClick={sendData} className={classes.submitBtn} type="submit">
          Dodaj wyniki
        </Button>
        {showAddAlert && (
          <Modal onClose={closeAlertHandler}>
            Wprowadzono wyniki do bazy danych!
          </Modal>
        )}
      </Form>

      <Button
        disabled={formIsValid}
        onClick={listImages}
        className={classes.showBtn}
        ref={showBtnRef}
      >
        {showText}
      </Button>
      {showTable && currentRecords.length > 0 && (
        <Table className={classes.dataTable} striped borderless variant="light">
          <thead className="tbHead text-center">
            <tr className="align-items-center">
              <th>Nr wytopu</th>
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
          <tbody className="text-center">
            {currentRecords.map((item, i) => {
              return (
                <tr key={i} className="align-items-center">
                  <td>{item.nrWyt}</td>
                  <td>{item.rodzMet}</td>
                  <td>{item.liczbWydz}</td>
                  <td>{item.stpSfer}</td>
                  <td>{item.udzGraf}</td>
                  <td>{item.udzPerl}</td>
                  <td>{item.udzFerr}</td>
                  <td className={classes.imgCont}>
                    {imgUrls.map((url, i) => {
                      if (url.includes(`${item.nrWyt}_1`)) {
                        return (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              key={i}
                              className={classes.zdj}
                              src={url}
                              alt=""
                            />
                            <div className={classes.middle}>
                              <div className={classes.text}>
                                Kliknij aby powiększyć
                              </div>
                            </div>
                          </a>
                        );
                      }
                    })}
                  </td>
                  <td className={classes.imgCont}>
                    {imgUrls.map((url, i) => {
                      if (url.includes(`${item.nrWyt}_2`)) {
                        return (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              key={i}
                              className={classes.zdj}
                              src={url}
                              alt=""
                            />
                            <div className={classes.middle}>
                              <div className={classes.text}>
                                Kliknij aby powiększyć
                              </div>
                            </div>
                          </a>
                        );
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

export default Struktura;
