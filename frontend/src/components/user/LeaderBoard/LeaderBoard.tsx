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
          <div className="row justify-content-center full-page-row">
            <div className='col-md-8 page-title text-center'>
              <h2 className='text-white'>LEADERBOARD</h2>
              <div className="row justify-content-center my-4 row-container">
                <div className='col-md-6'>
                  <div className='row justify-content-center'>
                    <div className="col-md-8 username">
                      <h3 className=''>Username: <span>{username}</span></h3>
                    </div>
                    <div className="col-md-6 user-score">
                      <h3 className=''>Score: <span>{score}</span></h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center text-center my-4 row-container">
              <h3 className='px-3'>Top players 🎉</h3>
                <table className='scores-table'>
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
      );
}

export default LeaderBoard