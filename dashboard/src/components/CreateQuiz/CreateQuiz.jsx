import React, { useState } from "react";
import styles from "./CreateQuiz.module.css";
import AddQuestion from "./subComponent/AddQuestion/AddQuestion";
import AddPoll from "./subComponent/AddPoll/AddPoll";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateQuiz = ({ setIsCreateQuiz }) => {
  const [quiztype, setQuiztype] = useState(null);
  const [quizName, setQuizName] = useState(null);

  const [showMore, setShowMore] = useState(false);

  const handleContinue = () => {
    if(quizName===null){
        toast.error("write a quiz name")
        return;
    }
    if (quiztype === null) {
      toast.error("Please select the quiz type first");
      return;
    }
    setShowMore(true);
  };

  const handleType = (id) => {
    setQuiztype(id);
    document.getElementById("q&a").style.backgroundColor = "";
    document.getElementById("q&a").style.color = "";
    document.getElementById("poll").style.backgroundColor = "";
    document.getElementById("poll").style.color = "";
    const selectedbutton = document.getElementById(id);
    selectedbutton.style.backgroundColor = "#60B84B";
    selectedbutton.style.color = "white";
  };
  const CloseButton = ({ closeToast }) => (
    <i className="material-icons" onClick={closeToast}>
      X
    </i>
  );
  return (
    <div className={styles.superContainer}>
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
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Quiz name"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
          />
        </div>
        <div className={styles.quizContainer}>
          <p>Quiz Type</p>
          <button id="q&a" onClick={() => handleType("q&a")}>
            Q&A
          </button>
          <button id="poll" onClick={() => handleType("poll")}>
            Poll Type
          </button>
        </div>
        <div className={styles.buttonContainer}>
          <button
            className={styles.cancel}
            onClick={() => setIsCreateQuiz(false)}
          >
            Cancel
          </button>
          <button className={styles.continue} onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
      {showMore &&
        (quiztype === "poll" ? (
          <AddPoll 
            quiztype={quiztype}
            quizName={quizName}
            setIsCreateQuiz={setIsCreateQuiz}
            setShowMore={setShowMore}
          />
        ) : (
          <AddQuestion
            quiztype={quiztype}
            quizName={quizName}
            setIsCreateQuiz={setIsCreateQuiz}
            setShowMore={setShowMore}
          />
        ))}
    </div>
  );
};

export default CreateQuiz;
