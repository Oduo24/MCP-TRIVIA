import { Link } from "react-router-dom";
import Header from "../Header/Header";
import Lottie from "lottie-react";
import launch from "../../../lottie/launch.json";
import { useAuth } from "../../../contexts/AuthContext";
import useFetch from "../../../hooks/useFetch";
import { errorToast } from "../../../utility";
import { useEffect, useState } from "react";
import { Episode } from "../../../models";
import Loader from "../../common/Loader";

const Home = () => {
  const {username, isAuthenticated, role} = useAuth();
  const { fetchData, loading } = useFetch();
  const [imageUrls, setImageUrls] = useState<Episode[]>([]);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  useEffect(() => {
    const getEpisodeImageUrls = async () => {
      try{
        const episodeImageUrlsEndpoint = 'https://192.168.88.148:5000/api/featuredEpisodes';
        const episodeImageUrls = await fetchData({
          method: 'GET',
          endpoint: episodeImageUrlsEndpoint,
        })
        setImageUrls(episodeImageUrls);
      } catch(error) {
        handleGetImageUrlError(error as Error);
      }
    }
    getEpisodeImageUrls();
  }, [])

  const handleGetImageUrlError = (error: Error) => {
    errorToast(error.message);
  }

  useEffect(() => {
      if (loadedImagesCount === imageUrls.length) {
        setAllImagesLoaded(true);
      }
  }, [loadedImagesCount, imageUrls.length])

  const handleOnload = () => {
    setLoadedImagesCount((prev) => prev + 1);
  }

  // Check if he urls are still loading or the images are still loading
  if (loading || !allImagesLoaded) {
    return <Loader isLoading={loading} />
  }

  return (
    <>
    {!isAuthenticated && <Header isAuthenticated={isAuthenticated} role={role} username={username} />}
    <div className="row d-flex align-items-center flex-fill justify-content-center text-center pt-5">
      <div className="col-md-10 welcome text-center">
        <h1 className="display-6 fw-bold">The Mind Check Trivia!</h1>
        <p className="lead">
          Test your knowledge and have fun
          with our exciting trivia questions.
        </p>
        <hr className="" />
        <div className="row justify-content-center text-center">
          <h3 className="fs-6">Featured Episodes</h3>
          {
            imageUrls.map((episode: Episode) => (
              <div className="col-md-4 text-center" key={episode.id}>
                <div className="card mb-4">
                  <img src={`https://192.168.88.148:5000/${episode.image_path}`} onLoad={handleOnload} className="card-img-top" alt={`${episode.episode_no} ${episode.title}`} />
                  <div className="card-body card-body-custom">
                      <p className="card-text">{episode.episode_no} {episode.title}</p>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <p>Ready to start?</p>
        {isAuthenticated ? (
          <Link to="/user/start" className="btn btn-primary btn-block" role="button">
            Start
          </Link>
        ) : (
          <Link to="/first_try" className="btn btn-primary btn-block" role="button">
            Start
          </Link>
        )}

        
        <div className="row justify-content-center text-center">
          <Lottie loop={true} animationData={launch} style={{ width: 100, height: 100 }}/>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;
