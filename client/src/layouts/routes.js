import Restaurants from "views/Restaurant/List";
import AddRestaurant from "views/Restaurant/Add";
import RestaurantDetails from "views/Restaurant/Detail";
import EditRestaurant from "views/Restaurant/Edit";
import Users from "views/User/List";
import AddUser from "views/User/Add";
import EditUser from "views/User/Edit";
import PendingReviews from "views/Review/List";
import Profile from "views/User/Profile";
import Password from "views/User/Password";
import Layout from "layouts/Layout";
import Page404 from "views/pages/Page404";

const routes = [
  {
    path: '/', 
    exact: true, 
    name: '', 
    component: Layout
  }, { 
    path: '/restaurants', 
    name: 'Restaurants', 
    component: Restaurants 
  }, { 
    path: '/restaurant/detail/:id', 
    name: 'Restaurant Details', 
    component: RestaurantDetails
  }, {
    path: '/restaurant/add', 
    name: 'Add Restaurant', 
    component: AddRestaurant, 
    roles: ['admin', 'owner'],
  }, {
    path: '/restaurant/edit/:id', 
    name: 'Edit Restaurant', 
    component: EditRestaurant, 
    roles: ['admin', 'owner'],
  }, {
    path: '/users', 
    name: 'Users', 
    component: Users, 
    roles: ['admin'],
  }, {
    path: '/user/add', name: 'Add User', component: AddUser, roles: ['admin'],
  }, {
    path: '/user/edit/:id', name: 'Edit User', component: EditUser, roles: ['admin'],
  }, {
    path: '/reviews-pending', 
    name: 'Pending Reviews', 
    component: PendingReviews, 
    roles: ['owner'],
  }, { 
    path: '/profile', 
    name: 'Edit User', 
    component: Profile 
  }, { 
    path: '/password', 
    name: 'Change Password', 
    component: Password 
  }, {
    path: '',
    name: 'Page 404',
    component: Page404
  }
];
  
export default routes;
  