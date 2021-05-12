import React, { Component, Suspense, lazy } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import AppBar from './components/AppBar';
import { ToastContainer } from 'react-toastify';
import { selectors } from './redux/contacts';
import { authOperations } from './redux/auth';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import routes from './routes';
import Spinner from './components/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import 'modern-normalize/modern-normalize.css';

const HomePage = lazy(() =>
  import('./views/HomePage' /* webpackChunkName: "home-page" */)
);
const Contacts = lazy(() =>
  import('./views/Contacts' /* webpackChunkName: "contacts" */)
);
const Register = lazy(() =>
  import('./views/Register' /* webpackChunkName: "register" */)
);
const Login = lazy(() =>
  import('./views/Login' /* webpackChunkName: "login" */)
);

class App extends Component {
  componentDidMount() {
    this.props.onGetCurrentUser();
  }
  render() {
    return (
      <>
        <AppBar />
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route exact path={routes.home} component={HomePage} />
            <PublicRoute
              path={routes.register}
              restricted
              redirectTo={routes.contacts}
              component={Register}
            />
            <PublicRoute
              path={routes.login}
              restricted
              redirectTo={routes.contacts}
              component={Login}
            />
            <PrivateRoute
              path={routes.contacts}
              redirectTo={routes.login}
              component={Contacts}
            />
          </Switch>
        </Suspense>

        <ToastContainer />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoadingContacts: selectors.getIsLoading(state),
});

const mapDispatchToProps = {
  onGetCurrentUser: authOperations.getCurrentUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
