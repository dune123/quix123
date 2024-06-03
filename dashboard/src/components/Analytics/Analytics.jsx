/*import React, { useEffect, useState } from "react";
import styles from "./Analytics.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuesAnalysis from "../QuesAnalysis/QuesAnalysis";
import DeleteComp from "../DeleteComp/DeleteComp";
import EditQuestion from "../EditQuiz/EditQuiz";

const Analytics = ({ setIsAnalytics }) => {
  const token = window.localStorage.getItem("token");
  const userId=window.localStorage.getItem("userId");
  const [quizes, setQuizes] = useState(null);
  const [selectedQues, setSelectedQues] = useState([]);
  const [quizName, setQuizName] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const [impressions,setImpressions] = useState(null)
  const [quizId,setQuizId]=useState(null);
  const [quesAnalysis,setQuesAnalysis]=useState(false);
  const [isDelete,setIsDelete]=useState(false);
  const [deleteQuiz,setDeleteQuiz]=useState(null);
  const [quizType,setQuizType]=useState(null); 
  const [iseditable,setIsEditable]=useState(false);
  const [editableQuiz,setEditableQuiz]=useState(null);
  const [editQuizType,setEditQuizType]=useState(null);

  const getAllQuiz = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/quiz/getallquiz/${userId}`,{headers: {
        'Authorization': `Bearer ${token}`
      }});
      setQuizes(res.data.getallquiz);
    } catch (err) {
      toast.error(err.message);
    }
  };

  //date format change
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    getAllQuiz();
  }, []);

  const CloseButton = ({ closeToast }) => (
    <i className="material-icons" onClick={closeToast}>
      X
    </i>
  );

  const handleQuesAnalysis=(index)=>{
      setSelectedQues(quizes[index].questions);
      setQuizName(quizes[index].name);
      setCreatedAt(formatDate(quizes[index].createdAt));
      setImpressions(quizes[index].impressions);
      setQuizId(quizes[index]._id);
      setQuizType(quizes[index].quizType);
      setQuesAnalysis(true);
  }

  const handleDelete=(index)=>{
      setIsDelete(true)
      setDeleteQuiz(quizes[index]._id)
  }

  const handleShare=(quizId)=>{
    const link=`http://localhost:5173/quiz/${quizId}`
    navigator.clipboard.writeText(link)
    toast.success("Link Copied on clipboard")
  }

  const handleEdit=(index)=>{
    setEditableQuiz(quizes[index]._id)
    setEditQuizType(quizes[index].quizType)
    setIsEditable(true);
  }
  return (
    <>
    {
    quesAnalysis ? (
      <QuesAnalysis
        selectedQues={selectedQues}
        quizName={quizName}
        createdAt={createdAt}
        impressions={impressions}
        quizId={quizId}
        quizType={quizType}
      />
    ) : (
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
        <h1>Quiz Analysis</h1>
        <div className={styles.quizContainer}>
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Quiz Name</th>
                <th>Created On</th>
                <th>Impression</th>
              </tr>
            </thead>
            <tbody>
              {quizes &&
                quizes.map((quiz, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "" : "#B3C4FF" }}>
                    <td>{index + 1}</td>
                    <td>{quiz.name}</td>
                    <td>{formatDate(quiz.createdAt)}</td>
                    <td>{quiz.impressions === 0 ? 0 : quiz.impressions}</td>
                    <td>
                      <img src="/edit.png" onClick={()=>handleEdit(index)}/>
                      <img src="/delete.png" onClick={()=>handleDelete(index)}/>
                      <img src="/share.png" onClick={()=>handleShare(quiz._id)}/>
                    </td>
                    <td>
                      <a onClick={() => handleQuesAnalysis(index)}>Analysis with questions</a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    )
}
      {
        isDelete&&<DeleteComp setIsDelete={setIsDelete} quizId={deleteQuiz}/>
      }
      {
        iseditable&&<EditQuestion setIsEditable={setIsEditable} editableQuiz={editableQuiz} editQuizType={editQuizType}/>
      }
    </>
  );
};

export default Analytics;*/
import React, { useEffect, useState } from "react";
import styles from "./Analytics.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuesAnalysis from "../QuesAnalysis/QuesAnalysis";
import DeleteComp from "../DeleteComp/DeleteComp";
import EditQuestion from "../EditQuiz/EditQuiz";

const Analytics = ({ setIsAnalytics }) => {
  const token = window.localStorage.getItem("token");
  const userId = window.localStorage.getItem("userId");
  const [quizes, setQuizes] = useState(null);
  const [selectedQues, setSelectedQues] = useState([]);
  const [quizName, setQuizName] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [impressions, setImpressions] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [quesAnalysis, setQuesAnalysis] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteQuiz, setDeleteQuiz] = useState(null);
  const [quizType, setQuizType] = useState(null); 
  const [isEditable, setIsEditable] = useState(false);
  const [editableQuiz, setEditableQuiz] = useState(null);
  const [editQuizType, setEditQuizType] = useState(null);

  const getAllQuiz = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/quiz/getallquiz/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setQuizes(res.data.getallquiz);
    } catch (err) {
      toast.error(err.message);
    }
  };

  //date format change
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    getAllQuiz();
  }, []);

  const CloseButton = ({ closeToast }) => (
    <i className="material-icons" onClick={closeToast}>
      X
    </i>
  );

  const handleQuesAnalysis = (index) => {
    setSelectedQues(quizes[index].questions);
    setQuizName(quizes[index].name);
    setCreatedAt(formatDate(quizes[index].createdAt));
    setImpressions(quizes[index].impressions);
    setQuizId(quizes[index]._id);
    setQuizType(quizes[index].quizType);
    setQuesAnalysis(true);
  }

  const handleDelete = (index) => {
    setIsDelete(true)
    setDeleteQuiz(quizes[index]._id)
  }

  const handleShare = (quizId) => {
    const link = `http://localhost:5173/quiz/${quizId}`
    navigator.clipboard.writeText(link)
    toast.success("Link Copied on clipboard")
  }

  const handleEdit = (index) => {
    setEditableQuiz(quizes[index]._id)
    setEditQuizType(quizes[index].quizType)
    setIsEditable(true);
  }

  return (
    <>
      {quesAnalysis ? (
        <QuesAnalysis
          selectedQues={selectedQues}
          quizName={quizName}
          createdAt={createdAt}
          impressions={impressions}
          quizId={quizId}
          quizType={quizType}
        />
      ) : (
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
          <h1>Quiz Analysis</h1>
          <div className={styles.quizContainer}>
            {quizes && quizes.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Quiz Name</th>
                    <th>Created On</th>
                    <th>Impression</th>
                  </tr>
                </thead>
                <tbody>
                  {quizes.map((quiz, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "" : "#B3C4FF" }}>
                      <td>{index + 1}</td>
                      <td>{quiz.name}</td>
                      <td>{formatDate(quiz.createdAt)}</td>
                      <td>{quiz.impressions === 0 ? 0 : quiz.impressions}</td>
                      <td>
                        <img src="/edit.png" onClick={() => handleEdit(index)} />
                        <img src="/delete.png" onClick={() => handleDelete(index)} />
                        <img src="/share.png" onClick={() => handleShare(quiz._id)} />
                      </td>
                      <td>
                        <a onClick={() => handleQuesAnalysis(index)}>Analysis with questions</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No quizzes created yet</p>
            )}
          </div>
        </div>
      )}
      {isDelete && <DeleteComp setIsDelete={setIsDelete} quizId={deleteQuiz} />}
      {isEditable && <EditQuestion setIsEditable={setIsEditable} editableQuiz={editableQuiz} editQuizType={editQuizType} />}
    </>
  );
};

export default Analytics;

