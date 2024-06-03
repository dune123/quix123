import React, { useState } from "react";
import styles from "./Home.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [signup, setSignup] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleSignUp = async () => {
    try {
      await axios
        .post(`http://localhost:3000/api/auth/register`, signupForm)
        .then((res) => {
          toast.success(res.data.message);
        })
        .catch((err) => {
          console.log(err.response.data);
          setError(err.response.data.message);
          setErrorType(err.response.data.errorType);
          if(errorType==="emptyField"){
            toast.error(error)
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const CloseButton = ({ closeToast }) => (
    <i className="material-icons" onClick={closeToast}>
      X
    </i>
  );

  const handleLogin = async () => {
    try {
      await axios
        .post(`http://localhost:3000/api/auth/login`, loginForm)
        .then((res) => {
          console.log(res);
          navigate("/dashboard");
          window.localStorage.setItem("userId", res.data.userId);
          window.localStorage.setItem("username", res.data.username);
          window.localStorage.setItem("token", res.data.token);
        })
        .catch((err) => {
          console.log(err.response.data.message);
          toast.error(err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.supercontainer}>
      <div className={styles.container}>
        <h1>QUIZZIE</h1>
        <div className={styles.buttons}>
          <button
            style={{
              boxShadow: signup
                ? "0px 0px 50px rgba(0, 25, 255, 0.24)"
                : "none",
            }}
            onClick={() => setSignup(true)}
          >
            Sign-up
          </button>
          <button
            style={{
              boxShadow: !signup
                ? "0px 0px 50px rgba(0, 25, 255, 0.24)"
                : "none",
            }}
            onClick={() => setSignup(false)}
          >
            Log In
          </button>
        </div>
        {signup && (
          <div className={styles.SignupContainer}>
            <form>
              <div className={styles.NameCont}>
                <label>Name</label>
                <input
                  type="text"
                  value={errorType!=="username"?signupForm.username:error}
                  onChange={(e) => {
                    setSignupForm((prev) => {
                      return { ...prev, username: e.target.value };
                    });
                  }}
                  style={{
                    border: error ? "1px solid red" : null,
                    color: error ? "red" : null,
                  }}
                />
              </div>
              <div className={styles.EmailCont}>
                <label>Email</label>
                <input
                  type="text"
                  value={errorType!=="email"?signupForm.email:error}
                  onChange={(e) => {
                    setSignupForm((prev) => {
                      return { ...prev, email: e.target.value };
                    });
                  }}
                  style={{
                    border: error ? "1px solid red" : null,
                    color: error ? "red" : null,
                  }}
                />
              </div>
              <div className={styles.PasswordCont}>
                <label>Password</label>
                <input
                  type={error? "text" : "password"}
                  value={errorType!=="password"?signupForm.password:error}
                  onChange={(e) => {
                    setSignupForm((prev) => {
                      return { ...prev, password: e.target.value };
                    });
                  }}
                  style={{
                    border: error ? "1px solid red" : null,
                    color: error ? "red" : null,
                  }}
                />
              </div>
              <div className={styles.ConfirmPasswordCont}>
                <label>Confirm Password</label>
                <input
                  type={error? "text" : "password"}
                  value={errorType!=="confirmpassword"?signupForm.confirmpassword:error}
                  onChange={(e) => {
                    setSignupForm((prev) => {
                      return { ...prev, confirmpassword: e.target.value };
                    });
                  }}
                  style={{
                    border: error ? "1px solid red" : null,
                    color: error ? "red" : null,
                  }}
                />
              </div>
            </form>
            <button onClick={handleSignUp}>Sign-Up</button>
            <ToastContainer
              style={{ height: "7vh", width: "30vw" }}
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              closeButton={CloseButton}
            />
          </div>
        )}
        {!signup && (
          <div className={styles.SignupContainer}>
            <form>
              <div className={styles.NameCont}>
                <label>email</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => {
                    setLoginForm((prev) => {
                      return { ...prev, username: e.target.value };
                    });
                  }}
                  styles={{
                    border: error ? "1px solid red" : null,
                    color: error ? "red" : null,
                  }}
                />
              </div>
              <div className={styles.EmailCont}>
                <label>password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => {
                    setLoginForm((prev) => {
                      return {
                        ...prev,
                        password: e.target.value,
                      };
                    });
                  }}
                  styles={{
                    border: error ? "1px solid red" : null,
                    color: error ? "red" : null,
                  }}
                />
              </div>
            </form>
            <button onClick={handleLogin}>Log In</button>
            <ToastContainer
              style={{ height: "7vh", width: "30vw" }}
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              closeButton={CloseButton}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
