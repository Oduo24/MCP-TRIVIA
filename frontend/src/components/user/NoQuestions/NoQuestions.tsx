import Lottie from "lottie-react"
import swingingsad from "../../../../src/lottie/swingsad.json";

function NoQuestions() {
  return (
    <div className="row justify-content-center text-center">
        <Lottie
            loop={true} 
            animationData={swingingsad} 
            style={{ width: 400, height: 400 }} 
          />
          <p className="text-white">No new questions for you!</p>
    </div>
  )
}

export default NoQuestions