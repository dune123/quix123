import React, { useEffect, useState } from 'react'
import styles from "./QuesAnalysis.module.css"
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuesAnalysis = ({selectedQues,quizName,createdAt,impressions,quizId,quizType}) => {
    const [totalQues,setTotalQues] = useState([])
    const token=localStorage.getItem('token')
 
    const handleEachQuestion=async()=>{
        await axios.get(`http://localhost:3000/api/quiz/getallquizbyquizId/${quizId}`,{headers: {
      'Authorization': `Bearer ${token}`
       }})
        .then((res)=>{
            setTotalQues(res.data.question)
        })
        .catch((err)=>{
            console.log(err)
            toast.error(err.error)
        })
    }

    useEffect(()=>{
       handleEachQuestion();
       if (quizName) {
        setTotalQues(totalQues.filter(quiz => quiz.name === quizName));
       }
    },[])

    console.log(totalQues)
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
        <div className={styles.topCont}>
            <h1>{quizName} question Analysis</h1>
            <div className={styles.rightCont}>
                <p>created on: {createdAt}</p>
                <p>impressions:{impressions}</p>
            </div>
        </div>
        {quizType==="q&a"?(<div className={styles.bottomCont}>
            {
                totalQues.map((data,index)=>(
                    <div className={styles.eachQuestion}>
                        <h2>Q.{index+1} {data.question}</h2>
                        <div className={styles.optionCont}>
                            <div className={styles.eachOption}>
                            <h1>{data.impressions?data.impressions:"0"}</h1>
                            <p>people Attempted the question</p>
                            </div>
                            <div className={styles.eachOption}>
                            <h1>{data.correctAttempts?data.correctAttempts:"0"}</h1>
                            <p>people Answered Correctly</p>
                            </div>
                            <div className={styles.eachOption}>
                            <h1>{data.impressions&&data.correctAttempts?data.impressions-data.correctAttempts:"0"}</h1>
                            <p>people Answered InCorrectly</p>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>):(<div className={styles.bottomCont}>
            {
                totalQues.map((data,index)=>(
                    <div className={styles.eachQuestion}>
                        <h2>Q.{index+1} {data.question}</h2>
                        <div className={styles.optionCont}>
                        {
                            data.chosenOption.map((chosenOpt,index)=>(
                                <div className={styles.eachOptionForPoll} key={index}>
                            <h1>{chosenOpt?chosenOpt:0}</h1>
                            <p>Option {index}</p>
                            </div>
                            ))
                        }
                        </div>
                    </div>
                ))
            }
        </div>)}
        
    </div>
  )
}

export default QuesAnalysis