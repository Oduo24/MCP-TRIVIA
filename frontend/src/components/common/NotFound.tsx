import Lottie from "lottie-react";
import error404 from "../../lottie/error404.json";

const NotFound = () => {
  return (
    <div className="row flex-fill justify-content-center">
        <div className='col-md-4 text-center'>
          <Lottie
            loop={true} 
            animationData={error404} 
            style={{ width: 400, height: 400 }} 
          />
          <p className="text-white">Page Not Found!</p>
        </div>
    </div>
  )
};

export default NotFound;
