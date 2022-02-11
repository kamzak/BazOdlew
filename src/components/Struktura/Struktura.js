import { useRef, useState } from "react";
import { Form, Button, Col, Row, FormControl, Table } from "react-bootstrap";
import { storage, database } from "../../firebase/firebase";
import { getDatabase, ref, set } from "firebase/database";

import Layout from "../Layout/Layout";
import classes from "./Struktura.module.css";

const Struktura = () => {
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [imgUrls, setImgUrls] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [datas, setDatas] = useState([]);

  const nrWytRef = useRef();
  const rodzMetRef = useRef();
  const liczbWydzRef = useRef();
  const stpSferRef = useRef();
  const udzGrafRef = useRef();
  const udzPerlRef = useRef();
  const udzFerrRef = useRef();
  const img1Ref = useRef();
  const img2Ref = useRef();

  const countIt = 0;

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
  const handleChange2 = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      if (e.target.files[0]) {
        const newImage = e.target.files[i];
        newImage["id"] = Math.random();
        setImages((prevState) => [...prevState, newImage]);
      }
    }
  };

  const sendData = async (event) => {
    event.preventDefault();
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
      .then(() => alert("Dane zostały wprowadzone do bazy danych!")).then(() => document.location.reload())
      .catch((err) => console.log(err));

      nrWytRef.current.value = '';
      rodzMetRef.current.value = '';
      liczbWydzRef.current.value = '';
      stpSferRef.current.value = '';
      udzGrafRef.current.value = '';
      udzPerlRef.current.value = '';
      udzFerrRef.current.value = '';
      img1Ref.current.value = null;
      img2Ref.current.value =  null;
  };

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

  const listImages = async () => {
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
            />
          </Col>
          <Col xs={12} sm={6} xl={3} className="mb-3">
            <Form.Label htmlFor="inlineFormInputGroupUsername">
              Stopień sferoidalności grafitu [%]
            </Form.Label>
            <FormControl
              ref={stpSferRef}
              id="inlineFormInputGroupUsername"
              placeholder="Np. sfero, ADI, szare, SiMo itd."
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
          </Col>
        </Row>
        <Button onClick={sendData} className={classes.submitBtn} type="submit">
          Dodaj wyniki
        </Button>
      </Form>
      <progress value={progress} max="100" />
      <Button onClick={listImages} className={classes.showBtn}>
        Pokaż wyniki
      </Button>
      {showTable && (
        <Table striped bordered variant="dark">
          <thead>
            <tr>
              <th>Nr wytopu</th>
              <th>Rodzaj metalu</th>
              <th>Liczba wydzieleń grafitu [1/mm2]</th>
              <th>Stopień sferoidalności grafitu [%]</th>
              <th>Udział grafitu [%]</th>
              <th>Udział perlitu [%]</th>
              <th>Udział ferrytu [%]</th>
              <th style={{ width: "12.5%" }}>Zdjęcia przed trawieniem</th>
              <th style={{ width: "12.5%" }}>Zdjęcie po trawieniu</th>
            </tr>
          </thead>
          <tbody>
            {datas.map((item, i) => {
              return (
                <tr key={i} className="align-items-center">
                  <td>{item.nrWyt}</td>
                  <td>{item.rodzMet}</td>
                  <td>{item.liczbWydz}</td>
                  <td>{item.stpSfer}</td>
                  <td>{item.udzGraf}</td>
                  <td>{item.udzPerl}</td>
                  <td>{item.udzFerr}</td>
                  <td>
                    {imgUrls.map((url, i) => {
                      if (url.includes(`${item.nrWyt}_1`) && countIt < 2) {
                        return (
                          <a key={i} href={url} target="_blank">
                            <img
                              key={i}
                              className={classes.zdj}
                              src={url}
                              alt=""
                            />
                          </a>
                        );
                      }
                    })}
                  </td>
                  <td>
                    {imgUrls.map((url, i) => {
                      if (url.includes(`${item.nrWyt}_2`) && countIt < 2) {
                        return (
                          <a key={i} href={url} target="_blank">
                            <img
                              key={i}
                              className={classes.zdj}
                              src={url}
                              alt=""
                            />
                          </a>
                        );
                      }
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Layout>
  );
};

export default Struktura;