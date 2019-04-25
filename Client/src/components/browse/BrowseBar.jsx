import React from 'react';
import Select from 'react-select';
import SearchField from "react-search-field";
import {BwmIntervalSlider} from '../shared/form/BwmIntervalSlider';

const Text = require('../../helpers/languages');

export default class BrowseBar extends React.Component {

    render() {
        const {browseref,sortHandle, orderHandle, filterGenre , searchHandler ,yearHandle, ratingHandle, lang} = this.props
        return (
            <div className="browse-bar" ref={browseref}>
                <div className="filter">
                    <div className="my-select">
                        <Select     options={Text.optionsOrderBy[lang]}  
                                    placeholder={Text.order[lang]}
                                    onChange={orderHandle}
                                    isClearable={true}
                        />
                    </div>
                    <div className="my-select">
                        <Select     options={Text.optionsSortBy[lang]}  
                                    placeholder={Text.sort[lang]}
                                    onChange={sortHandle}
                                    isClearable={true}
                        />
                    </div>
                    <div className="my-select">
                        <Select     options={Text.optionsGenre[lang]} 
                                    placeholder={Text.placeholderGenre[lang]}
                                    onChange={filterGenre}
                                    isClearable={true}/>
                    </div>
                    <div className="my-slider">
                        <h5>{Text.year[lang]}</h5>
                        <BwmIntervalSlider
                            min={1920}
                            max={2019}
                            onChange={yearHandle}
                        />
                    </div>
                    <div className="my-slider">
                        <h5>{Text.rating[lang]}</h5>
                        <BwmIntervalSlider
                            min={0}
                            max={10}
                            onChange={ratingHandle}
                        />
                    </div>
                </div>

                <SearchField
                    placeholder={Text.search[lang]+'...'}
                    onChange={searchHandler}
                    classNames="my-search"
                />
            </div>
        )
    }
}

