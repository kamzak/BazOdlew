import Layout from "./Layout/Layout";
import { useCallback, useState } from "react";
import { storage } from "../firebase/firebase";

const Home = () => {
  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);
  const [progress, setProgress] = useState(0);
  const [wytop, setWytop] = useState();
  const [data, setData] = useState([]);
  const [imgUrls, setImgUrls] = useState([]);

  function handleChange(e) {
    for (let i = 0; i < e.target.files.length; i++) {
      if (e.target.files[0]) {
        const newImage = e.target.files[i];
        newImage["id"] = Math.random();
        setImages((prevState) => [...prevState, newImage]);
      }
    }
  }
  function wytopHandler(e) {
    setWytop(e.target.value);
  }
  function handleUpload(e) {
    const promises = [];
    images.map((image) => {
      const uploadTask = storage.ref(`/images/${image.name}`).put(image);
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
        },
        async () => {
          await storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((urls) => {
              setUrls((prevState) => [...prevState, urls]);
            });
        }
      );
    });

    Promise.all(promises)
      .then(() => alert("All images uploaded"))
      .catch((err) => console.log(err));
  }

  console.log("image: ", images);
  console.log("urls", urls);

  const listItem = async () => {
    await storage
      .ref()
      .child("images/")
      .listAll()
      .then((res) => {
        res.items.forEach((item) => {
          setData((arr) => [...arr, item.name]);
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  const listImages = async () => {
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
  };


  return (
    <Layout title='home'>
      <div>
        <h1>Załaduj zdjęcie</h1>
        <progress value={progress} max="100" />
        <br />
        <label htmlFor="wytop">Wytop:</label>
        <input type="text" name="wytop" onChange={wytopHandler} />
        {<span>{wytop}</span>}
        <br />
        <label htmlFor="imgUpload1">Zdjęcie 1 i 2:</label>
        <input type="file" multiple name="imgUpload1" onChange={handleChange} />
        <br />
        <button onClick={handleUpload}>upload to firebase</button>
        <br />
        {urls.map((url, i) => (
          <div key={i}>{url}</div>
        ))}
        <br />
        {urls.map((url, i) => (
          <a href={url} target="_blank">
            <img style={{ width: "500px" }} key={i} src={url} alt="" />
          </a>
        ))}
        <button onClick={listItem}>List Item</button>
        {data.map((val) => (
          <h2>{val}</h2>
        ))}
        <button onClick={listImages}>List Images</button>
        <br/>
        {imgUrls.map((val) => (
          <img style={{height: '200px', display: 'inline'}} src={val} alt="" />
        ))}
      </div>
    </Layout>
  );
};
export default Home;
