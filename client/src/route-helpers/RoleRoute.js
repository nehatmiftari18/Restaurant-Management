import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const RoleRoute = ({
  component: Component, user, roles, ...rest
}) => (
  <Route
    {...rest}
    render={props => (!roles || roles.length === 0 || roles.indexOf(user.role) >= 0 ? <Component {...props} /> : <Redirect to="/" />)
    }
  />
);

const mapStateToProps = (reducer ) => {
	const { token, user } = reducer;
	return { token, user }
};
export default connect(mapStateToProps)(RoleRoute);
