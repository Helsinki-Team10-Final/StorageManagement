import {Switch, Route, Link, useLocation, useRouteMatch, useHistory} from 'react-router-dom'
import { useState, useEffect } from 'react';
import '../assets/css/dashboard.css'
import Navigation from '../components/Navigation' //masih belom seelesai
import Sidebar from '../components/Sidebar' //masih belom seelesai
import CreatePO from './CreatePO'
import ListPOK from './ListPOK'
import DetailPO from './DetailPO'

export default function Dashboard(props) {
  const [currentRole, setCurrentRole] = useState('')
  const history = useHistory()
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    const {name, role, access_token} = localStorage
    if (!name || !role || !access_token) {
      history.push('/login')
    } else {
      setCurrentRole(role)
    }
  }, [history])
  
  const warehouseadmin = <>
    <Navigation showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
    <div className="wrapper">
      <Sidebar showSidebar={showSidebar} />
      <div className="container-fluid mx-4 my-3">
        {/* Lokasi SwitchRoute Child */}
        <Switch>
          <Route path={`${path}/addPO`}>
            <CreatePO />
          </Route>
          <Route path={`${path}/:id`}>
            <DetailPO />
          </Route>
          <Route exact path={`${path}`}>
            <ListPOK />
          </Route>
        </Switch>
      </div>
    </div>
    
  </>

  const picker = <>
    <Navigation showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
    <div className="wrapper">
      <Sidebar showSidebar={showSidebar} />
      <div className="container-fluid mx-4 my-3">
        {/* Lokasi SwitchRoute Child */}
        <Switch>
          <Route exact path={`${path}`}>
            <h1>List BroadCast dari Picker</h1>
          </Route>
          <Route>
            <h1>Page Not Found</h1>
          </Route>
        </Switch>
      </div>
    </div>
    
  </>

  const buyer = <>
    <Navigation showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
    <div className="wrapper">
      <Sidebar showSidebar={showSidebar} />
      <div className="container-fluid mx-4 my-3">
        {/* Lokasi SwitchRoute Child */}
        <Switch>
          <Route path={`${path}/addPO`}>
            <CreatePO />
          </Route>
          <Route path={`${path}/:id`}>
            <DetailPO />
          </Route>
          <Route exact path={`${path}`}>
            <ListPOK />
          </Route>
        </Switch>
      </div>
    </div>
    
  </>

  const checker = <>
    <Navigation showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
    <div className="wrapper">
      <Sidebar showSidebar={showSidebar} />
      <div className="container-fluid mx-4 my-3">
        {/* Lokasi SwitchRoute Child */}
        <Switch>
          <Route exact path={`${path}`}>
            <h1>List BroadCast dari checker</h1>
          </Route>
          <Route>
            <h1>Page Not Found</h1>
          </Route>
        </Switch>
      </div>
    </div>
    
  </>

  const loader =  <>
    <Navigation showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
    <div className="wrapper">
      <Sidebar showSidebar={showSidebar} />
      <div className="container-fluid mx-4 my-3">
        {/* Lokasi SwitchRoute Child */}
        <Switch>
          <Route exact path={`${path}`}>
            <h1>List BroadCast dari loader</h1>
          </Route>
          <Route>
            <h1>Page Not Found</h1>
          </Route>
        </Switch>
      </div>
    </div>
    
  </>

  switch (currentRole) {
    case 'picker':
      return picker
    case 'checker':
      return checker
    case 'buyer':
      return buyer
    case 'warehouseadmin':
      return warehouseadmin
    case 'loader':
      return loader
  
    default:
      return (<h1>User Not Found</h1>)
  }

  
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
            <Route path={`${path}/:id`}>
              <DetailPO />
            </Route>
            <Route exact path={`${path}`}>
              <ListPOK />
            </Route>
          </Switch>
        </div>
      </div>
      
    </>
   
  )
}