import React from 'react';

import { logout } from '../utils/helpers';

const LEFT_CLICK = 1;

function NewBadge() {
  return <span className="usa-label va-label-primary">New</span>;
}

class BetaDropdown extends React.Component {
  componentDidMount() {
    // If when this component is mounted the user is on the index page without the "next" parameter in the URL...
    if (window.location.pathname === '/' && !window.location.search) {
      this.redirectToDashboard();
    } else {
      document.addEventListener('click', this.checkLink);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.checkLink);
  }

  checkLink = (event) => {
    if (event.target.tagName.toLowerCase() === 'a' && event.target.pathname === '/' && event.which === LEFT_CLICK) {
      event.preventDefault();
      event.stopPropagation();

      this.redirectToDashboard();
    }
  }

  redirectToDashboard() {
    window.location.replace('/dashboard-beta');
  }

  render() {
    return (
      <ul>
        <li><a href="/profile-beta">Profile</a> <NewBadge/></li>
        <li><a href="/account-beta">Account</a> <NewBadge/></li>
        <li><a href="#" onClick={logout}>Sign Out</a></li>
      </ul>
    );
  }
}

export default BetaDropdown;
