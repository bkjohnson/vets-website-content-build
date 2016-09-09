import React from 'react';
import { connect } from 'react-redux';

import { fetchFolders } from '../actions/folders';
import FolderNav from '../components/FolderNav';

class MessagingApp extends React.Component {
  componentWillMount() {
    this.props.dispatch(fetchFolders());
  }

  render() {
    const folders = this.props.folders.items;
    return (
      <div>
        <FolderNav folders={folders}/>
        {this.props.children}
      </div>
    );
  }
}

MessagingApp.propTypes = {
  children: React.PropTypes.node
};

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(MessagingApp);
