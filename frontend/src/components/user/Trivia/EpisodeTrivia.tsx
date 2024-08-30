import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Answers, Question, TriviaResponseData } from '../../../models';
import useFetch from '../../../hooks/useFetch';
import { errorToast, successToast } from '../../../utility';
import toast from 'react-hot-toast';
import Loader from '../../common/Loader';
import Lottie from 'lottie-react';
import celebrate from "../../../lottie/celebrate.json";
import poor from "../../../lottie/poor.json";
import NoQuestions from '../NoQuestions/NoQuestions';
import EndOfTrivia from '../EndOfTrivia/EndOfTrivia';

interface EpisodeTriviaProps {
  episodeID: string;
}

const EpisodeTrivia: React.FC<EpisodeTriviaProps> = ({episodeID}) => {
  // const params = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [unansweredQuestions, setUnansweredQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const { score, setScore, username, setAnsweredQuestions, answeredQuestions, setAnsweredEpisodes } = useAuth();
  const [startIndex, setStartIndex] = useState(0);
  const questionsPerPage = 3;
  const { fetchData: fetchQuestions, loading: loadingQuestions } = useFetch();
  const { fetchData: submitData, loading: loadingSubmit } = useFetch();
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [poorScore, setPoorScore] = useState(false);
  const [readyToRender, setReadyToRender] = useState(false);
  const [episodeScore, setEpisodeScore] = useState(0);
  const [endOfQuestions, setEndOfQuestions] = useState(false);

  const handleLoadQuestionsError = (error: Error) => {
    errorToast('Error getting questions');
    console.error(error);
  };

  const handleSubmitError = (error: Error) => {
    errorToast('Error submitting answers');
    console.error(error);
  };

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const questionsEndpoint = "/api/questions";
        const data = await fetchQuestions({
          method: "POST",
          endpoint: questionsEndpoint,
          body: {episodeId: episodeID}
        });
        setQuestions(data);
      } catch (error) {
        handleLoadQuestionsError(error as Error);
      }
    };
    loadQuestions();
  }, [episodeID]);

  useEffect(() => {
    if (questions.length === 0) return;

    if (answeredQuestions.length === 0) {
      setUnansweredQuestions(questions);
    } else {
      const userUnansweredQuestions = questions.filter((question: Question) =>
        !answeredQuestions.includes(question.id)
      );
      setUnansweredQuestions(userUnansweredQuestions);
    }

    // Indicate that everything is ready to render
    setReadyToRender(true);
  }, [questions]);

  const handleChange = (questionId: string, option: string) => {
    setAnswers({
      ...answers,
      [questionId]: option,
    });
  };

  const notify = (message: string, icon: string) => {
    toast(message, { icon: icon });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const scoreEndpoint = "/api/score";
      const data: TriviaResponseData = await submitData({
        method: "POST",
        endpoint: scoreEndpoint,
        body: answers,
      });
      // Set answered questions
      setAnsweredQuestions(data.answered_question_ids);

      // Set answeredEpisode if it was the last set of questions
      if (data.episode_id && data.episode_score) {
        setAnsweredEpisodes(data.episode_id);
        setEpisodeScore(data.episode_score);
      }

      if (data.score - score === 3) {
        setIsCelebrating(true);
        const message = '3/3, you really are a chequemate';
        const icon = '🥳';
        notify(message, icon);
      } else if (data.score - score === 0) {
        setPoorScore(true);
        const message = '0/3';
        const icon = '😞';
        notify(message, icon);
      } else {
        handleCelebrationComplete();
      }
      setScore(data.score);

    } catch (error) {
      handleSubmitError(error as Error);
    }
  };

  const handleCelebrationComplete = () => {
    if (isCelebrating) setIsCelebrating(false);
    if (poorScore) setPoorScore(false);

    if (startIndex + questionsPerPage < unansweredQuestions.length) {
      setStartIndex(startIndex + questionsPerPage);
      setAnswers({}); // Reset answers for the next set of questions
    } else {
      successToast('No more questions available');
      setEndOfQuestions(true);
    }
  };

  if (loadingQuestions || !readyToRender) {
    return <Loader isLoading={true} />;
  }


  if(endOfQuestions) {
    return (
      <div className="row justify-content-center">
        <div className="col-md-8 justify-content-center">
        <EndOfTrivia
            episodeId={episodeID}
            episodeScore={episodeScore}
            totalQuestions={questions.length}
          />
        </div>
      </div>
    )
  }

  return (
    <>
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
              {score !== null && (
                <div>
                  <h4 className="text-white">{username}: {score}</h4>
                </div>
              )}
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
          {unansweredQuestions.length > 0 && (
            <div className="justify-content-center text-center">
              <button
                type="submit"
                className="btn btn-primary mb-3"
                disabled={loadingSubmit}
              >
                {loadingSubmit ? "Calculating score..." : "Submit"}
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
  
};

export default EpisodeTrivia;
