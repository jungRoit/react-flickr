import React from 'react';
import Button from '../../ components/Button';
import FormInput from '../../ components/FormInput';
import { searchIcon,backIcon } from '../../config/image';
import * as ApiService from '../../services/api';
import { flickrFeed } from '../../config/url';
import { formatResponse } from '../../utils/utils';
import Loader from 'react-loader-spinner';
import ListView from '../../ components/LIstView';

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      pictures: [],
      loading: false,
    };
  }

  async componentDidMount() {
    this.getAllPictures();
  }

  getAllPictures = async () => {
    try {
      this.setState({ loading: true });
      const data = await this.getPictures(flickrFeed);
      this.setState({ pictures: data.items, loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
  }

  search = async (e) => {
    e.preventDefault();
    console.log('search for', this.state.searchText);
    if (this.state.searchText) {
      try {
        this.setState({ loading: true });
        const tags = this.state.searchText.split(' ').join(',');
        const data = await this.getPictures(`${flickrFeed}&tags=${tags}`);
        this.setState({ pictures: data.items, loading: false });
      } catch (error) {
        this.setState({ loading: false });
      }
    }
  };

  handleOnChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getPictures = async (url) => {
    const response = await ApiService.get(url);
    return formatResponse(response);
  };

  handleAuthorSelected = async (id) => {
    try {
      this.setState({ authorId: id, loading: true });
      const data = await this.getPictures(`${flickrFeed}&id=${id}`);
      console.log('Data', data.items);
      this.setState({ pictures: data.items, loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div className="container">
        <div className="header">
          <div className="header-left">
            <h1 className="title">Flickr Feeds</h1>
          </div>
          <div className="header-right">
            <form className="search-box" onSubmit={this.search}>
              <FormInput
                onChange={this.handleOnChange}
                value={this.state.searchText}
                label="Search"
                type="text"
                name="searchText"
                icon={searchIcon}
              />
              <div className="form-buttons">
                <Button type="submit" text={'Search'}></Button>
              </div>
            </form>
          </div>
        </div>
        <div className="content">
          {this.state.loading ? (
            <div className="loader-wrapper">
              <Loader
                type="ThreeDots"
                color="#fddb3a"
                height={150}
                width={150}
              />
            </div>
          ) : (
            <div className="content-wrapper">
              {this.state.authorId && (
                <div className="author-box">
                  <button onClick={this.getAllPictures} className="link">
                  <img src={backIcon} className="back-button" />
                  </button>
                  <label className="author-label">Images By:</label>
                  <label className="author-content">
                    {this.state.pictures[0].author}
                  </label>
                </div>
              )}
              <ListView
                onAuthorSelected={this.handleAuthorSelected}
                pictures={this.state.pictures}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Feed;
