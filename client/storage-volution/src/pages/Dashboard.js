import {Switch, Route, Link, useLocation, useRouteMatch, useHistory} from 'react-router-dom'
import { useState, useEffect } from 'react';
import '../assets/css/dashboard.css'
import Navigation from '../components/Navigation' //masih belom seelesai
import Sidebar from '../components/Sidebar' //masih belom seelesai
import CreatePO from './CreatePO'
import ListPO from './ListPO'
import ListPOK from './ListPOK'
import DetailPO from './DetailPO'
import ListBroadcast from './ListBroadcast'
import Checking from './Checking'
import Picking from './Picking'
import ListRequest from './ListRequest'
import DetailRequest from './DetailRequest'
import CreateRequestBroadcast from './CreateRequestBroadcast'
import RequestStore from './RequestStore';

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
          <Route path={`${path}/request/createBroadcast/:id`}>
            <CreateRequestBroadcast />
          </Route>
          <Route path={`${path}/request/:id`}>
            <DetailRequest />
          </Route>
          <Route path={`${path}/request`}>
            <ListRequest />
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
          {/* <Route path={`${path}/listBroadcast`}>
            
          </Route> */}
          <Route path={`${path}/picking/:id`}>
            {/* <h1>Broadcast Detail</h1> */}
            <Picking />
          </Route>
          <Route exact path={`${path}`}>
            <ListBroadcast type="picker"/>
          </Route>
          <Route>
            <h1>Page Not Found</h1>
          </Route>
        </Switch>
      </div>
    </div>
    
  </>

  const buyer = (
    <>
      <Navigation showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="wrapper">
        <Sidebar showSidebar={showSidebar} />
        <div className="container-fluid mx-4 my-3">
          {/* Lokasi SwitchRoute Child */}
          <Switch>
            <Route path={`${path}/addRequest`}>
              <RequestStore />
            </Route>
            <Route path={`${path}/request/:id`}>
              <DetailRequest />
            </Route>
            <Route path={`${path}/request`}>
            <ListRequest />
          </Route>
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
  );

  const checker = <>
    <Navigation showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
    <div className="wrapper">
      <Sidebar showSidebar={showSidebar} />
      <div className="container-fluid mx-4 my-3">
        {/* Lokasi SwitchRoute Child */}
        <Switch>
          <Route path={`${path}/checking/:id`}>
            {/* <h1>Broadcast Detail</h1> */}
            <Checking />
          </Route>
          <Route exact path={`${path}`}>
            <ListBroadcast type="checker"/>
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
            <Route path={`${path}/listPO`}>
              <ListPO />
            </Route>
            <Route path={`${path}/addPO`}>
              <CreatePO />
            </Route>
            <Route path={`${path}/:id`}>
              <DetailPO />
            </Route>
            <Route exact path={`${path}`}>
              <h1 className="mb-5">Masuk Dashboard</h1>
              <Link className="btn btn-primary" to="/main/addPO">
                Create PO
              </Link>
              <br />
              <br />
              <Link className="btn btn-primary" to="/main/listPO">
                list PO
              </Link>
            </Route>
          </Switch>
        </div>
      </div>
    </>
  );
}