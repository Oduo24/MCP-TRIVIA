import React from "react";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
  return (
    <div className="bg-light">
      <header className="py-5 bg-primary text-white text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Welcome to Trivia Game!</h1>
          <p className="lead">
            Test your knowledge with our exciting trivia questions.
          </p>
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Link to="/signup" className="btn btn-outline-light btn-lg">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg">
              Log In
            </Link>
          </div>
        </div>
      </header>

      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6 my-3">
              <h2 className="fw-bold">Challenge Yourself</h2>
              <p className="lead">
                Answer trivia questions across various categories and difficulty
                levels.
              </p>
            </div>
            <div className="col-md-6 my-3">
              <img
                src="/images/trivia.jpg"
                alt="Trivia"
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-dark text-white">
        <div className="container">
          <div className="text-center">
            <h2 className="fw-bold">Compete with Friends</h2>
            <p className="lead">
              Challenge your friends, earn points, and climb the leaderboard.
            </p>
            <Link
              to="/leaderboard"
              className="btn btn-outline-light btn-lg mt-3"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-4 bg-secondary text-center">
        <div className="container">
          <p className="text-white mb-0">
            © 2024 Trivia Game. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
