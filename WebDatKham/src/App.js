
import { EmptyLayout, LayoutRoute } from './Layout';
import React from 'react';
import componentQueries from 'react-component-queries';
import { Redirect, Switch, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ApolloProvider } from 'react-apollo'
import { client } from './utils/apolloConnect';

import ExaminationBooking from './App/ExaminationBooking/ExaminationBooking'
import ExaminationBookingMeApp from './App/ExaminationBooking/ExaminationBookingMeApp'

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};
class App extends React.Component {

  constructor() {

    super();
    console.log("load AppCompany");
  }

  render() {
    return (

      <BrowserRouter basename={getBasename()}>
        <ApolloProvider client={client}>
          <ToastContainer autoClose={4000} position={"top-right"} />
          <Switch>
            <LayoutRoute
              exact
              path="/"
              layout={LayoutRoute}
              component={process.env.REACT_APP_MEAPP === 'true' ? ExaminationBookingMeApp : ExaminationBooking}
            />
            <Redirect to="/" />
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
