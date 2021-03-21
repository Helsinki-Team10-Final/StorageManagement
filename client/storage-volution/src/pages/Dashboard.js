import {Switch, Route, Link, useLocation, useRouteMatch} from 'react-router-dom'
import { useState, useEffect } from 'react';
import '../assets/css/dashboard.css'
import Navigation from '../components/Navigation' //masih belom seelesai
import Sidebar from '../components/Sidebar' //masih belom seelesai
import CreatePO from './CreatePO'

export default function Dashboard(props) {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const [showSidebar, setShowSidebar] = useState(false)
  
  return (
    <>
      <Navigation showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="wrapper">
        <Sidebar showSidebar={showSidebar} />
        <div className="container-fluid mx-4 my-3">
          {/* Lokasi SwitchRoute Child */}
          <Switch>
            <Route path={`${path}/addPO`}>
              <CreatePO />
            </Route>
            <Route exact path={`${path}`}>
              <h1 className="mb-5">Masuk Dashboard</h1>
              <Link className="btn btn-primary" to='/main/addPO' >
                Create PO
              </Link>
            </Route>
          </Switch>
        </div>
      </div>
      
    </>
  )
}