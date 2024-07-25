import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Table } from 'react-bootstrap';
import useFetch from '../../hooks/useFetch';
import { Score } from '../../models';
import { useAuth } from '../../contexts/AuthContext';

const LeaderBoard: React.FC = () => {
    const {fetchData, loading} = useFetch();
    const [topScorers, setTopScorers] = useState<Score[]>([]);
    // const [currentUserScore, setCurrentUserScore] = useState(0);

    const {username, score} = useAuth();


    const handleLoadLeaderBoardError = (error: Error) => {
        alert(error.message);
    } 

    const loadLeaderBoard = async() => {
        const leaderBoardEndpoint = 'https://localhost:5000/api/leaderboard';

        try {
            const data = await fetchData({
                method: 'GET',
                endpoint: leaderBoardEndpoint,
            })
            // setCurrentUserScore(data[0]);

            setTopScorers(data[1]);
        } catch (error) {
            handleLoadLeaderBoardError(error as Error);
        }
    }

    useEffect(() => {
        loadLeaderBoard();
    }, [])


    return (
        <Container>
          <Row className="my-4">
            <Col>
              <h2>Leaderboard</h2>
            </Col>
          </Row>
          <Row className="my-4">
            <Col>
              <h3>{username} --- {score}</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
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
              </Table>
            </Col>
          </Row>
        </Container>
      );
}

export default LeaderBoard