import { Link } from "react-router-dom";
import { DropdownButton, Dropdown } from "react-bootstrap";
import {useState, useEffect} from 'react'
import { MDBLink, MDBTypography, MDBBadge, MDBContainer, MDBBox } from "mdbreact";

export default function Sidebar({showSidebar}) {
  const [roleColor, setRoleColor] = useState("")
  const role = localStorage.getItem("role");
  
  useEffect(() => {
    switch (role) {
      case "buyer":
        setRoleColor("blue")
        break;
      case "warehouseadmin":
        setRoleColor("default")
        break;
      case "checker":
        setRoleColor("secondary")
        break;
      case "picker":
        setRoleColor("dark")
        break;
      default:
        setRoleColor("info")
        break;
    }
  }, [role])

  return (
    <>
      <nav id="sidebar" className={showSidebar ? "active" : null}>
        <div className="sidebar-header"></div>
        <MDBContainer className="mx-3">
          <MDBBox style={{margin: 0, textTransform: "capitalize"}} tag="h3">{localStorage.getItem("name")}</MDBBox>
          <h5><MDBBadge style={{margin: 0, textTransform: "capitalize"}} color={roleColor}>{localStorage.getItem("role")}</MDBBadge></h5>
        </MDBContainer>
        <ul className="list-unstyled components">
          <li>
            <MDBLink to="/main" link>
              <MDBTypography className="mx-3" colorText="blue" tag="h5">
                Dashboard
              </MDBTypography>
            </MDBLink>
          </li>
          {role === "buyer" && (
            <>
              <li>
                <MDBLink to="/main/addPO" link>
                  <MDBTypography className="mx-3" colorText="blue" tag="h5">
                    Create PO
                  </MDBTypography>
                </MDBLink>
              </li>
              <li>
                <MDBLink to="/main/request" link>
                  <MDBTypography className="mx-3" colorText="blue" tag="h5">
                    Requests
                  </MDBTypography>
                </MDBLink>
              </li>
              <li>
                <MDBLink to="/main/addRequest" link>
                  <MDBTypography className="mx-3" colorText="blue" tag="h5">
                    Create Request
                  </MDBTypography>
                </MDBLink>
              </li>
            </>
          )}
          {role === "warehouseadmin" && (
            <>
              <li>
                <MDBLink to="/main/request" link>
                  <MDBTypography className="mx-3" colorText="blue" tag="h5">
                    Requests
                  </MDBTypography>
                </MDBLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}