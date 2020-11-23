import React from 'react';
import Button from '../../ components/Button';
import FormInput from '../../ components/FormInput';
import {searchIcon} from '../../config/image';
import * as ApiService from '../../services/api';
import { flickrFeed } from '../../config/url';
import {formatResponse} from '../../utils/utils';

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText:'',
      success: false,
    };
  }

  async componentDidMount() {
    try {
      const response = await ApiService.get(flickrFeed);
      const data = formatResponse(response);
      console.log('Data', data.items);
    } catch (error) {
      console.log('err', error);
    }
  }

  search = (e) => {}

  handleOnChange = (e) => {}

  render() {
    return (
      <div className="container">
        <div className="sign-up-box">
          <div className="signup-box-header">
            <h1 className="sign-box-header-title">Flickr Feeds</h1>
          </div>
          <div className="signup-box-form">
            <form className="search-box" onSubmit={this.search}>
              <FormInput
                onChange={this.handleOnChange}
                value={this.state.searchText}
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
      </div>
    );
  }
}

export default Feed;
