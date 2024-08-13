import { Link } from "react-router-dom";
import Header from "../Header/Header";
import Lottie from "lottie-react";
import launch from "../../../lottie/launch.json";
import { useAuth } from "../../../contexts/AuthContext";

const Home = () => {
  const {username, isAuthenticated, role} = useAuth();

  return (
    <>
    {!isAuthenticated && <Header isAuthenticated={isAuthenticated} role={role} username={username} />}
    <div className="row flex-fill justify-content-center text-center mx-5">
      <div className="col-md-8 welcome text-center">
        <h1 className="display-6 fw-bold">The Mind Check Trivia!</h1>
        <p className="lead">
          Test your knowledge and have fun
          with our exciting trivia questions.
        </p>
        <hr className="" />
        <p>Ready to start?</p>
        {isAuthenticated ? (
          <Link to="/trivia" className="btn btn-primary btn-block" role="button">
            Start
          </Link>
        ) : (
          <Link to="/first_try" className="btn btn-primary btn-block" role="button">
            Start
          </Link>
        )}

        <div className="row justify-content-center text-center">
          <Lottie loop={true} animationData={launch} style={{ width: 100, height: 100 }}/>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;
