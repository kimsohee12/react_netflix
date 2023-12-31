import axios from "../api/axios";
import React, { useEffect, useState } from "react";
import requests from "../api/requests";
import "./Banner.css";
import styled from "styled-components";
import Swal from "sweetalert2";

export const Banner = () => {

    const [movie, setMovie] = useState([]);
    const [isClicked, setIsClicked] = useState(false);
    const [moreOV,setMoreOV] = useState(false);

    useEffect(() => {
        fetchData();
        console.log(movie.backdrop_path);
    }, []);


    const fetchData = async () => {
        // 현재 상영중인 영화 정보를 가져오기(여러 영화)
        const request = await axios.get(requests.fetchNowPlaying);

        // 여러 영화 중 영화 하나의 ID를 가져오기
        const movieId =
            request.data.results[
                Math.floor(Math.random() * request.data.results.length)
            ].id;

        // 특정 영화의 더 상세한 정보를 가져오기(비디오 정보도 포함)
        const { data: movieDetail } = await axios.get(`movie/${movieId}`, {
            params: { append_to_response: "videos" },
        });
        setMovie(movieDetail);
    };

    //movie.overview(줄거리)가 길면 '...' 으로 자르기
    const truncate = (str, n) => {
        return str?.length > n ? str.substr(0, n - 1) + "... 더보기" : str;
    };

    const videoBtnClick=()=>{
        if(movie.videos.results.length==0){
            Swal.fire({
                icon: "error",
                color:"rgb(222, 222, 222)",
                background:'#1f1f1f',
                text: '해당 영화는 등록 된 예고편이 없습니다.',
                confirmButtonText: "확인",
            })
        }else{
            setIsClicked(true)

        }
    }
    console.log('movie', movie);
    if (!isClicked) {
        return (
            <header
                className="banner"
                style={{
                    backgroundImage:"url("+`https://image.tmdb.org/t/p/original${movie.backdrop_path}`+")", 
                    backgroundPosition:"top center",
                    backgroundSize:"cover"}}>
                <div className="banner--fadeBottom" >
                    <div className="banner__contents">
                        <h1 className="banner__title">
                            {movie.title || movie.name || movie.original_name}
                        </h1>

                        <div className="banner__buttons">
                            <button
                                className="banner__button play"
                                onClick={() => videoBtnClick()}
                            >
                                Play
                            </button>
                        </div>

                        <h1 className="banner__description" onClick={()=>setMoreOV(true)}>
                    
                    {moreOV? truncate(movie.overview, 600) :truncate(movie.overview, 100)}
                        </h1>
                    </div>

                </div>
            </header>
        );
    } else {
        return (
            <Container>
                <HomeContainer>
                    <Iframe width="640" height="360"
                        src={`https://www.youtube.com/embed/${movie.videos.results[0].key}?controls=0&autoplay=1&loop=1&mute=1&playlist=${movie.videos.results[0].key}`}
                        title="YouTube video player"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                    ></Iframe>
                </HomeContainer>
            </Container>
        );
    }
}
export default Banner

const Iframe = styled.iframe`
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.65;
    border: none;


&::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    background-color:#080808`;
    

const HomeContainer = styled.div`
    position: absolute;
    top: 60px;
    width: 100%;
    height: 100%;`;
