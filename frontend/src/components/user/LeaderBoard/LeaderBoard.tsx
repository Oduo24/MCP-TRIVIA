import React, { useEffect, useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import { Score } from '../../../models';
import { useAuth } from '../../../contexts/AuthContext';
import "./leaderboard.css";
import { errorToast } from '../../../utility';
import Loader from '../../common/Loader';

const LeaderBoard: React.FC = () => {
    const {fetchData, loading} = useFetch();
    const [topScorers, setTopScorers] = useState<Score[]>([]);

    const {username, score} = useAuth();

    const handleLoadLeaderBoardError = (error: Error) => {
        errorToast(error.message);
    }

  
    const loadLeaderBoard = async() => {
        const leaderBoardEndpoint = '/api/leaderboard';

        try {
            const data = await fetchData({
                method: 'GET',
                endpoint: leaderBoardEndpoint,
            })

            setTopScorers(data[1]);
        } catch (error) {
            handleLoadLeaderBoardError(error as Error);
        }
    }

    useEffect(() => {
        loadLeaderBoard();
    }, [])


    if (loading) {
      return (
        <Loader isLoading={loading} />
      );
    }

    return (
      <div className="row flex-fill justify-content-center">
        <div className='col-md-8 page-title text-center'>
          <h1 className='page-title'>LEADERBOARD</h1>
          <div className="row justify-content-center my-4 row-container">
            <div className='col-md-6'>
              <div className='row justify-content-center'>
                <div className="col-md-8 username">
                  <h3 className=''>Username: <span> <p>{username}</p> </span></h3>
                </div>
                <div className="col-md-6 user-score">
                  <h3 className=''>Score: <span> <p>{score}</p> </span></h3>
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
                  <td>{index + 1 === 1 ? "🥇" : index + 1 === 2 ? "🥈" : index + 1 === 3 ? "🥉" : index + 1}</td>
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