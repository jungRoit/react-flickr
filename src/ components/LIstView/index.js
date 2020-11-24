import React from 'react';
import ListViewItem from '../LIstViewItem';
import './style.css';

const ListView = (props) => {
  return (
    <div className="listview">
      {props.pictures.map((picture) => (
        <ListViewItem picture={picture} onAuthorSelected={props.onAuthorSelected} />
      ))}
    </div>
  );
};

export default ListView;
