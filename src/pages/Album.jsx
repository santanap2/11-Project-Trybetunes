import React, { Component } from 'react';
import propTypes from 'prop-types';
import Header from '../components/Header';
import getMusics from '../services/musicsAPI';
import MusicCard from '../components/MusicCard';

class Album extends Component {
  state = {
    albumInfo: [],
    name: '',
    album: '',
  }

  componentDidMount() {
    this.gettingMusic();
  }

  gettingMusic = async () => {
    const { match } = this.props;
    const { params: { id } } = match;
    const result = await getMusics(id);
    this.setState({
      albumInfo: result,
    }, () => {
      const { albumInfo } = this.state;
      const firstObj = albumInfo[0];
      const { artistName, collectionName, artworkUrl100 } = firstObj;
      this.setState({
        name: artistName,
        album: collectionName,
        image: artworkUrl100,
      });
    });
  }

  render() {
    const { name, album, image, albumInfo } = this.state;
    const musicsArray = albumInfo.filter((item) => item.kind === 'song');
    const displayTracklist = musicsArray.length > 0;
    return (
      <div data-testid="page-album">
        <Header />
        <div className="album-page">
          <p className="search-result-title">Album</p>

          <div className="album-container">

            <div className="album-cover">
              <img src={ image } alt="Capa do album" className="cover-image" />
              <section data-testid="album-name" className="album">{ album }</section>
              <section data-testid="artist-name" className="artist">{ name }</section>
            </div>

            <div>
              { displayTracklist && (
                musicsArray.map((item) => {
                  const { trackName, previewUrl, trackId } = item;
                  return (
                    <MusicCard
                      trackName={ trackName }
                      previewUrl={ previewUrl }
                      key={ trackName }
                      trackId={ trackId }
                    />
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }
}

Album.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Album;
