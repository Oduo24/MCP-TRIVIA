import { Link } from "react-router-dom";
import "./home.css";
import Header from "../Header/Header";

const Home = () => {
  return (
    <>
      {/* Welcome Section */}
      <div className="container-fluid text-center full-page-container text-white">
        <div className="row justify-content-center align-items-center full-page-row">
          <div className="col-md-6 welcome">
            <h1 className="display-6 fw-bold">The Mind Check Trivia!</h1>
            <p className="lead">
              Test your knowledge and have fun
              with our exciting trivia questions.
            </p>
            <hr className="my-4" />
            <p>Ready to start?</p>
            <Link to="/trivia" className="btn btn-primary btn-block" role="button">
              Start
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
