import React, { useEffect, useState } from "react";
import styles from "./AddQuestion.module.css";
import { FiPlus } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShareQuiz from "../../../ShareQuiz/ShareQuiz";

const AddQuestion = ({ quiztype, quizName, setIsCreateQuiz, setShowMore }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const token = window.localStorage.getItem("token");
  const [showFinalCard, setShowFinalCard] = useState(false);
  const [quizId, setQuizId] = useState(null);

  useEffect(() => {
    const initialQuestion = {
      questionNumber: 0,
      question: "",
      options: [
        { id: 0, text: "", selected: false },
        { id: 1, text: "", selected: false },
      ],
      optionType: null,
      timer: null,
    };
    setQuestions([initialQuestion]);
  }, []);

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

  const addNewQuestion = () => {
    const newQuestion = {
      questionNumber: questions.length,
      question: "",
      options: [
        { id: 0, text: "", selected: false },
        { id: 1, text: "", selected: false },
      ],
      optionType: null,
      timer: null,
    };
    setQuestions([...questions, newQuestion]);
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

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
      setSelectedQuestion(0); // Optionally reset to the first question
    }
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

  const timerSelect = (time, questionIndex, timerId) => {
    setQuestions(
      questions.map((q, index) =>
        index === questionIndex
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
      const element = document.getElementById(`${btn}-${questionIndex}`);
      if (element) {
        element.style.backgroundColor = "";
        element.style.color = "";
      }
    });

    // Set selected button style
    const selectedElement = document.getElementById(timerId);
    if (selectedElement) {
      selectedElement.style.backgroundColor = "#D60000";
      selectedElement.style.color = "black";
    }
  };

  const addQuiz = async () => {
    if (questions.some((q) => q.optionType === null)) {
      toast.error("Please fill the OptionType for all questions.");
      return;
    }
    if (questions.some((q) => q.options.some((o) => o.text.trim() === ""))) {
      toast.error("Please fill all options for each question.");
      return;
    }
    await axios
      .post(
        "http://localhost:3000/api/quiz/addQuiz",
        {
          name: quizName,
          questions,
          quizType: quiztype,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        //toast.success(res.data.message);
        setQuizId(res.data.quizId);
        setShowFinalCard(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  const CloseButton = ({ closeToast }) => (
    <i className="material-icons" onClick={closeToast}>
      X
    </i>
  );
   
  return (
    <>
    {showFinalCard?
      (<ShareQuiz setShowFinalCard={setShowFinalCard} quizId={quizId}/>):
        (<div className={styles.superContainer}>
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
                {index > 0 && (
                  <IoIosClose
                    className={styles.closeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeQuestion(index);
                    }}
                  />
                )}
              </div>
            ))}
            {questions.length < 5 && (
              <FiPlus className={styles.plus} onClick={addNewQuestion} />
            )}
          </div>
          <p>Max 5 questions</p>
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
                className={` ${styles.option} ${
      option.selected ? styles.selected : ""
    }`}
                key={index}
              >
                <input
                  type="radio"
                  name="quiz-option"
                  id={`radio-${option.id}`}
                  className={`${styles.radio} ${option.selected ? styles.selected : ""}`}
                  checked={option.selected}
                  onChange={() => handleOptionsChange(option.id)}
                  key={index}
                />
                <label htmlFor={`radio-${option.id}`} className={styles.label}>
                  <input
                    type="text"
                    placeholder="Text"
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
                    <>
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={option.imageUrl}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[selectedQuestion].options[
                            index
                          ].imageUrl = e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                        className={styles.optionImageUrl}
                        id={`option-image-url-${index}`}
                      />
                      <label htmlFor={`option-image-url-${index}`}>
                        Image URL
                      </label>
                    </>
                  )}
                </label>
                {index > 1 && (
                  <MdDelete
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
          <div className={styles.timer}>
            <p>Timer</p>
            <button
              onClick={() =>
                timerSelect("off", selectedQuestion, `off-${selectedQuestion}`)
              }
              id={`off-${selectedQuestion}`}
            >
              OFF
            </button>
            <button
              onClick={() =>
                timerSelect(5, selectedQuestion, `sec5-${selectedQuestion}`)
              }
              id={`sec5-${selectedQuestion}`}
            >
              5 sec
            </button>
            <button
              onClick={() =>
                timerSelect(10, selectedQuestion, `sec10-${selectedQuestion}`)
              }
              id={`sec10-${selectedQuestion}`}
            >
              10 sec
            </button>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.cancel} onClick={() => setShowMore(false)}>
            Cancel
          </button>
          <button className={styles.createQuiz} onClick={addQuiz}>
            Create Quiz
          </button>
        </div>
      </div></div>)}
      </>
  );
};

export default AddQuestion;
