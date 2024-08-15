import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { Episode, QuestionCategory, QuestionChoice, Score, Success } from "../../models";
import "./admindashboard.css";
import {
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { errorToast, successToast } from "../../utility";


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
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const { fetchData: fetchAdminData } = useFetch();

  // Initial state for choices
  const initialChoices: QuestionChoice[] = [
    { choiceText: '', isCorrect: false },
    { choiceText: '', isCorrect: false },
    { choiceText: '', isCorrect: false },
    { choiceText: '', isCorrect: false },
  ];
  const [choices, setChoices] = useState<QuestionChoice[]>(initialChoices);
  const { fetchData: submitNewEpisode, loading: addingNewEpisode } = useFetch();
  const { fetchData: submitNewQuestion, loading: addingNewQuestion } =
    useFetch();
  const [reloadEpisodes, setReloadEpisodes] = useState(false);


  const handleLoadAdminDataError = (error: Error) => {
    console.error(error);
    errorToast('Could not load admin data');
  };

  const handleNewEpisodeCreationError = (error: Error) => {
    console.error(error);
    errorToast('Error adding ne episode');
  }

  const handleNewEpisodeCreationSuccess = (data: Success) => {
    successToast(data.status);
  }

  const handleNewQuestionCreationSuccess = (data: Success) => {
    successToast(data.status);
  }

  const handleNewQuestionCreationError = (error: Error) => {
    console.error(error);
    errorToast(error.message);
  }

  // fetch episodes
  const loadAdminData = async () => {
    try {
      const adminDataEndpoint = "/api/admin_data";
      const data = await fetchAdminData({
        method: "GET",
        endpoint: adminDataEndpoint,
      });
      setEpisodes(data[0]);
      setCategories(data[1]);
      setTopScorers(data[2]);
      setTotalUsers(data[3]);
      setTotalQuestions(data[4]);


    } catch (error) {
      handleLoadAdminDataError(error as Error);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [reloadEpisodes]); // Re-fetch episodes when reloadEpisodes changes


  const handleEpisodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle episode submission logic
    const newEpisodeEndpoint = "/api/new_episode";
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
    const newQuestionEndpoint = "/api/new_question";
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
  
    value ? newChoices[index].choiceText = value : newChoices[index].choiceText = '';
    setChoices(newChoices);
  };


  return (
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
                    <th>Users</th>
                    <th>Episodes</th>
                    <th>Questions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{totalUsers}</td>
                    <td>{episodes.length}</td>
                    <td>{totalQuestions}</td>
                  </tr>
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
        {/* End of dashboard */}


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

  );
};

export default AdminDashboard;
