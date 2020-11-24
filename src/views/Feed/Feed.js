import React from 'react';
import Button from '../../ components/Button';
import FormInput from '../../ components/FormInput';
import {searchIcon} from '../../config/image';
import * as ApiService from '../../services/api';
import { flickrFeed } from '../../config/url';
import {formatResponse} from '../../utils/utils';
import Loader from 'react-loader-spinner'


class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText:'',
      pictures:[],
      loading: false,
    };
  }

  async componentDidMount() {
    try {
      this.setState({loading:true})
      const response = await ApiService.get(flickrFeed);
      const data = formatResponse(response);
      console.log('Data', data.items);
      this.setState({pictures:data.items, loading:false})
    } catch (error) {
      console.log('err', error);
      this.setState({loading:false})
    }
  }

  search = (e) => {}

  handleOnChange = (e) => {}

  render() {
    return (
      <div className="container">
        <div className="header">
          <div className="header-left">
          <h1>Flickr Feed</h1>
          </div>
          <div className="header-right">
          <form className="search-box" onSubmit={this.search}>
              <FormInput
                onChange={this.handleOnChange}
                // value={this.state.searchText}
                label="Search"
                type="text"
                name="search"
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
        ):(
          <div>
            {this.state.pictures.map(picture => (
              <h1>{picture.title}</h1>
            ))}
          </div>
        )}
        </div>
      </div>
    );
  }
}

export default Feed;
