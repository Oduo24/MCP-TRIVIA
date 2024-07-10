import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          MCP
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Leaderboard
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Welcome Section */}
      <div className="jumbotron text-center">
        <h1 className="display-4">Welcome to the Trivia Game!</h1>
        <p className="lead">
          Test your knowledge and challenge yourself with our exciting trivia
          questions.
        </p>
        <hr className="my-4" />
        <p>Are you ready to start the quiz?</p>
        <Link to="/trivia" className="btn btn-primary btn-lg" role="button">
          Start Quiz
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center py-4">
        <p>&copy; 2024 Trivia Game. All Rights Reserved.</p>
      </footer>
    </>
  );
};

export default Home;
