import React, { useEffect, useState } from "react";
import styles from "./AddPoll.module.css";
import { FiPlus } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShareQuiz from "../../../ShareQuiz/ShareQuiz";

const AddPoll = ({ quiztype, quizName, setIsCreateQuiz, setShowMore }) => {
  console.log("Poll Type");
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

  const addQuiz = async () => {
    if (questions.some((q) => q.optionType === null)) {
      toast.error("Please fill the OptionType for all questions.");
      return;
    }
    if (questions.some((q) => q.options.some((o) => o.text.trim() === ""))) {
      toast.error("Please fill all options for each question.");
      return;
    }
    axios.defaults.headers.common["Authorization"] = `${token}`;
    await axios
      .post(
        "https://quizie.ishownow.uk/api/quiz/addQuiz",
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
        toast.success(res.data.message);
        setQuizId(res.data.quizId);
        setShowFinalCard(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  const CloseButton = ({ closeToast }) => (
    <i className="material-icons" onClick={closeToast}>
      X
    </i>
  );
  return (
    <>
    {
      showFinalCard?(
        <ShareQuiz setShowFinalCard={setShowFinalCard} quizId={quizId}/>
      ):(
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
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.cancel} onClick={() => setShowMore(false)}>
            Cancel
          </button>
          <button className={styles.createQuiz} onClick={addQuiz}>
            Create Quiz
          </button>
        </div>
      </div>
      </div>
      )
    }
   </> 
  )
};

export default AddPoll;
