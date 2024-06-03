import React, { useEffect, useState } from 'react'
import styles from "./Dashboard.module.css"
import DashBoardComp from '../../components/DashBoardComponents/DashBoardComp';
import CreateQuiz from '../../components/CreateQuiz/CreateQuiz';
import ShareQuiz from "../../components/ShareQuiz/ShareQuiz"
import Analytics from '../../components/Analytics/Analytics';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [isDashboard,setIsDashboard] =useState(true);
    const [isAnalytics,setIsAnalytics] =useState(false);
    const [isCreateQuiz,setIsCreateQuiz] =useState(false);
    const username=localStorage.getItem('username');
    const token=localStorage.getItem('token');
    const navigate=useNavigate();

    const handleSelectCategory = (name) => {
    // Reset all states to false, then set the selected one to true
    setIsDashboard(name === 'Dashboard');
    setIsAnalytics(name === 'Analytics');
    setIsCreateQuiz(name === 'CreateQuiz');

    // Update selected element's style (optional)
    const categories = ['Dashboard', 'Analytics', 'CreateQuiz'];
    categories.forEach(category => {
      const element = document.getElementById(category);
      if (element) {
        if (category === name) {
          element.style.boxShadow = "0px 4px 4px rgba(0, 0, 0, 0.25)";
        } else {
          element.style.boxShadow = "none";
        }
      }
    });
  };

  const Logout=async()=>{
    await axios.post("https://quizie.ishownow.uk/api/auth/logout",{
      username
    },{headers: {
      'Authorization': `Bearer ${token}`
    }})
    .then((res)=>{
      navigate("/")
      window.localStorage.setItem("username",res.data.user)
      window.localStorage.setItem("token",res.data.token)
    })
    .catch((err)=>{
      console.log(err);
      toast.error(err)
    })
  }
  const CloseButton = ({ closeToast }) => (
    <i
      className="material-icons"
      onClick={closeToast}
    >
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
        <div className={styles.leftContainer}>
            <h1>QUIZZIES</h1>
            <ul>
                <li id="Dashboard" onClick={()=>handleSelectCategory("Dashboard")}>Dashboard</li>
                <li id="Analytics" onClick={()=>handleSelectCategory("Analytics")}>Analytics</li>
                <li id="CreateQuiz" onClick={()=>handleSelectCategory("CreateQuiz")}>Create Quiz</li>
            </ul>
            <div className={styles.logout}>
            <hr/>
            <p onClick={Logout}>LOGOUT</p>
            </div>
        </div>
        <div className={styles.rightContainer}>
          {
            isDashboard&&<DashBoardComp/>
          }
          {
          isAnalytics&&<Analytics setIsAnalytics={setIsAnalytics}/>
         }
        </div>
    </div>
    {
          isCreateQuiz&&<CreateQuiz setIsCreateQuiz={setIsCreateQuiz}/>
            
    }
    </>
  )
}

export default Dashboard