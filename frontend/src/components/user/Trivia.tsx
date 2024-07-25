import { useState, useEffect } from "react";
import { Question, Answers } from "../../models";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../contexts/AuthContext";

const Trivia = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const {score, setScore} = useAuth();
  const [startIndex, setStartIndex] = useState(0);
  const questionsPerPage = 3;
  const { fetchData: fetchQuestions, loading: loadingQuestions } = useFetch();
  const { fetchData: submitData, loading: loadingSubmit } = useFetch();

  const questionsEndpoint = "https://localhost:5000/api/questions";
  const scoreEndpoint = "https://localhost:5000/api/score";

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
    }
  };

  return (
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
      <button
        className="btn btn-primary mb-3"
        onClick={handleSubmit}
        disabled={loadingSubmit}
      >
        {loadingSubmit ? "Calculating score..." : "Submit"}
      </button>
      {score !== null && (
        <p className="alert alert-success">Your score: {score}</p>
      )}
    </div>
  );
};

export default Trivia;
