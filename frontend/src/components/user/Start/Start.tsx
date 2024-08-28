import React, { useEffect, useState } from 'react'
import useFetch from '../../../hooks/useFetch';
import { errorToast } from '../../../utility';
import { Episode } from '../../../models';
import Loader from '../../common/Loader';
import { Link } from 'react-router-dom';
import { useEpisodes } from '../../../contexts/episodesContext';

const Start: React.FC = () => {
    // Get all episodes and display as cards(Use pagination)
    // On click each retrive the episode's questions and start trivia.
    // At the end of the trivia, show score and add a link to the next episode's questions at the bottom

    const { fetchData, loading } = useFetch();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;
    const lastIndex = pageSize * currentPage;
    const firstIndex = lastIndex - pageSize;
    
    const [episodesData, setEpisodesData] = useState<Episode[]>([])
    const numberOfPages = Math.ceil(episodesData.length/pageSize);
    const records = episodesData.slice(firstIndex, lastIndex);

    const [allImagesLoaded, setAllImagesLoaded] = useState(false);
    const [loadedImagesCount, setLoadedImagesCount] = useState(0);

    const { setEpisodes } = useEpisodes();

    useEffect(()=>{
        const getEpisodesData = async () => {
            const episodesEndpoint = 'https://192.168.88.148:5000/api/episodes';
            try{
                const episodesData = await fetchData({
                    method: 'GET',
                    endpoint: episodesEndpoint,
                })
                setEpisodesData(episodesData);
                setEpisodes(episodesData);
            } catch(error) {
                handleEpisodesRetrievalError(error as Error);
            }
        }
        getEpisodesData();
    }, [])

    const previousPage = () => {
        const prevPage = currentPage - 1;
        if (prevPage !== 0) {
            setCurrentPage(prevPage);
        }
    }

    const nextPage = () => {
        const nPage = currentPage + 1;
        if (nPage < numberOfPages + 1) {
            setCurrentPage(nPage);
        }
    }

    const changeCurrentPage = (pageNo: number) => {
        setCurrentPage(pageNo);
    }

    const handleEpisodesRetrievalError = (error: Error) => {
        errorToast(error.message);
    }

    useEffect(()=> {
        if (loadedImagesCount === records.length) {
            setAllImagesLoaded(true);   
        }
    }, [loadedImagesCount])

    const handleOnLoad = ()=> {
        setLoadedImagesCount((count) => count+1 )
    }

  return (
    <>
    <div className="row flex-fill justify-content-center">
        <div className='col text-start'>
          <h1 className='page-title'>Episodes</h1>
          <p className='title-text'>Pick an episode</p>
        </div>
    </div>
    {!loading && allImagesLoaded ? (<div className="row row-cols-2 row-cols-md-4 g-4">
        {
            records.map((episode, index) => (
                <div className="col" key={index}>
                    <Link to={`/user/trivia/${episode.id}/${episode.episode_no}`} className='episode-link'>
                        <div className="card h-100" >
                            <img src={`https://192.168.88.148:5000/${episode.image_path}`} onLoad={handleOnLoad} className="card-img-top" alt="..." />
                            <div className="card-body card-body-custom text-center">
                                <h6 className="page-title  pt-1">{episode.episode_no} {episode.title}</h6>
                            </div>
                        </div>
                    </Link>
                </div>
            ))
        }
    </div>) : <Loader isLoading={true}/>}
    
    <div className="row flex-fill justify-content-center mx-2">
        <div className='col-md-8 justify-content-center pt-5'>
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    <li className="page-item">
                    <a className="page-link" onClick={previousPage} href='#' aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                    </li>

                    {
                        Array.from({length: numberOfPages}, (_,i) => i+1).map((pageNumber, index) => (
                            <li className="page-item" key={(index)}>
                                <a className={`page-link ${currentPage === pageNumber ? 'active' : ''}`} href='#' onClick={() => changeCurrentPage(pageNumber) }>{pageNumber}</a>
                            </li>
                        ))
                    }

                    <li className="page-item">
                    <a className="page-link" href='#' onClick={nextPage} aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    </>
  )
}

export default Start