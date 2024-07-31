import { useState, useEffect } from "react";
import { Question, Answers } from "../../../models";
import useFetch from "../../../hooks/useFetch";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./trivia.css";

const Trivia = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const {score, setScore, username} = useAuth();
  const [startIndex, setStartIndex] = useState(0);
  const questionsPerPage = 3;
  const { fetchData: fetchQuestions, loading: loadingQuestions } = useFetch();
  const { fetchData: submitData, loading: loadingSubmit } = useFetch();
  const navigate = useNavigate();

  const questionsEndpoint = "https://192.168.88.148:5000/api/questions";
  const scoreEndpoint = "https://192.168.88.148:5000/api/score";

  const handleLoadQuestionsError = (error: Error) => {
    alert(error.message);
  };

  const handleSubmitError = (error: Error) => {
    alert(error.message);
  };

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestions({
          method: "GET",
          endpoint: questionsEndpoint,
        });
        setQuestions(data);
      } catch (error) {
        handleLoadQuestionsError(error as Error);
      }
    };
    loadQuestions();
  }, []);

  const handleChange = (questionId: number, option: string) => {
    setAnswers({
      ...answers,
      [questionId]: option,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await submitData({
        method: "POST",
        endpoint: scoreEndpoint,
        body: answers,
      });
      setScore(data.score);
      handleNext();
    } catch (error) {
      handleSubmitError(error as Error);
    }
  };

  const handleNext = () => {
    if (startIndex + questionsPerPage < questions.length) {
      setStartIndex(startIndex + questionsPerPage);
      setAnswers({}); // Reset answers for the next set of questions
    } else {
      alert("No more questions!");
      navigate('/scores');
    }
  };

  return (
    <div className="container-fluid trivia-container">
      <div className="row justify-content-center">
        <div className="col-md-8 justify-content-center">
          <h1 className="my-2 text-white trivia-title">Trivia</h1>
          <div>
            {score !== null && (
              <h4 className="text-white">{username}: {score}</h4>
            )}
          </div>
          {questions
            .slice(startIndex, startIndex + questionsPerPage)
            .map((question) => (
              <div className="card mb-3 justify-content-center" key={question.id}>
                <div className="card-body">
                  <p className="card-title">{question.question}</p>
                  {question.options.map((option) => (
                    <div key={option} className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name={String(question.id)}
                        value={option}
                        onChange={() => handleChange(question.id, option)}
                      />
                      <label className="card-text form-check-label">{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="justify-content-center text-center">
        <button
          className="btn btn-primary mb-3"
          onClick={handleSubmit}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "Calculating score..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Trivia;
