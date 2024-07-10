import { useState, useEffect } from "react";
import { Question, Answers } from "../models";

function Trivia() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [score, setScore] = useState<number | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const questionsPerPage = 3;

  useEffect(() => {
    fetch("https://localhost:5000/api/questions", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setQuestions(data);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  const handleChange = (questionId: number, option: string) => {
    setAnswers({
      ...answers,
      [questionId]: option,
    });
  };

  const handleSubmit = () => {
    fetch("https://localhost:5000/api/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(answers),
    })
      .then((response) => response.json())
      .then((data) => {
        setScore(data.score);
        handleNext();
      })
      .catch((error) => console.error("Error calculating score:", error));
  };

  const handleNext = () => {
    if (startIndex + questionsPerPage < questions.length) {
      setStartIndex(startIndex + questionsPerPage);
      setAnswers({}); // Reset answers for the next set of questions
    } else {
      alert("No more questions!");
    }
  };

  return (
    <>
      <div className="container mt-2">
        <h1 className="mb-4">Trivia Game</h1>
        {questions
          .slice(startIndex, startIndex + questionsPerPage)
          .map((question) => (
            <div key={question.id} className="mb-3">
              <p>{question.question}</p>
              {question.options.map((option) => (
                <div key={option} className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name={String(question.id)}
                    value={option}
                    onChange={() => handleChange(question.id, option)}
                  />
                  <label className="form-check-label">{option}</label>
                </div>
              ))}
            </div>
          ))}
        <button className="btn btn-primary mb-3" onClick={handleSubmit}>
          Submit
        </button>
        {score !== null && (
          <p className="alert alert-success">Your score: {score}</p>
        )}
      </div>
    </>
  );
}

export default Trivia;
