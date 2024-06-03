import React, { useEffect, useState } from 'react';
import styles from "./ShowQuiz.module.css";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowQuiz = () => {
  const { quizId } = useParams();
  const [question, setQuestion] = useState([]);
  const [selectedques, setSelectedques] = useState(0);
  const [answer, setAnswer] = useState([]);
  const [selectedopt, setSelectedopt] = useState(null);
  const [score, setScore] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [timer, setTimer] = useState(null);
  const [quizType, setQuizType] = useState(null);

  const getQuizByQuizId = async () => {
    try {
      const res = await axios.get(`https://quizie.ishownow.uk/api/quiz/getQuiz/${quizId}`);
      setQuestion(res.data.question);
      setQuizType(res.data.quizType);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  const handleNextClick = () => {
    if (selectedques < question.length - 1) {
      setSelectedques(selectedques + 1);
      if(question[selectedques+1]?.timer===0){
          setTimer("off");   
      }
      setTimer(question[selectedques + 1]?.timer);
      if (selectedopt === null) {
        const updateAns = [...answer];
        updateAns[selectedques] = null;
        setAnswer(updateAns);
      }
    }
  };
  
  useEffect(() => {
    let countdown;
    if(selectedques===question.length-1){
        if(timer===0){
          handleNextClick();
        }
    }
    else if (timer !== null && timer !== "off") {
      countdown = setInterval(() => {
        if (timer > 0) {
          setTimer(timer - 1);
        } else if (timer === 0) {
          if (selectedques < question.length - 1) {
            setSelectedques(selectedques + 1);
            setTimer(question[selectedques + 1]?.timer);
            if (selectedopt === null) {
              const updateAns = [...answer];
              updateAns[selectedques] = null;
              setAnswer(updateAns);
            }
          } else {
            // Timer ran out on the last question
            handleCheckAnswer();
            clearInterval(countdown);
          }
        }
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer, selectedques, question]);


  useEffect(() => {
    setSelectedopt(null);
    const options = document.getElementsByClassName(styles.opty);
    for (let i = 0; i < options.length; i++) {
      options[i].style.border = "none";
    }
  }, [selectedques]);

  useEffect(() => {
    getQuizByQuizId();
  }, [quizId]);

  if (question.length === 0) {
    return <div>Loading...</div>;
  }

  const handleCheckAnswer = async () => {
    try {
      const res = await axios.post(`https://quizie.ishownow.uk/api/quiz/quizScore/${quizId}`, { answer });
      setScore(res.data.score);
      setShowScore(true);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const selectOption = (index) => {
    const options = document.getElementsByClassName(styles.opty);
    for (let i = 0; i < options.length; i++) {
      options[i].style.border = "none";
    }
    options[index].style.border = "1px solid #5076FF";

    setSelectedopt(index);

    const updateAns = [...answer];
    updateAns[selectedques] = index;
    setAnswer(updateAns);
  };

  console.log(answer)
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
      />
      {!showScore ? (
        <div className={styles.card}>
          <div className={styles.top}>
            <h1>0{question[selectedques].questionNumber}/0{question.length}</h1>
            {timer !== null && timer !== "off" && timer!=0 && <h1 style={{ color: "#D60000" }}>{timer}s</h1>}
          </div>
          <div className={styles.bottom}>
            <h1 className={styles.question}>{question[selectedques].question}</h1>
            <div className={styles.options}>
              {question[selectedques].options.map((option, index) => (
                <div className={styles.opty} key={index} onClick={() => selectOption(index)} id={index}>
                  {question[selectedques].optionType === "Text" && <p style={{color:"black"}}>{option.text}</p>}
                  {question[selectedques].optionType === "imageUrl" && <img src={option.text} alt={`Option ${index}`} />}
                  {question[selectedques].optionType === "text&imageurl" && (
                    <div className={styles.opty4}>
                      <p>{option.text}</p>
                      <img src={option.imageurl} alt={`Option ${index}`}/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.buttons}>
            {selectedques < question.length - 1 && <button onClick={handleNextClick}>Next</button>}
            {selectedques === question.length - 1 && <button onClick={handleCheckAnswer}>Submit</button>}
          </div>
        </div>
      ) : (
        quizType==="q&a"?(<div className={styles.card}>
          <h2 style={{ marginTop: "5vh", fontSize: "1.5rem", fontWeight: "500", color: "black" }}>
            Congrats Quiz is Completed
          </h2>
          <img src="/trophy.png" alt="Trophy" />
          <h2 style={{ fontSize: "1.5rem", fontWeight: "500", color: "black" }}>Your Score is {score}</h2>
        </div>):(
          <div className={styles.cardForPoll}>
            <h1 style={{ marginTop: "5vh", fontSize: "2.9rem", fontWeight: "600", color: "black",display:"flex",alignItems:"center",justifyContent:"center" }}>Thanks for participating in the poll</h1>
          </div>
        )
      )}
    </div>
  );
};

export default ShowQuiz;