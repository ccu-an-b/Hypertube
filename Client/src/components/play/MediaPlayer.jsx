import React from 'react';

export default class MediaPlayer extends React.Component {

    constructor(){
        super()
        this.state = {}
        this.movieRef = React.createRef()
    }

    renderComments = (subs) => {
        return subs.map((sub, index) => {
            return (
                <track label={sub.label} kind="subtitles" srcLang={sub.lang} src={sub.path} key={index}></track>
            )
        })
    }

    render() {
        const {movie, getSubtitles} = this.props;

        if(movie){
            return (
                <div className="player">
                    <video  id="videoPlayer"  controls controlsList="nodownload" onLoadedData={() => getSubtitles()}>
                    <source src={`/api/play?id=${movie._id}`} type="video/mp4" />
                        {this.renderComments(movie.subtiles)}
                    </video>

                </div>
            )
        }
        else {
            return (
                <div className="loading_gif">
                    <img src={`${process.env.PUBLIC_URL}/loading.gif`} alt="loading" />
                </div>
            )
        }
    }
}