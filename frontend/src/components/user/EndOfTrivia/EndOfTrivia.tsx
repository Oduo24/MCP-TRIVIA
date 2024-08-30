import { useAuth } from '../../../contexts/AuthContext';
import { useEpisodes } from '../../../contexts/episodesContext';
import React, { useState, useEffect } from 'react';
import { Episode } from '../../../models';
import { useNavigate } from 'react-router-dom';

interface EndOfTriviaProps {
  episodeId: string;
  episodeScore: number;
  totalQuestions: number;
}

const EndOfTrivia: React.FC<EndOfTriviaProps> = ({episodeId, episodeScore, totalQuestions}) => {
  const { answeredEpisodes } = useAuth();
  const { episodes } = useEpisodes();
  const [nextEpisodeObject, setNextEpisodeObject] = useState<Episode | undefined>(undefined);

  const navigate = useNavigate();

  // Current episode
  const currentEpisode = episodes.find(
    (episode) => episode.id === episodeId
  )!;

  useEffect(() => {
    const allEpisodeIds = episodes.map((episode) => episode.id);
    
    // Removing answered episodes from the list of all episodes
    const unAnsweredEpisodes = allEpisodeIds.filter(
      (episode) => !answeredEpisodes.includes(episode)
    );

    const unAnsweredEpisodeObjects = episodes.filter(
      (episode) => unAnsweredEpisodes.includes(episode.id)
    );

    // Set next episode only if there are unanswered episodes left
    if (unAnsweredEpisodeObjects.length > 0) {
      const next = unAnsweredEpisodeObjects.pop();
      setNextEpisodeObject(next);
    }
  }, [answeredEpisodes]);

  const nextTrivia = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if(nextEpisodeObject) {
        navigate(`/user/trivia/${nextEpisodeObject.id}/${nextEpisodeObject.episode_no}`);
        // window.location.reload(); // Reload the page after navigation
    } else {
        navigate('/scores');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 justify-content-center">
        <h2 className='page-title'>{currentEpisode.episode_no} {currentEpisode.title}</h2>
        <p className='text-white'>Score: {episodeScore} out of {totalQuestions}</p>
      </div>
      <div className="col-md-8 justify-content-center">
        <div className="card text-card">
          <div className="card-header text-white">
            Next Episode
          </div>
          <div className="card-body card-body-custom text-center">
            {nextEpisodeObject ? (
              <>
                <h6 className="page-title pt-1">{nextEpisodeObject.episode_no} {nextEpisodeObject.title}</h6>
                <button className='episode-link btn btn-primary' onClick={nextTrivia}>
                  Begin
                </button>
              </>
            ) : (
              <p>No more episodes available</p>
            )}
          </div>
          <div className="card-footer text-muted text-center">
            <p className='text-center'>Click to begin new Trivia</p>
          </div>
        </div>
      </div> 
    </div>
  );
}

export default EndOfTrivia;
