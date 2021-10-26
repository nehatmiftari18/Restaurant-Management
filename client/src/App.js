import { Switch } from "react-router-dom";

import GuestRoute from "route-helpers/GuestRoute";
import PrivateRoute from "route-helpers/PrivateRoute";

import Login from "views/pages/Login";
import Register from "views/pages/Register";
import Layout from "layouts/Layout";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import 'react-datepicker/dist/react-datepicker.css';
import "rc-slider/assets/index.css";

function App() {
  return (
    <>
      <Switch>
        <GuestRoute exact path="/login" name="Login Page" component={ Login } />
        <GuestRoute exact path="/register" name="Register Page" component={ Register } />
        <PrivateRoute path="/" name="Home" component={ Layout } /> 
      </Switch>
    </>
  );
}

export default App;
