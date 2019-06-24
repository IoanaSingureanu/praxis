import React from 'react';
import { Router, Route, Switch, Link, NavLink,useRouterHistory } from 'react-router-dom';
import {createBrowserHistory} from 'history';
import FHIMProfileEditorDashboardPage from '../components/FHIMProfileEditorDashboardPage';
import NotFoundPage from '../components/NotFoundPage';
import LoginPage from '../components/LoginPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export const history = createBrowserHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path="/" component={LoginPage} exact={true} />
        <PrivateRoute path="/dashboard" component={FHIMProfileEditorDashboardPage} />
         <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
