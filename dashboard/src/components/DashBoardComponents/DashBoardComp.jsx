import React, { useEffect, useState } from 'react'
import styles from "./DashBoardComp.module.css"
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEye } from "react-icons/ai";

const DashBoardComp = () => {
  const token = window.localStorage.getItem("token");
  const userId=window.localStorage.getItem("userId");
  const [quizCreated,setQuizCreated]=useState(0);
  const [totalQues,setTotalQues]=useState(0);
  const [totalImpressions,setTotalImpressions]=useState(0);
  const [quiz,setQuiz]=useState([])


  //date format change
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };


  const getQuizInfo=async()=>{
    await axios.get(`http://localhost:3000/api/auth/getquizinfo/${userId}`,{headers: {
      'Authorization': `Bearer ${token}`
    }})
    .then((res)=>{
      setQuizCreated(res.data.quizCount)
      setTotalQues(res.data.totalQ)
      setTotalImpressions(res.data.totalImpression)
      setQuiz(res.data.userQuizzes)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    getQuizInfo()
  },[])
  console.log(quiz)
  return (
    <>
    <div className={styles.container}>
        <div className={styles.quizInfo}>
            <div className={styles.created}>
              <h1>{quizCreated} created</h1>
              <h1>Quiz</h1>
            </div>
            <div className={styles.createdQues}>
            <h1>{totalQues} Question</h1>
              <h1>created</h1>
            </div>
            <div className={styles.impressions}>
            <h1>{totalImpressions} Total</h1>
              <h1>Impression</h1>
            </div>
        </div>
        <div className={styles.bottomContainer}>
            <h1>Trending Quizes</h1>
            <div className={styles.totalQuiz}>
              {
                quiz.map((data,index)=>(
                  <div className={styles.eachQuiz} key={index}>
                    <div className={styles.upper}>
                        <h2>{data.name}</h2>
                        <div className={styles.otherside}>
                            <p>{data.impressions}</p>
                            <img src="/eyes.png" className={styles.eye}/>
                        </div>
                    </div>
                    <div className={styles.lower}>
                      <p>created on:{formatDate(data.createdAt)}</p>
                    </div>
                  </div>
                ))
              }
            </div>
        </div>
    </div>
    </>
  )
}

export default DashBoardComp