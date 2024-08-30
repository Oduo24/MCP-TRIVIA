import React from 'react'
import EpisodeTrivia from './EpisodeTrivia'
import { useParams } from 'react-router-dom'

const EpisodeTriviaWrapper: React.FC = () => {
    const params = useParams();
  return (
    <EpisodeTrivia key={params.episodeId} episodeID={params.episodeId!}/> // Used non null assertion operator !
  )
}

export default EpisodeTriviaWrapper