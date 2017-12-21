import React from 'react';
import './search.css';
// import Searchresults from './searchresults';
import {reduxForm, Field} from 'redux-form';
import Input from './input';
import $ from 'jquery';
import AlbumRow from './albumrow';

var itunesUrl = "https://itunes.apple.com/search?term=";
var albumUrl = "https://itunes.apple.com/lookup?id=";
var cards = [];
var musicOutput = [];

function renderIt(music) {
    musicOutput = [];
    for (var k = 0; k < music.length; k++) {
        let artistKey = music[k].artistName;
        let albumKey = music[k].collectionName;
        let genreKey = music[k].primaryGenreName;
        let imageKey = music[k].artworkUrl100;
        let itunes = music[k].collectionViewUrl;
        musicOutput.push(<AlbumRow artist={artistKey} album={albumKey} genre={genreKey} imagelink={imageKey} buyOnItunes={itunes}/>);
    }
}

export class Searchsection extends React.Component {
    render() {
        console.log(musicOutput);
        return (
            <div className="search-section">
            <form className="musicsearch"
                onSubmit={this.props.handleSubmit(values =>
                    this.onSubmit(values)
                )}>
                <label /*for="artist"*/>Artist</label>
                <Field name="name" id="name" type="text" component={Input} className="searchterm" />
                <button type="submit" className="submit-artist" disabled={this.props.pristine || this.props.submitting}>Send message</button>
            </form>
            <section className="results">
                {musicOutput}
            </section>
            </div>
        );
    }
    onSubmit(values) {
        var cards = [];
        let result = values.name.split(' ').join('+');
        $.getJSON(`${itunesUrl}${result}`, function(data) {
            for (var i = 0; i < data.results.length; i++) {
                if (values == data.results[i].artistName || data.results[i].wrapperType == "track") {
                    const artistNumber = data.results[i].artistId;
                    $.getJSON(`${albumUrl}${artistNumber}&entity=album`, function(data) {
                        let music = data.results;
                        for (var j = 0; j < music.length; j++) {
                            if (music[j].wrapperType !== "collection") {
                                continue;
                            }
                            // console.dir(music[j]);
                            cards.push(music[j]);
                        }
                        // console.log(cards.length);
                        renderIt(cards);
                    })
                    break;
                }
            }
        })
    }
}





export default reduxForm({
    form: 'search'
})(Searchsection);
