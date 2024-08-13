import { useState, useEffect } from "react";
import { Question, Answers } from "../../../models";
import useFetch from "../../../hooks/useFetch";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DotLoader } from "react-spinners";
import Lottie from "lottie-react";
import celebrate from "../../../lottie/celebrate.json";
import poor from "../../../lottie/poor.json";


const Trivia = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const {score, setScore, username} = useAuth();
  const [startIndex, setStartIndex] = useState(0);
  const questionsPerPage = 3;
  const { fetchData: fetchQuestions, loading: loadingQuestions } = useFetch();
  const { fetchData: submitData, loading: loadingSubmit } = useFetch();
  const navigate = useNavigate();
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [poorScore, setPoorScore] = useState(false);


  const questionsEndpoint = "/api/questions";
  const scoreEndpoint = "/api/score";

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
      // Check if the score is 3/3 and set the celebration animation
      if (data.score - score === 3) {
        setIsCelebrating(true);
      }
      // Check if the score is 0/3 and set poor score animation
      else if(data.score - score === 0) {
        setPoorScore(true);
      } else {
        handleCelebrationComplete();
      }
      // Update overall score
      setScore(data.score);
      
    } catch (error) {
      handleSubmitError(error as Error);
    }
  };


  const handleCelebrationComplete = () => {
    // Stop celebration or poor score animation depending on which called the function
    if (isCelebrating) setIsCelebrating(false);
    if (poorScore) setPoorScore(false);

    if (startIndex + questionsPerPage < questions.length) {
      setStartIndex(startIndex + questionsPerPage);
      setAnswers({}); // Reset answers for the next set of questions
    } else {
      navigate('/scores');
      alert("No more questions!");
    }
  };

  if (loadingQuestions) {
    return (
      <div
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
        }}
    >
      <DotLoader
        color="#fff240"
        loading={loadingQuestions}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
    );
  }

  return (
    <div className="row justify-content-center position-relative">
      {isCelebrating && (
        <div className="celebration-overlay">
          <div className="col-md-4 text-center">
            <Lottie 
              loop={false} 
              onComplete={handleCelebrationComplete} 
              animationData={celebrate} 
              style={{ width: 400, height: 400 }} 
            />
          </div>
        </div>
      )}
  
      {poorScore && (
        <div className="poor-score-overlay">
          <div className="col-md-4 text-center">
            <Lottie 
              loop={false} 
              onComplete={handleCelebrationComplete} 
              animationData={poor} 
              style={{ width: 400, height: 400 }} 
            />
          </div>
        </div>
      )}
  
      <form onSubmit={handleSubmit}>
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
                          required
                        />
                        <label className="card-text form-check-label">{option}</label>
                      </div>
                    ))}
                  </div>
                  <div className="card-footer">
                    {question.episode_number} {question.episode_name}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="justify-content-center text-center">
          <button
            type="submit"
            className="btn btn-primary mb-3"
            disabled={loadingSubmit}
          >
            {loadingSubmit ? "Calculating score..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default Trivia;
