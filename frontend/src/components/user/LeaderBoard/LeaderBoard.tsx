import React, { useEffect, useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import { Score } from '../../../models';
import { useAuth } from '../../../contexts/AuthContext';
import "./leaderboard.css";

const LeaderBoard: React.FC = () => {
    const {fetchData, loading} = useFetch();
    const [topScorers, setTopScorers] = useState<Score[]>([]);

    const {username, score} = useAuth();

    const handleLoadLeaderBoardError = (error: Error) => {
        alert(error.message);
    } 

    const loadLeaderBoard = async() => {
        const leaderBoardEndpoint = 'https://192.168.88.148:5000/api/leaderboard';

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
        <div className='container-fluid full-page-leaderboard-container'>
          <div className="row justify-content-center text-center full-page-row">
            <div className='col-md-8'>
              <h2 className='text-white'>Leaderboard</h2>
              <h3 className='text-white'>{username}: {score}</h3>
              <table className='table table-striped styled-table'>
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
      );
}

export default LeaderBoard