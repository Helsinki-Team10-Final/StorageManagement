import './App.css';
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import {Switch, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <ToastContainer />
      <Switch>
        <Route exact path="/">
          <LandingPage />
          {/* <Login /> */}
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route path="/main">
          <Dashboard />
        </Route>
        
      </Switch>
    </>
  );
}

export default App;
