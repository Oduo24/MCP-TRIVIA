import { useEffect } from 'react';
import { errorToast, getCookie } from '../../utility';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../models';
import { DotLoader } from 'react-spinners';

const FirstVisit = () => {
  const { fetchData, loading } = useFetch();
  const { setIsAuthenticated, setRole, setUsername, setScore } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkVisit = async () => {
      if (getCookie('visited')) {
        navigate('/login');
      } else {
        try {
          const tempUserEndpoint = "/api/reg_temp_user";
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

    user.role === "admin" ? navigate("/admin/home") : navigate("/trivia");
  };

  const handleLoginError = (error: Error) => {
    errorToast(error.message);
  };

  if (loading) {
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
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return null;
};

export default FirstVisit;
