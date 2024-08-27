import { useParams } from 'react-router-dom'

const EndOfTrivia = () => {
  const {episodeId, episodeScore, totalQuestions} = useParams();
  return (
    <div>
        <p>{episodeId}</p>
        <p>{episodeScore} out of {totalQuestions}</p>
    </div>
  )
}

export default EndOfTrivia

