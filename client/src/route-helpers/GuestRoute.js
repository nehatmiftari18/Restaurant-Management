import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const GuestRoute = ({ component: Component, token, ...rest }) => (
  <Route
    {...rest}
    render={props => (token ? <Redirect to="/" /> : <Component {...props} />)}
  />
);

const mapStateToProps = (reducer ) => {
	const { token } = reducer;
	return { token }
};

export default connect(mapStateToProps)(GuestRoute);
