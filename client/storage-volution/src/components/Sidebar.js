import { Link } from "react-router-dom";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { MDBLink, MDBTypography } from "mdbreact";

export default function Sidebar({showSidebar}) {
  const role = localStorage.getItem("role");
  return (
    <>
      <nav id="sidebar" className={showSidebar ? "active" : null}>
        <div className="sidebar-header"></div>

        <ul className="list-unstyled ">
          {/* <p className="text-center">{localStorage.getItem("role")}</p> */}
          <li>
            <MDBLink to="/main" link>
              <MDBTypography colorText="blue" tag="h5">
                Dashboard
              </MDBTypography>
            </MDBLink>
            {/* <Link to="/main">Dashboard</Link> */}
          </li>
          {role === "buyer" && (
            <>
              <li>
                <Link to="/main/addPO">Create PO</Link>
              </li>
              <li>
                <Link to="/main/request">Requests</Link>
              </li>
              <li>
                <Link to="/main/addRequest">Create Request</Link>
              </li>
            </>
          )}
          {role === "warehouseadmin" && (
            <>
              <li>
                <Link to="/main/request">Requests</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}