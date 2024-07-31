import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { Episode, QuestionCategory, QuestionChoice, Score, Success } from "../../models";
import "./admindashboard.css";
import {
  Button,
  Modal,
  Form,
} from "react-bootstrap";


const AdminDashboard = () => {
  const [showEpisodeModal, setShowEpisodeModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [featuredGuest, setFeaturedGuest] = useState("");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState("");
  const [question, setQuestion] = useState("");
  const [topScorers, setTopScorers] = useState<Score[]>([]);
  const {fetchData: fetchTopPlayers, loading: fetchingTopPlayers} = useFetch();

  // Initial state for choices
  const initialChoices: QuestionChoice[] = [
    { choiceText: '', isCorrect: false },
    { choiceText: '', isCorrect: false },
    { choiceText: '', isCorrect: false },
    { choiceText: '', isCorrect: false },
  ];
  const [choices, setChoices] = useState<QuestionChoice[]>(initialChoices);
  const { fetchData: fetchEpisodes, loading: loadingQuestions } = useFetch();
  const { fetchData: submitNewEpisode, loading: addingNewEpisode } = useFetch();
  const { fetchData: submitNewQuestion, loading: addingNewQuestion } =
    useFetch();
  const { fetchData: fetchCategories, loading: loadingCategories } = useFetch();
  const [reloadEpisodes, setReloadEpisodes] = useState(false);


  const handleLoadEpisodesError = (error: Error) => {
    console.error(error.message);
    // alert(error.message);
  };

  const  handleLoadCategoriesError = (error: Error) => {
    console.error(error.message);
    // alert(error.message);
  }

  const handleNewEpisodeCreationError = (error: Error) => {
    console.error(error);
    alert(error.message);
  }

  const handleNewEpisodeCreationSuccess = (data: Success) => {
    alert(data.status);
  }

  const handleNewQuestionCreationSuccess = (data: Success) => {
    alert(data.status);
  }

  const handleNewQuestionCreationError = (error: Error) => {
    console.error(error);
    alert(error.message);
  }

  // fetch episodes
  const loadEpisodes = async () => {
    try {
      const episodesEndpoint = "https://192.168.88.148:5000/api/episodes";
      const data = await fetchEpisodes({
        method: "GET",
        endpoint: episodesEndpoint,
      });
      console.log('Fetched episodes:', data); // Check if it's an array
      setEpisodes(data);
    } catch (error) {
      handleLoadEpisodesError(error as Error);
    }
  };

  useEffect(() => {
    loadEpisodes();
  }, [reloadEpisodes]); // Re-fetch episodes when reloadEpisodes changes

  // Fetch categories
  const loadCategories = async () => {
    try {
      const categoriesEndpoint = "https://192.168.88.148:5000/api/categories";
      const data = await fetchCategories({
        method: "GET",
        endpoint: categoriesEndpoint,
      });
      console.log('Fetched categories:', data); // Check if it's an array
      setCategories(data);
    } catch (error) {
      handleLoadCategoriesError(error as Error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleEpisodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle episode submission logic
    const newEpisodeEndpoint = "https://192.168.88.148:5000/api/new_episode";
    const episodeData =  {
      episodeTitle,
      episodeNumber,
      featuredGuest,
    };

    try {
      const data = await submitNewEpisode({
        method: "POST",
        endpoint: newEpisodeEndpoint,
        body: episodeData,
      });
      setReloadEpisodes(true); // Trigger re-fetch
      handleNewEpisodeCreationSuccess(data);
    } catch (error) {
      handleNewEpisodeCreationError(error as Error);
    }

    setEpisodeTitle("");
    setEpisodeNumber("");
    setFeaturedGuest("");
    setShowEpisodeModal(false);
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle question submission logic
    const newQuestionEndpoint = "https://192.168.88.148:5000/api/new_question";
    const questionData = { 
      selectedEpisode,
      selectedCategory,
      question,
      choices
    };

    try {
      const data = await submitNewQuestion({
        method: "POST",
        endpoint: newQuestionEndpoint,
        body: questionData,
      })
      handleNewQuestionCreationSuccess(data);
    } catch (error) {
      handleNewQuestionCreationError(error as Error);
    }

    setSelectedEpisode("");
    setSelectedCategory("");
    setQuestion("");
    setChoices(initialChoices);
    setShowQuestionModal(false);
  };

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...choices];
    index === 0 ? newChoices[index].isCorrect = true : newChoices[index].isCorrect = false;
    newChoices[index].choiceText = value;
    setChoices(newChoices);
  };


  const handleLoadLeaderBoardError = (error: Error) => {
    alert(error.message);
  } 

  // Fetch top scorers
  const loadLeaderBoard = async() => {
    const leaderBoardEndpoint = 'https://192.168.88.148:5000/api/leaderboard';

    try {
        const data = await fetchTopPlayers({
            method: 'GET',
            endpoint: leaderBoardEndpoint,
        })
        // set top scorers
        setTopScorers(data[1]);
    } catch (error) {
        handleLoadLeaderBoardError(error as Error);
    }
}

useEffect(() => {
    loadLeaderBoard();
}, [])

  return (
    //////////////////// START OF DASHBOARD  ///////////////////////
    <div className="container-fluid admin-dashboard-container">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h1 className="my-4 text-white">Admin Dashboard</h1>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-sm-12 col-md-8 col-lg-8 my-2 text-center">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title pb-3">Top players 🎉</h2>
              <table className='scores-table w-100'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>User</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {topScorers.map((scorer: Score, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{scorer.username}</td>
                      <td>{scorer.score}</td>
                    </tr>
                  ))}
                </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-sm-12 col-md-8 col-lg-8 my-2 text-center">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title pb-3">Stats</h2>
              <table className='scores-table w-100'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>User</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {topScorers.map((scorer: Score, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{scorer.username}</td>
                      <td>{scorer.score}</td>
                    </tr>
                  ))}
                </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-sm-12 col-md-4 col-lg-4 my-2 text-center">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">New Episode</h2>
              <p className="card-text"> Add a new episode.</p>
              <button className="btn btn-primary"
                onClick={() => setShowEpisodeModal(true)}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-md-4 col-lg-4 my-2 text-center">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">New Question</h2>
              <p className="card-text">Add a new trivia question.</p>
              <button className="btn btn-primary"
                onClick={() => setShowQuestionModal(true)}
              >
                Add
              </button>
            </div>
          </div>
        </div>


        {/* Add Episode Modal */}
        <Modal className="episode-modal" show={showEpisodeModal} onHide={() => setShowEpisodeModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Episode</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEpisodeSubmit}>
              <Form.Group controlId="formEpisodeTitle">
                <Form.Label>Episode Title</Form.Label>
                <Form.Control
                  type="text"
                  value={episodeTitle}
                  onChange={(e) => setEpisodeTitle(e.target.value)}
                  placeholder="Enter episode title"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEpisodeNumber">
                <Form.Label>Episode Number</Form.Label>
                <Form.Control
                  type="text"
                  value={episodeNumber}
                  onChange={(e) => setEpisodeNumber(e.target.value)}
                  placeholder="Enter episode number"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formFeaturedGuest">
                <Form.Label>Featured Guest</Form.Label>
                <Form.Control
                  type="text"
                  value={featuredGuest}
                  onChange={(e) => setFeaturedGuest(e.target.value)}
                  placeholder="Enter featured guest (optional)"
                />
              </Form.Group>
              <div className="text-center pt-3">
                <Button variant="primary" type="submit" disabled={addingNewEpisode}>
                  {addingNewEpisode ? "Saving..." : "Save"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>


        {/* Add Question Modal */}
      <Modal
        className="episode-modal"
        show={showQuestionModal}
        onHide={() => setShowQuestionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Trivia Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleQuestionSubmit}>
            <Form.Group controlId="formEpisodeSelect">
              <Form.Label>Select Episode:</Form.Label>
              <Form.Control
                as="select"
                value={selectedEpisode}
                onChange={(e) => setSelectedEpisode(e.target.value)}
                required
              >
                <option value="">Select an episode</option>
                {episodes.map((episode: Episode) => (
                  <option key={episode.id} value={episode.id}>
                    {episode.episode_no + " " + episode.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formQuestion">
              <Form.Label>Question:</Form.Label>
              <Form.Control
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter question"
                required
              />
            </Form.Group>
            <Form.Group controlId="questionCategorySelect">
              <Form.Label>Select Category:</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category: QuestionCategory) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {choices.map((choice, index) => (
              <Form.Group controlId={`formChoice${index}`} key={index}>
                <Form.Label>
                  {index === 0 ? "Correct Answer:" : `Choice ${index + 1}:`}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={choice.choiceText}
                  onChange={(e) => handleChoiceChange(index, e.target.value)}
                  placeholder={`Enter choice ${index + 1}`}
                  required
                />
              </Form.Group>
            ))}
            <Button
              variant="primary"
              type="submit"
              disabled={addingNewQuestion}
            >
              {addingNewQuestion ? "Saving..." : "Save"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      </div> 
    </div>
    //////////////////// END OF DASHBOARD  ///////////////////////

  );
};

export default AdminDashboard;
