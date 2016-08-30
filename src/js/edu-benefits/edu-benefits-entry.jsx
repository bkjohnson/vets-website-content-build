import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Route, Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import EduBenefitsApp from './containers/EduBenefitsApp.jsx';
import initReact from '../common/init-react';
import reducer from './reducers';
import routes from './routes.jsx';

require('../../sass/edu-benefits.scss');

const store = createStore(reducer, compose(applyMiddleware(thunk), __BUILDTYPE__ === 'development' && window.devToolsExtension ? window.devToolsExtension() : undefined));

// TODO: figure out the right url here
const browserHistory = useRouterHistory(createHistory)({
  basename: '/education/apply-for-education-benefits/application'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={EduBenefitsApp}>
          {routes}
        </Route>
      </Router>
    </Provider>
    ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
