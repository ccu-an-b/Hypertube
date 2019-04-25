import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { imgPath, renderGenre } from 'helpers';

const Text = require('../../helpers/languages');

export default class MovieCard extends Component {
    constructor(){
        super()
        this.state = {
            show:false,
            trailer:false,
            width:window.innerWidth,
            height:window.innerHeight,
        }
        this.movieRef = React.createRef()
    }

    componentWillMount(){
        window.addEventListener("resize", this.updateWindowDimensions)
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    componentDidUpdate(prevProps){
        if (prevProps.showDescriptionId !== this.props.showDescriptionId && this.state.show)
            this.setState({show: false})
    }
    showFull = async (id) => {
        await this.props.showDescription(id)
        await this.setState({show: !this.state.show})
        if (this.state.show){
            this.movieRef.current.scrollIntoView({behavior: 'smooth'})
            this.setState({trailer: true})
        }
    }

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    _onReady = (event) => {
        event.target.playVideo();
    }

    render() {
        const { id, title, img, src, rating, year, genres , runtime, synopsis, showDescriptionId, trailerKey, lang, mylist, isSeen, listHandle} = this.props
        const { show , width } = this.state;
        
        return (
            <div className={show && showDescriptionId === id? "one-movie show" : "one-movie "} key={id} >
        
                <div className="preview"    onClick={() => this.showFull(id)} 
                                            ref={this.movieRef}
                                            onMouseEnter={this.hoverOn} 
                                            onMouseLeave={this.hoverOff}>
                    <div className="not-hover">
                        <img alt="poster" src={imgPath(img)} className={isSeen ? "seen" : "" }/>
                        <h2>{title}</h2>
                        { isSeen && 
                            <i className="fas fa-eye"></i>
                        }
                        <div className="rating">{rating}</div>
                    </div>
                </div>

                <div className="description-container" >
                    <div className="description-body">
                        <div className="description-img">
                            {show && showDescriptionId === id && trailerKey && width > 580 && 
                                <div className="trailer">
                                    <iframe title="triler"
                                            height="550" 
                                            width="70%" 
                                            src={`https://www.youtube.com/embed/${trailerKey}?rel=0&autoplay=1&loop=1&controls=0&showinfo=0&enablejsapi=1&origin=http://localhost:3000`}
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                                            />
                                </div>}
                        </div>
                        <div className="description-text">
                            <h1>{title}</h1>
                            <h2>{year}<span>{runtime}min</span></h2>
                            <p>{synopsis}</p> 
                            <div className="hypertube-buttons">
                                <Link to={{ pathname: "/play", id,src}} className="video-button yellow">
                                    <i className="fas fa-play"></i> {Text.play[lang]}
                                </Link>
                                <div className="video-button transparent" onClick={() => listHandle(mylist, id)}>
                                {mylist ? <i className="fas fa-check"></i>
                                    : <i className="fas fa-plus"></i>
                                }
                                    {Text.list[lang]}
                                </div>
                                
                            </div>
                            <div className="source">

                            </div>
                            <div className='info'>
                                <h4>{Text.placeholderGenre[lang]}: </h4>
                                <h5>{renderGenre(genres, Text.optionsGenre[lang])}</h5>
                            </div>
                            <div className="src">{src}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
