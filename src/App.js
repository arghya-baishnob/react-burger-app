import React, { useEffect, Suspense } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

// Lazy loading of Checkout Page
const Checkout = React.lazy(() => {
  return import('./containers/Checkout/Checkout');
});

// Lazy loading of Orders Page
const Orders = React.lazy(() => {
  return import('./containers/Orders/Orders');
});

// Lazy loading of Auth Page
const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth');
});

const app = props => {
  const { onTryAutoSignUp } = props;

  useEffect(() => {
    onTryAutoSignUp();
  }, [onTryAutoSignUp]);

  let routes = (
    <Switch>
      <Route path="/auth" exact render={(props) => <Auth {...props} />} />
      <Route path="/" exact component={BurgerBuilder} />
      <Redirect to="/" />
    </Switch>
  );

  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/checkout" render={(props) => <Checkout {...props} />} />
        <Route path="/orders" exact render={(props) => <Orders {...props} />} />
        <Route path="/logout" exact render={(props) => <Logout {...props} />} />
        <Route path="/auth" exact render={(props) => <Auth {...props} />} />
        <Route path="/" exact render={(props) => <BurgerBuilder {...props} />} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <div>
      <Layout>
        <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
      </Layout>
    </div>
  );
  
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignUp: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(app));
