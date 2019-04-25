import React from 'react'
import { imgPath, renderGenre } from 'helpers';

const Text = require('../../helpers/languages');

export const MediaDescription = props => {
    const { img, genre, rating, runtime, synopsis, title, year, cast, id, director, lang, mylist, listHandle,src } = props

    return (
        <div className="video-page-header">
            <div className="video-description">
                <div className="header-left">
                    <img src={imgPath(img)} alt="poster" />

                    <div className="my-list" onClick={() => listHandle(id)}>
                        {mylist ? <i className="fas fa-check"></i>
                            : <i className="fas fa-plus"></i>
                        }
                        {Text.list[lang]}
                    </div>
                </div>
                <div className="header-right">
                    <h1>{title}</h1>
                    <h2>{year}<span>{runtime}min</span></h2>
                    <p>{synopsis}</p>
                    <div className="rating">{rating}</div>
                    <div className='info'>
                        <h4>{Text.director[lang]}</h4>
                        <h5>{director}</h5>
                    </div>
                    <div className='info'>
                        <h4>{Text.cast[lang]}</h4>
                        <h5>{cast.map((cast, index) => index === 4 ? cast + " " : cast + ", ")}</h5>
                    </div>
                    <div className='info'>
                        <h4>{Text.placeholderGenre[lang]}</h4>
                        <h5>{renderGenre(genre, Text.optionsGenre[lang])}</h5>
                    </div>
                    <div className="src">{src}</div>
                </div>
            </div>
        </div>
    )
}
