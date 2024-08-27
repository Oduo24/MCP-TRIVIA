import { useEffect } from 'react';
import { errorToast, getCookie } from '../../utility';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../models';
import Loader from './Loader';

const FirstVisit = () => {
  const { fetchData, loading } = useFetch();
  const { setIsAuthenticated, setRole, setUsername, setScore, setAnsweredQuestions, setAnsweredEpisodes } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkVisit = async () => {
      if (getCookie('visited')) {
        navigate('/login');
      } else {
        try {
          const tempUserEndpoint = "https://192.168.88.148:5000/api/reg_temp_user";
          const result = await fetchData({
            method: "GET",
            endpoint: tempUserEndpoint,
          });
          handleLoginSuccess(result);
        } catch (error) {
          handleLoginError(error as Error);
        }
      }
    };

    checkVisit();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setIsAuthenticated(true);
    setRole(user.role);
    setUsername(user.username);
    setScore(user.score);
    if (user.answered_questions.length !== 0) {
      setAnsweredQuestions(user.answered_questions);
    }
    // Since answered_episodes variable is optional, check first if it's available
    if (user.answered_episodes) {
      if (user.answered_episodes.length !== 0) {
        setAnsweredEpisodes(user.answered_episodes);
      }
    }

    user.role === "admin" ? navigate("/admin/home") : navigate("/user/start");
  };

  const handleLoginError = (error: Error) => {
    errorToast(error.message);
  };

  if (loading) {
    return (
      <Loader isLoading={true} />
    );
  } else {
    
  }

  return null;
};

export default FirstVisit;
