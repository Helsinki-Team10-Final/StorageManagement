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
          {/* <p className="text-center">{localStorage.getItem("role")}</p> */}
          <li>
            <Link to="/main">Dashboard</Link>
          </li>
          <li>
            <Link to="/main/addPO">Create PO</Link>
          </li>
          <li>
            <Link to="/main/605719582782d941a0679fe1">Detail</Link>
          </li>
        </ul>
      </nav>
    </>
  )
}