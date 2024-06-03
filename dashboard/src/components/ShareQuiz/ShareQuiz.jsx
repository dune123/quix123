import React from 'react'
import styles from "./ShareQuiz.module.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShareQuiz = ({setShowFinalCard,quizId}) => {

  const handleShare=()=>{
    const protocol = window.location.protocol;
    const host = window.location.host;
    const link=`${protocol}//${host}/quiz/${quizId}`
    navigator.clipboard.writeText(link)
    toast.success("Link Copied on clipboard")
  }
  const CloseButton = ({ closeToast }) => (
    <i className="material-icons" onClick={closeToast}>
      X
    </i>
  );

  return (
    <div className={styles.container}>
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
        <div className={styles.cardCont}>
            <p onClick={()=>setShowFinalCard(false)}>X</p>
            <div className={styles.cardContent}>
            <h1>Congrats your Quiz is</h1>
            <h1>Published!</h1>
            <div>Copy the link of quiz</div>
            <button onClick={handleShare}>Share</button>
            </div>
        </div>
    </div>
  )
}

export default ShareQuiz