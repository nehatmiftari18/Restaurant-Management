import React from "react";
import { useLocation, Switch } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "components/Navbars/Navbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";

import getNavigationItems from "components/Navbars/nav";
import routes from "./routes";

import sidebarImage from "assets/img/sidebar-3.jpg";
import RoleRoute from "route-helpers/RoleRoute";

function Layout() {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);

  const user = useSelector(state => state.user);

  const getRoutes = (routes) => {
    return routes.map((route, key) => {
      if (route.component) {
        return (
          <RoleRoute
            path={route.path}
            exact={route.exact}
            name={route.name}
            roles={route.roles}
            component = {route.component}
            key={key}
          />
        );
      } else {
        return null;
      }
      
    });
  };
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      element.parentNode.removeChild(element);
    }
  }, [location]);

  return (
    <>
      <div className="wrapper">
        <Sidebar color={color} image={hasImage ? image : ""} routes={getNavigationItems(user.role).items} />
        <div className="main-panel" ref={mainPanel}>
          <Navbar />
          <div className="content">
            <Switch>
              {getRoutes(routes)}
            </Switch>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Layout;
