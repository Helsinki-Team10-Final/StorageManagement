import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  Row
} from "react-bootstrap";
import {useHistory} from 'react-router-dom'
import logo from '../assets/img/StorageVolution.png'

export default function Navigation({showSidebar, setShowSidebar}) {
  const history = useHistory()
  const logout = ()  => {
    localStorage.removeItem('name')
    localStorage.removeItem('role')
    localStorage.removeItem('access_token')
    history.push('/login')
  }
  return (
    <>
      <Navbar variant="dark" style={{background: "#2D3748"}}>
        <Navbar.Brand href="" onClick={() => { setShowSidebar(!showSidebar) }}>
          <i className={showSidebar ? 'fas fa-angle-right' : 'fas fa-angle-left'} style={{fontSize:"1.2em"}}></i>
          <img
            src={logo}
            height="30vh"
            className="ml-5"
          />
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <Row>
              <h4 className="mx-4 text-light">
                Logged as <span style={{textTransform: "capitalize"}}>{localStorage.getItem("name")}</span> - <span style={{textTransform: "capitalize"}}>{localStorage.getItem("role")}</span>
              </h4>
            </Row>
            
          </Navbar.Text>
          <Nav.Item className="ml-3">
            <Nav.Link className="btn btn-danger" onClick={logout}>Logout</Nav.Link>
          </Nav.Item>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}