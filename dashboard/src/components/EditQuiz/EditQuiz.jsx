import React, { useEffect, useState } from "react";
import styles from "./AddQuestion.module.css";
import { FiPlus } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditQuestion = ({ editableQuiz, setIsEditable,editQuizType }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [showFinalCard, setShowFinalCard] = useState(false);
  const token = window.localStorage.getItem("token");

  const handleOptionsChange = (id) => {
    setQuestions(
      questions.map((q, index) =>
        index === selectedQuestion
          ? {
              ...q,
              options: q.options.map((option) =>
                option.id === id
                  ? { ...option, selected: true }
                  : { ...option, selected: false }
              ),
            }
          : q
      )
    );
  };

  const deleteOption = (id) => {
    setQuestions(
      questions.map((q, index) =>
        index === selectedQuestion
          ? {
              ...q,
              options: q.options.filter((option) => option.id !== id),
            }
          : q
      )
    );
  };

  const addOption = () => {
    setQuestions(
      questions.map((q, index) =>
        index === selectedQuestion && q.options.length < 4
          ? {
              ...q,
              options: [
                ...q.options,
                { id: q.options.length, text: "", selected: false },
              ],
            }
          : q
      )
    );
  };

  const onClickStory = (index) => {
    const selectedQuestionElement = document.getElementById(index);
    if (selectedQuestionElement) {
      selectedQuestionElement.style.backgroundColor = "lightgreen";
      selectedQuestionElement.style.color = "#9F9F9F";
    }

    const previousSelectedQuestionElement =
      document.getElementById(selectedQuestion);
    if (previousSelectedQuestionElement) {
      previousSelectedQuestionElement.style.backgroundColor = "";
      previousSelectedQuestionElement.style.color = "";
    }

    setSelectedQuestion(index);
  };

  const onOptionChange = (e) => {
    setQuestions(
      questions.map((q, index) =>
        index === selectedQuestion
          ? {
              ...q,
              optionType: e.target.value,
            }
          : q
      )
    );
  };

  const timerSelect = (time, id) => {
    setQuestions(
      questions.map((q, index) =>
        index === selectedQuestion
          ? {
              ...q,
              timer: time === "off" ? 0 : time,
            }
          : q
      )
    );

    // Reset all buttons' styles first
    const timerButtons = ["off", "sec5", "sec10"];
    timerButtons.forEach((btn) => {
      const element = document.getElementById(btn);
      if (element) {
        element.style.backgroundColor = "";
        element.style.color = "";
      }
    });

    // Set selected button style
    const selectedElement = document.getElementById(id);
    if (selectedElement) {
      selectedElement.style.backgroundColor = "#D60000";
      selectedElement.style.color = "black";
    }
  };

 
  const getQuiz = async () => {
    await axios
      .get(`http://localhost:3000/api/quiz/getallquizbyquizId/${editableQuiz}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        }
      })
      .then((res) => {
        setQuestions(res.data.question);
        console.log(res.data.question)
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    getQuiz();
  }, []);

  const handleEditQuiz = async () => {
    if (questions.some((q) => q.optionType === null)) {
      toast.error("Please fill the OptionType for all questions.");
      return;
    }
    if (questions.some((q) => q.options.some((o) => o.text.trim() === ""))) {
      toast.error("Please fill all options for each question.");
      return;
    }
    await axios.put(
      `http://localhost:3000/api/quiz/editQuiz/${editableQuiz}`,
      {
        questions,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    ).then((res)=>{
        toast.success(res.data.message);
        setIsEditable(false);
    })
    .catch((err)=>{
        toast.error(err.error);
    })
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
        <div className={styles.questions}>
          <div className={styles.questionAdd}>
            {questions.map((data, index) => (
              <div
                className={styles.quesContainer}
                key={index}
                onClick={() => onClickStory(index)}
                id={index}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.typeContainer}>
          {questions.length > 0 ? (
            <input
              type="text"
              value={questions[selectedQuestion]?.question || ""}
              onChange={(e) => {
                const updatedQuestions = [...questions];
                updatedQuestions[selectedQuestion].question = e.target.value;
                setQuestions(updatedQuestions);
              }}
            />
          ) : (
            <input type="text" value="" disabled />
          )}
        </div>
        <div className={styles.optionType}>
          <p>Option Type</p>
          <div className={styles.text}>
            <input
              type="radio"
              name="topping"
              value="Text"
              id="Text"
              checked={questions[selectedQuestion]?.optionType === "Text"}
              onChange={onOptionChange}
            />
            <label htmlFor="Text">Text</label>
          </div>
          <div className={styles.imageUrl}>
            <input
              type="radio"
              name="topping"
              value="imageUrl"
              id="imageUrl"
              checked={questions[selectedQuestion]?.optionType === "imageUrl"}
              onChange={onOptionChange}
            />
            <label htmlFor="imageUrl">Image URL</label>
          </div>
          <div className={styles.textandimageUrl}>
          <input
              type="radio"
              name="topping"
              value="text&imageurl"
              id="textandimageurl"
              checked={
                questions[selectedQuestion]?.optionType === "text&imageurl"
              }
              onChange={onOptionChange}
            />
            <label htmlFor="textandimageurl">Text & Image URL</label>
          </div>
        </div>
        <div className={styles.answerOptions}>
          <div className={styles.totalOptions}>
            {questions[selectedQuestion]?.options.map((option, index) => (
              <div
                className={`${styles.option} ${
                  option.selected ? styles.selected : ""
                }`}
                key={index}
              >
                <input
                  type="radio"
                  name="quiz-option"
                  id={`radio-${option.id}`}
                  className={`${styles.radio} ${
                    option.selected ? styles.selected : ""
                  }`}
                  checked={option.selected}
                  onChange={() => handleOptionsChange(option.id)}
                  key={index}
                />
                <label htmlFor={`radio-${option.id}`} className={styles.label}>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => {
                      const updatedOptions = questions[
                        selectedQuestion
                      ].options.map((opt) =>
                        opt.id === option.id
                          ? {
                              ...opt,
                              text: e.target.value,
                              selected: opt.selected,
                            }
                          : opt
                      );
                      setQuestions(
                        questions.map((q, qIndex) =>
                          qIndex === selectedQuestion
                            ? { ...q, options: updatedOptions }
                            : q
                        )
                      );
                    }}
                    className={styles.optionText}
                    key={index}
                  />
                  {questions[selectedQuestion]?.optionType ===
                    "text&imageurl" && (
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={option.imageurl}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[selectedQuestion].options[
                          index
                        ].imageUrl = e.target.value;
                        setQuestions(updatedQuestions);
                      }}
                      style={{
                        marginLeft: "2vw",
                        width: "16vw",
                        height: "5vh",
                        border: "none",
                        boxShadow:
                          "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
                        borderRadius: "0.5rem",
                        color: "#9F9F9F",
                        paddingLeft: "0.8vh",
                        fontSize: "1.2rem",
                      }}
                    />
                  )}
                </label>
                {index > 1 && (
                  <img
                    src="/delete.png"
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteOption(option.id);
                    }}
                  />
                )}
              </div>
            ))}
            <button className={styles.addOptions} onClick={addOption}>
              Add Options
            </button>
          </div>
          {editQuizType==="q&a"?<div className={styles.timer}>
            <p>Timer</p>
            <button
              onClick={() => timerSelect("off", "off")}
              id="off"
              style={{
                backgroundColor: `${
                  questions[selectedQuestion]?.timer === 0 ? "red" : "white"
                }`,
                color: `${
                  questions[selectedQuestion]?.timer === 0 ? "white" : "#9F9F9F"
                }`,
              }}
            >
              OFF
            </button>
            <button
              onClick={() => timerSelect(5, "sec5")}
              id="sec5"
              style={{
                backgroundColor: `${
                  questions[selectedQuestion]?.timer === 5 ? "red" : "white"
                }`,
                color: `${
                  questions[selectedQuestion]?.timer === 5 ? "white" : "#9F9F9F"
                }`,
              }}
            >
              5 sec
            </button>
            <button
              onClick={() => timerSelect(10, "sec10")}
              id="sec10"
              style={{
                backgroundColor: `${
                  questions[selectedQuestion]?.timer === 10 ? "red" : "white"
                }`,
                color: `${
                  questions[selectedQuestion]?.timer === 10
                    ? "white"
                    : "#9F9F9F"
                }`,
              }}
            >
              10 sec
            </button>
          </div>:null}
        </div>
        <div className={styles.buttonContainer}>
          <button
            className={styles.cancel}
            onClick={() => setIsEditable(false)}
          >
            Cancel
          </button>
          <button className={styles.createQuiz} onClick={handleEditQuiz}>
            Edit Quiz
          </button>
        </div>
      </div>
      {showFinalCard && (
        <ShareQuiz setShowFinalCard={setShowFinalCard} quizId={quizId} />
      )}
    </div>
  );
};

export default EditQuestion;
