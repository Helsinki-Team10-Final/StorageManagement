import { Link } from "react-router-dom";
import { DropdownButton, Dropdown } from "react-bootstrap";

export default function Sidebar({showSidebar}) {
  return (
    <>
      <nav id="sidebar" className={showSidebar ? "active" : null}>
        <div className="sidebar-header">
          <h3>Bootstrap Sidebar</h3>
        </div>

        <ul className="list-unstyled components">
          <p>Dummy Heading</p>
          <li className="active">
            <a
              href="#homeSubmenu"
              data-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
            >
              Home
            </a>
            <ul className="collapse list-unstyled" id="homeSubmenu">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/topics">Topics</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
          <DropdownButton id="dropdown-basic-button" title="Dropdown button">
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </DropdownButton>
          </li>
          <li>
            <a href="#">Portfolio</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </nav>
    </>
  )
}