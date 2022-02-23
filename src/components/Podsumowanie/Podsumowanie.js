import classes from "./Podsumowanie.module.css";
import React, { useRef, useState } from "react";
import { FormControl, Form, Button, Col, Row, Table, Container } from "react-bootstrap";
import Layout from "../Layout/Layout";
import { storage, database } from "../../firebase/firebase";
import html2pdf from "html2pdf.js";

const Podsumowanie = () => {
  const [analizaData, setAnalizaData] = useState([]);
  const [strukturaData, setStrukturaData] = useState([]);
  const [wlmechData, setWlmechData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [imgUrls, setImgUrls] = useState([]);

  const szukajRef = useRef();
  const podsumowanieRef = useRef();

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

  const generatePDF = () => {
    const print = podsumowanieRef.current;
    const opt = {
      margin: 0,
      filename: "Raport_" + szukajRef.current.value,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 1, dpi: 300, letterRendering: true, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };

    // New Promise-based usage:
    html2pdf().set(opt).from(print).save();
  };

  return (
    <Layout title="podsumowanie">
      <h1 className={classes.pods__title}>Podsumowanie wyników</h1>
      <Form>
        <Row>
          <Form.Label htmlFor="nrwytopu">Nr wytopu:</Form.Label>
          <Col xs={6} sm={4} xl={3}>
            <FormControl
              id="nrwytopu"
              type="text"
              placeholder="Wpisz nr wytopu..."
              ref={szukajRef}
            />
          </Col>
          <Col xs={6} sm={4} xl={2}>
            <Button onClick={searchData} className={classes.search}>
              Szukaj
            </Button>
          </Col>
          <Col className="offset-xl-4" sm={4} xl={3}>
            <Button onClick={generatePDF} className={classes.generate}>
              Generuj PDF
            </Button>
          </Col>
        </Row>
      </Form>
      {showTable && (
        <div ref={podsumowanieRef}>
          {analizaData.length > 0 && (
            <React.Fragment>
              <div className="table-responsive">
                <h1 className={classes.main__title}>Analiza chemiczna</h1>
                <Table
                  className="mt-3"
                  variant="light"
                >
                  <thead className="tbHead text-center">
                    <tr className="align-items-center">
                      <th style={{ width: "5%" }}>Nr wytopu</th>
                      <th style={{ width: "10%" }}>Gatunek</th>
                      <th style={{ width: "10%" }}>Rodzaj metalu</th>
                      <th style={{ width: "6.25%" }}>C</th>
                      <th style={{ width: "6.25%" }}>Si</th>
                      <th style={{ width: "6.25%" }}>Mn</th>
                      <th style={{ width: "6.25%" }}>Mg</th>
                      <th style={{ width: "6.25%" }}>P</th>
                      <th style={{ width: "6.25%" }}>S</th>
                      <th style={{ width: "6.25%" }}>Cu</th>
                      <th style={{ width: "6.25%" }}>Ce</th>
                      <th style={{ width: "6.25%" }}>La</th>
                      <th style={{ width: "6.25%" }}>Zr</th>
                      <th style={{ width: "6.25%" }}>Bi</th>
                      <th style={{ width: "6.25%" }}>Ca</th>
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
          {wlmechData.length > 0 && (
            <React.Fragment>
              <div className="table-responsive">
                <h1 className={classes.main__title}>Właściwości mechaniczne</h1>
                <Table
                  className="mt-3"
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
          {strukturaData.length > 0 && (
            <React.Fragment>
              <div className="table-responsive html2pdf__page-break">
                <h1 className={classes.main__title}>Struktura</h1>
                <Table
                  className="mt-3"
                  variant="light"
                >
                  <thead className="tbHead text-center">
                    <tr className="align-items-center">
                      <th style={{ width: "5%" }}>Nr wytopu</th>
                      <th style={{ width: "10%" }}>Gatunek</th>
                      <th style={{ width: "10%" }}>Rodzaj metalu</th>
                      <th>
                        Liczba wydzieleń grafitu [<i>1/mm<sup>2</sup></i>]
                      </th>
                      <th>Stopień sferoidalności grafitu [<i>%</i>]</th>
                      <th>Udział grafitu [<i>%</i>]</th>
                      <th>Udział perlitu [<i>%</i>]</th>
                      <th>Udział ferrytu [<i>%</i>]</th>
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
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </Table>
              </div>
            </React.Fragment>
          )}
          
          {strukturaData.length > 0 && <Container className={classes.podsTable}>
            <Row className="align-items-center">
              <Col xs={12} sm={12} xl={6} className={classes.firstCol}>
                <h2>Zdjęcie przed trawieniem</h2>
                {strukturaData.map((item, i) => {
                  if (item.nrWyt === szukajRef.current.value) {
                    return (
                      <div key={i} className={classes.imgCont}>
                        {imgUrls.map((url, i) => {
                          if (url.includes(`${item.nrWyt}_1`)) {
                            return (
                              <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: 'none'}}
                            >
                              <img
                                key={i}
                                className={classes.firstPhotoBig}
                                src={url}
                                alt=""
                              />
                              <div className={classes.middle}>
                                <div className={classes.text}>
                                  <span>Kliknij aby powiększyć</span>
                                </div>
                              </div>
                            </a>
                            );
                          }
                        })}
                      </div>
                    );
                  }
                })}
              </Col>
              <Col xs={12} sm={12} xl={6}>
                <h2>Zdjęcie po trawieniu</h2>
                {strukturaData.map((item, i) => {
                  if (item.nrWyt === szukajRef.current.value) {
                    return (
                      <div key={i} className={classes.imgCont}>
                        {imgUrls.map((url, i) => {
                          if (url.includes(`${item.nrWyt}_2`)) {
                            return (
                              <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: 'none'}}
                            >
                              <img
                                key={i}
                                className={classes.secondPhotoBig}
                                src={url}
                                alt=""
                              />
                              <div className={classes.middle}>
                                <div className={classes.text}>
                                  <span>Kliknij aby powiększyć</span>
                                </div>
                              </div>
                            </a>
                            );
                          }
                        })}
                      </div>
                    );
                  }
                })}
              </Col>
            </Row>
          </Container>}
        </div>
      )}
    </Layout>
  );
};

export default Podsumowanie;
