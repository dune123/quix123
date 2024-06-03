import React from "react";
import styles from "./DeleteComp.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteComp = ({ setIsDelete,quizId }) => {
  const token = localStorage.getItem("token");
  const deleteQuiz = async () => {
    axios.delete(`https://quizie.ishownow.uk/api/quiz/deleteQuiz/${quizId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res)=>{
        console.log(res);
        toast.success(res.data.message);
        setIsDelete(false)
    })
    .catch((err)=>{
        console.log(err);
        toast.error(err);
    })
  };
  const CloseButton = ({ closeToast }) => (
    <i className="material-icons" onClick={closeToast}>
      X
    </i>
  );
  return (
    <>
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
      <div className={styles.container}>
        <div className={styles.cardCont}>
          <div className={styles.top}>
            <h1>Are you confirm</h1>
            <h1>you want to delete ?</h1>
          </div>
          <div className={styles.buttons}>
            <button style={{ backgroundColor: "#FF4B4B", color: "white" }} onClick={deleteQuiz}>
              Confirm Delete
            </button>
            <button
              style={{
                backgroundColor: "white",
                color: "black",
                boxShadow:
                  "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
              }}
              onClick={() => setIsDelete(false)}
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteComp;
