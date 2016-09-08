import React from 'react';
import { connect } from 'react-redux';

import FolderNav from '../components/FolderNav';

class AppMessaging extends React.Component {
  render() {
    const folders = ['Inbox', 'Drafts', 'Sent', 'Deleted'];
    return (
      <div>
        <FolderNav folders={folders}/>
        {this.props.children}
      </div>
    );
  }
}

AppMessaging.propTypes = {
  children: React.PropTypes.node
};

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(AppMessaging);
