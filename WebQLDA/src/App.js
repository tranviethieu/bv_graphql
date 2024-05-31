
import { EmptyLayout, LayoutRoute, MainLayout } from './Layout';

import LoginPage from 'pages/LoginPage';
// pages
import AdminDashboard from 'pages/AdminDashboard';
import ProfilePage from 'pages/profiles/ProfilePage';
import MenuPage from 'pages/Menu/MenuPage';
import AccountPage from 'pages/Account/AccountPage';
import AccountEditPage from 'pages/Account/AccountEditPage';
import DepartmentPage from 'pages/departments/DepartmentsApp';
import EditDepartment from 'pages/departments/EditDepartment';
import Test from 'pages/Test'
import Project from 'pages/Project/Project'
import SlugPage from 'pages/Slug/Slug'
//import TestUploadFile from 'pages/Test/TestUploadFile';
import React from 'react';
import componentQueries from 'react-component-queries';
import { Redirect, Switch, BrowserRouter } from 'react-router-dom';
import 'styles/reduction.css';
import "react-table/react-table.css";
// import "react-datepicker/dist/react-datepicker.css"
// import "react-tabs/style/react-tabs.css";
import "pretty-checkbox/src/pretty-checkbox.scss"
// import "react-month-picker/css/month-picker.css"
import { ApolloProvider } from 'react-apollo'
import { client } from './utils/apolloConnect';
import { GetLocalToken } from "./Constants";


import ProjectEdit from './pages/Project/ProjectEdit';

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};
class App extends React.Component {
  constructor() {

    super();
    console.log("load AppCompany");
  }

  render() {
    var token = GetLocalToken();
    var accessToken = "";
    try {
      accessToken = token.access_token;
    } catch (err) { }
    return (

      <BrowserRouter basename={getBasename()}>
        <ApolloProvider client={client}>
          <Switch>
            <LayoutRoute
              exact
              path="/login"
              layout={EmptyLayout}
              component={props => (
                <LoginPage {...props} />
              )}
            />

            <LayoutRoute
              exact
              path="/menu"
              layout={MainLayout}
              component={MenuPage}
            />
            <LayoutRoute
              exact
              path="/slug"
              layout={MainLayout}
              component={SlugPage}
            />
            <LayoutRoute
              exact
              path="/department"
              layout={MainLayout}
              component={DepartmentPage}
            />
            <LayoutRoute
              exact
              path="/department/:_id"
              layout={MainLayout}
              component={EditDepartment}
            />
            <LayoutRoute
              exact
              path="/test"
              layout={MainLayout}
              component={Test}
            />
            <LayoutRoute
              exact
              path="/project"
              layout={MainLayout}
              component={Project}
            />
            <LayoutRoute
              exact
              path="/project-edit"
              layout={MainLayout}
              component={ProjectEdit}
            />
            <LayoutRoute
              exact
              path="/project-edit/:_id"
              layout={MainLayout}
              component={ProjectEdit}
            />

            <LayoutRoute
              exact
              path="/account"
              layout={MainLayout}
              component={AccountPage}
            />
            <LayoutRoute
              exact
              path="/account-edit"
              layout={MainLayout}
              component={AccountEditPage}
            />
            <LayoutRoute
              exact
              path="/account-edit/:_id"
              layout={MainLayout}
              component={AccountEditPage}
            />
            <LayoutRoute
              exact
              path="/profile"
              layout={MainLayout}
              component={ProfilePage}
            />

            <LayoutRoute
              exact
              path="/home"
              layout={MainLayout}
              component={AdminDashboard}
            />

            <Redirect to="/home" />
          </Switch>

        </ApolloProvider>
      </BrowserRouter>
    );
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
