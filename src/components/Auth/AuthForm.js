import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import Layout from "../Layout/Layout";

import classes from "./AuthForm.module.css";

let SECRET_CODE = '';

const AuthForm = () => {
  const history = useNavigate();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const codeInputRef = useRef();
  

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async() => {
    const response = await fetch('https://bazodlew-default-rtdb.europe-west1.firebasedatabase.app/code.json');
    const code = await response.json();
    SECRET_CODE = code.secCode;
  }, []);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    

    // Validation
    setIsLoading(true);
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC0_wLEm0kTPqpecoGo0nIxW-rpV-Xt_xU";
      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          setIsLoading(false);
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then((data) => {
              let errorMessage = "Authentication failed!";
              if (data && data.error && data.error.message) {
                errorMessage = data.error.message;
              }
              throw new Error(errorMessage);
            });
          }
        })
        .then((data) => {
          const expirationTime = new Date(
            new Date().getTime() + +data.expiresIn * 1000
          );
          authCtx.login(data.idToken, expirationTime.toISOString());
          history("/");
        })
        .catch((err) => {
          alert(err.message);
        });
    } else {
      let secretCode = codeInputRef.current.value;
      if(secretCode == SECRET_CODE) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC0_wLEm0kTPqpecoGo0nIxW-rpV-Xt_xU";
      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          setIsLoading(false);
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then((data) => {
              let errorMessage = "Authentication failed!";
              if (data && data.error && data.error.message) {
                errorMessage = data.error.message;
              }
              throw new Error(errorMessage);
            });
          }
        })
        .then((data) => {
          const expirationTime = new Date(
            new Date().getTime() + +data.expiresIn * 1000
          );
          authCtx.login(data.idToken, expirationTime.toISOString());
          history("/");
        })
        .catch((err) => {
          alert(err.message);
        });
      } else {
        setIsLoading(false);
        alert("Niepoprawny kod autoryzacyjny");
        return;
      }
    }
    setIsLoading(false);
  };

  return (
    <Layout title="login">
      <section className={classes.auth}>
        <h2>{isLogin ? "Zaloguj si??" : "Zarejestruj si??"}</h2>
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor="email">Email</label>
            <input value="admin@admin.com" type="email" id="email" required ref={emailInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Has??o</label>
            <input
              type="password"
              id="password"
              required
              ref={passwordInputRef}
              value="adminadmin"
            />
          </div>
          {!isLogin && (
            <div className={classes.control}>
              <label htmlFor="code">Kod autoryzacyjny</label>
              <input type="number" id="code" required ref={codeInputRef} />
            </div>
          )}
          <div className={classes.actions}>
            {!isLoading && (
              <button>{isLogin ? "Zaloguj si??" : "Stw??rz nowe konto"}</button>
            )}
            {isLoading && (
              <div className={classes.skypeLoader}>
                <div className={classes.dot}>
                  <div className={classes.first}></div>
                </div>
                <div className={classes.dot}></div>
                <div className={classes.dot}></div>
                <div className={classes.dot}></div>
              </div>
            )}
            <button
              type="button"
              className={classes.toggle}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? "Stw??rz nowe konto" : "Zaloguj si??"}
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default AuthForm;
