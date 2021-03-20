import './App.css';
import Login from './pages/Login'
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
          <Login />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        
      </Switch>
    </>
  );
}

export default App;
