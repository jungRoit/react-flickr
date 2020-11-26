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
      sortOrder: 'asc',
      sortBy: '',
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

  sortPictures = () => {
      const pictures = this.state.pictures;
      pictures.sort((a,b) => {
        switch(this.state.sortBy) {
          case 'title': {
            return a.title.localeCompare(b.title);
          }
          case 'author': {
            return a.author.localeCompare(b.author);
          }
          case 'date_taken': {
            const aDate = new Date(a.date_taken);
            const bDate = new Date(b.date_taken);
            return aDate - bDate;
          }
          case 'published': {
            const cDate = new Date(a.published);
            const dDate = new Date(b.published);
            return cDate - dDate;
          }
          default : {
            return a.title.localeCompare(b.title);
          }     
        }
      })
      if(!this.state.sortOrder.localeCompare('desc')) {
        pictures.reverse();
      }
      this.setState({pictures});
  }

  handleSortOrder = (e) => {
    this.setState({sortOrder:e.target.value}, () => {
      this.sortPictures();
    });
  }

  handleSortBy = e => {
    this.setState({sortBy: e.target.value}, () => {
      this.sortPictures();
    });
  }

  render() {
    return (
      <div className="container">
        <div className="header">
          <div className="header-left">
            <h1 className="title">Flickr Feeds</h1>
          </div>
          <div className="filters-box">
          <div className="sort-box">
            <select onChange={this.handleSortBy} className="sort-select">
              <option className="sort-option" defaultChecked>Sort By:</option>
              <option className="sort-option" value={'title'}>Title</option>
              <option className="sort-option" value={'author'}>Author</option>
              <option className="sort-option" value={'published'}>Published Date</option>
              <option className="sort-option" value={'date_taken'}>Taken Date</option>
            </select>
          </div>
          <div className="sort-box">
            <select onChange={this.handleSortOrder} className="sort-select">
              <option className="sort-option" value={'asc'}>Ascending</option>
              <option className="sort-option" value={'desc'}>Descending</option>
            </select>
          </div>
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
