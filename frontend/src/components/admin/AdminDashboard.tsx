import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import useFetch from "../../hooks/useFetch";
import { Episode, QuestionCategory, QuestionChoice, Success } from "../../models";

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

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="my-4">Admin Dashboard</h1>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Add New Episode</Card.Title>
              <Card.Text>
                Click the button below to add a new episode.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => setShowEpisodeModal(true)}
              >
                Add Episode
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Add Trivia Question</Card.Title>
              <Card.Text>
                Click the button below to add a new trivia question.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => setShowQuestionModal(true)}
              >
                Add Question
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Episode Modal */}
      <Modal show={showEpisodeModal} onHide={() => setShowEpisodeModal(false)}>
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
            <Button variant="primary" type="submit" disabled={addingNewEpisode}>
              {addingNewEpisode ? "Saving..." : "Add Episode"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Question Modal */}
      <Modal
        show={showQuestionModal}
        onHide={() => setShowQuestionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Trivia Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleQuestionSubmit}>
            <Form.Group controlId="formEpisodeSelect">
              <Form.Label>Select Episode</Form.Label>
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
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter question"
                required
              />
            </Form.Group>
            <Form.Group controlId="questionCategorySelect">
              <Form.Label>Select Category</Form.Label>
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
                  {index === 0 ? "Correct Answer" : `Choice ${index + 1}`}
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
              {addingNewQuestion ? "Saving..." : "Add Question"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
