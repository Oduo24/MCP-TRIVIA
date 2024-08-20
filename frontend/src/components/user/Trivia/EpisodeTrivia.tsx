import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext';
import { Answers, Question } from '../../../models';
import useFetch from '../../../hooks/useFetch';
import { errorToast, successToast } from '../../../utility';
import toast from 'react-hot-toast';
import Loader from '../../common/Loader';
import Lottie from 'lottie-react';
import celebrate from "../../../lottie/celebrate.json";
import poor from "../../../lottie/poor.json";
import NoQuestions from '../NoQuestions/NoQuestions';

const EpisodeTrivia: React.FC = () => {
    const params = useParams(); // Gets the params passed (episodeId and episodeNumber)
    const [questions, setQuestions] = useState<Question[]>([]);
    const [unansweredQuestions, setUnansweredQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Answers>({});
    const {score, setScore, username, setAnsweredQuestions, answeredQuestions} = useAuth();
    const [startIndex, setStartIndex] = useState(0);
    const questionsPerPage = 3;
    const { fetchData: fetchQuestions, loading: loadingQuestions } = useFetch();
    const { fetchData: submitData, loading: loadingSubmit } = useFetch();
    const navigate = useNavigate();
    const [isCelebrating, setIsCelebrating] = useState(false);
    const [poorScore, setPoorScore] = useState(false);

    const handleLoadQuestionsError = (error: Error) => {
        errorToast('Error getting scores');
        console.error(error);
      };
    
    const handleSubmitError = (error: Error) => {
      errorToast('Error getting scores');
      console.error(error);
    };
    
    useEffect(()=> {
      const loadQuestions = async () => {
        try {
          const questionsEndpoint = "https://192.168.88.148:5000/api/questions";
          const data = await fetchQuestions({
            method: "POST",
            endpoint: questionsEndpoint,
            body: params
          });
          setQuestions(data);
        } catch (error) {
          handleLoadQuestionsError(error as Error);
        }
      };
      loadQuestions();
    }, [params.episodeId])

    // Whenever the state of questions change this runs to set only questions that are unanswered
    useEffect(() => {
      if (answeredQuestions.length === 0) {
        setUnansweredQuestions(questions);
      } else {
        const userUnansweredQuestions = questions.filter((question: Question) => 
          !answeredQuestions.includes(question.id)
        );
        setUnansweredQuestions(userUnansweredQuestions);
      }
    }, [questions, answeredQuestions])
    

    
    const handleChange = (questionId: string, option: string) => {
      setAnswers({
        ...answers,
        [questionId]: option,
      });
    };
    
    const notify = (message: string, icon: string) => {
      toast(message, {icon: icon});
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const scoreEndpoint = "https://192.168.88.148:5000/api/score";
        const data = await submitData({
          method: "POST",
          endpoint: scoreEndpoint,
          body: answers,
        });
        // Update answeredQuestions for the user
        setAnsweredQuestions(data.answered_question_ids);

        // Check if the score is 3/3 and set the celebration animation
        if (data.score - score === 3) {
          setIsCelebrating(true);
          // Send a toast
          const message = '3/3, you really are a chequemate';
          const icon = '🥳';
          notify(message, icon);
        }
        // Check if the score is 0/3 and set poor score animation
        else if(data.score - score === 0) {
          setPoorScore(true);
          // Send a toast
          const message = '0/3';
          const icon = '😞';
          notify(message, icon);
        } else {
          // Send a toast
          const userscore = data.score - score;
          const message = `${userscore}`;
          const icon = '😐';
          notify(message, icon);
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
  
      if (startIndex + questionsPerPage < unansweredQuestions.length) {
        setStartIndex(startIndex + questionsPerPage);
        setAnswers({}); // Reset answers for the next set of questions
      } else {
        navigate('/scores');
        successToast('No more questions available');
      }
    };
    


    if (loadingQuestions) {
      return (
        <Loader isLoading={true}/>
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
              <h1 className="my-2 text-white page-title">Trivia</h1>
              <div>
                {score !== null && (
                  <h4 className="text-white">{username}: {score}</h4>
                )}
              </div>
              {unansweredQuestions.length > 0 ? (
              unansweredQuestions
                .slice(startIndex, startIndex + questionsPerPage)
                .map((question: Question) => (
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
                ))
            ) : (
              <NoQuestions />
            )}
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
    
}

export default EpisodeTrivia