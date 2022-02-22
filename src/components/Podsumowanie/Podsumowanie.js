import classes from "./Podsumowanie.module.css";
import React, { useRef, useState } from "react";
import { FormControl, Form, Button, Col, Row, Table } from "react-bootstrap";
import Layout from "../Layout/Layout";
import { storage, database } from "../../firebase/firebase";
import { ref, set, remove } from "firebase/database";

const Podsumowanie = () => {
  const [analizaData, setAnalizaData] = useState([]);
  const [strukturaData, setStrukturaData] = useState([]);
  const [wlmechData, setWlmechData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [imgUrls, setImgUrls] = useState([]);

  const szukajRef = useRef();

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

  const searchData = async (event) => {
    event.preventDefault();

    const responseAnaliza = await fetch(
      "https://bazodlew-default-rtdb.europe-west1.firebasedatabase.app/analiza.json"
    );
    const responseStruktura = await fetch(
      "https://bazodlew-default-rtdb.europe-west1.firebasedatabase.app/struktura.json"
    );
    const responseWlmech = await fetch(
      "https://bazodlew-default-rtdb.europe-west1.firebasedatabase.app/wlmech.json"
    );

    const dataAnaliza = await responseAnaliza.json();
    const dataStruktura = await responseStruktura.json();
    const dataWlmech = await responseWlmech.json();

    const analizaItems = [];
    const strukturaItems = [];
    const wlmechItems = [];
    for (const key in dataAnaliza) {
      if (dataAnaliza[key].nrWyt === szukajRef.current.value) {
        analizaItems.push({
          id: key,
          nrWyt: dataAnaliza[key].nrWyt,
          gatunek: dataAnaliza[key].gatunek,
          rodzMet: dataAnaliza[key].rodzMet,
          wegiel: dataAnaliza[key].wegiel,
          krzem: dataAnaliza[key].krzem,
          mangan: dataAnaliza[key].mangan,
          magnez: dataAnaliza[key].magnez,
          fosfor: dataAnaliza[key].fosfor,
          siarka: dataAnaliza[key].siarka,
          miedz: dataAnaliza[key].miedz,
          cer: dataAnaliza[key].cer,
          lantan: dataAnaliza[key].lantan,
          cyrkon: dataAnaliza[key].cyrkon,
          bizmut: dataAnaliza[key].bizmut,
          wapn: dataAnaliza[key].wapn,
        });
      }
    }
    for (const key in dataStruktura) {
      if (dataStruktura[key].nrWyt === szukajRef.current.value) {
        strukturaItems.push({
          id: key,
          nrWyt: dataStruktura[key].nrWyt,
          gatunek: dataStruktura[key].gatunek,
          rodzMet: dataStruktura[key].rodzMet,
          liczbWydz: dataStruktura[key].liczbWydz,
          stpSfer: dataStruktura[key].stpSfer,
          udzGraf: dataStruktura[key].udzGraf,
          udzPerl: dataStruktura[key].udzPerl,
          udzFerr: dataStruktura[key].udzFerr,
        });
      }
    }
    for (const key in dataWlmech) {
      if (dataWlmech[key].nrWyt === szukajRef.current.value) {
        wlmechItems.push({
          id: key,
          nrWyt: dataWlmech[key].nrWyt,
          gatunek: dataWlmech[key].gatunek,
          rodzMet: dataWlmech[key].rodzMet,
          rm: dataWlmech[key].rm,
          granica: dataWlmech[key].granica,
          wydluzenie: dataWlmech[key].wydluzenie,
          twardosc: dataWlmech[key].twardosc,
          udarnosc: dataWlmech[key].udarnosc,
          young: dataWlmech[key].young,
        });
      }
    }
    fetchImages();
    setAnalizaData(analizaItems);
    setStrukturaData(strukturaItems);
    setWlmechData(wlmechItems);
    setShowTable(true);
  };

  return (
    <Layout>
      <h1 className={classes.pods__title}>Podsumowanie wyników</h1>
      <Form>
        <Row>
          <Form.Label htmlFor="nrwytopu">Nr wytopu:</Form.Label>
          <Col xl={3}>
            <FormControl
              id="nrwytopu"
              type="text"
              placeholder="Wpisz nr wytopu..."
              ref={szukajRef}
            />
          </Col>
          <Col xl={2}>
            <Button onClick={searchData} className={classes.search}>
              Szukaj
            </Button>
          </Col>
        </Row>
      </Form>
      {showTable && (
        <React.Fragment>
          {analizaData.length > 0 && (
            <React.Fragment>
              <div className="table-responsive">
                <h1 className={classes.main__title}>Analiza chemiczna</h1>
                <Table
                  className={classes.dataTable}
                  className="mt-3"
                  striped
                  borderless
                  variant="light"
                >
                  <thead className="tbHead text-center">
                    <tr className="align-items-center">
                      <th style={{ width: "5%" }}>Nr wytopu</th>
                      <th style={{ width: "10%" }}>Gatunek</th>
                      <th style={{ width: "10%" }}>Rodzaj metalu</th>
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
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {analizaData.map((item, i) => {
                      if (item.nrWyt === szukajRef.current.value) {
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
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </Table>
              </div>
            </React.Fragment>
          )}
          {strukturaData.length > 0 && (
            <React.Fragment>
              <div className="table-responsive">
              <h1 className={classes.main__title}>Struktura</h1>
              <Table
                className={classes.dataTable}
                className="mt-3"
                striped
                borderless
                variant="light"
              >
                <thead className="tbHead text-center">
                  <tr className="align-items-center">
                    <th style={{ width: "5%" }}>Nr wytopu</th>
                    <th style={{ width: "10%" }}>Gatunek</th>
                    <th style={{ width: "10%" }}>Rodzaj metalu</th>
                    <th>
                      Liczba wydzieleń grafitu [1/mm<sup>2</sup>]
                    </th>
                    <th>Stopień sferoidalności grafitu [%]</th>
                    <th>Udział grafitu [%]</th>
                    <th>Udział perlitu [%]</th>
                    <th>Udział ferrytu [%]</th>
                    <th style={{ width: "12.5%" }}>Zdjęcie przed trawieniem</th>
                    <th style={{ width: "12.5%" }}>Zdjęcie po trawieniu</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {strukturaData.map((item, i) => {
                    if (item.nrWyt === szukajRef.current.value) {
                      return (
                        <tr key={i} className="align-items-center">
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
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </Table>
              </div>
            </React.Fragment>
          )}
          {wlmechData.length > 0 && (
            <React.Fragment>
              <div className="table-responsive">
              <h1 className={classes.main__title}>Właściwości mechaniczne</h1>
              <Table
                className={classes.dataTable}
                className="mt-3"
                striped
                borderless
                variant="light"
              >
                <thead className="tbHead text-center">
                  <tr className="align-items-center">
                    <th style={{ width: "5%" }}>Nr wytopu</th>
                    <th style={{ width: "10%" }}>Gatunek</th>
                    <th style={{ width: "10%" }}>Rodzaj metalu</th>
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
                  </tr>
                </thead>
                <tbody className="text-center">
                  {wlmechData.map((item, i) => {
                    if (item.nrWyt === szukajRef.current.value) {
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
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </Table>
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </Layout>
  );
};

export default Podsumowanie;
