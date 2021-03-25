import React from "react";

import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavItem,
  MDBNavLink,
  MDBContainer,
  MDBMask,
  MDBView,
  MDBIcon,
} from "mdbreact";
import { Link } from "react-router-dom";
// import logo from "../logo.svg";
// import hero1 from '../assets/img/h1_hero1.png';
// import hero1 from "../assets/img/storage.jpg";
import hero1 from "../assets/img/Asset_4.jpg";
import logo from "../assets/img/StorageVolution.png";

class FullPageIntroWithNonFixedTransparentNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  render() {
    return (
      <div>
        <header>
          <MDBView src={hero1}>
            <MDBNavbar dark expand="md">
              <MDBContainer fluid>
                <MDBNavbarBrand>
                  <img src={logo} height="30vh" className="ml-1" />
                </MDBNavbarBrand>
                <MDBNavbarToggler onClick={this.onClick} />
                <MDBCollapse isOpen={this.state.collapse} navbar>
                  <MDBNavbarNav right>
                    <MDBNavItem>
                      <Link className="btn btn-primary" to="/login">
                        Login
                      </Link>
                    </MDBNavItem>
                  </MDBNavbarNav>
                </MDBCollapse>
              </MDBContainer>
            </MDBNavbar>

            <div className="flex-center flex-column text-white text-center" style={{width:"100vw", height:"100vh"}}>
              <div className="rounded" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
                <div className="p-5">
                  <h2 className="text-white" style={{ width: "55vw", fontWeight: "800" }}>
                    Storage Volution
                  </h2>

                  <br />
                  <p className="text-white" style={{ width: "55vw" }}>
                    A platform built as a digitalization of goods delivery management from a warehouse. Conventional systems often cause human errors
                    that are difficult to track so hopefully this platform can provide an efficient solution to make the delivery management system in
                    a warehouse to be systematic and effective.
                  </p>
                </div>
              </div>
            </div>
          </MDBView>
        </header>
      </div>
    );
  }
}

export default FullPageIntroWithNonFixedTransparentNavbar;

// import '../assets/css/landingPage.css';
// import logo from '../logo.svg';
// // import hero1 from '../assets/img/h1_hero1.png';
// import hero1 from "../assets/img/storage.jpg";
// import { Link } from 'react-router-dom'

// export default function LandingPage () {
//   return (
//     <div className="App">
//       <header>
//         <div className="header-area header-transparent">
//             <div className="main-header ">
//                 <div className="header-bottom  header-sticky">
//                     <div className="container-fluid">
//                         <div className="row align-items-center">
//                             <div className="col-xl-2 col-lg-2">
//                                 <div className="logo">
//                                     <a href="index.html"><h1 className="text-white">StorageVolution</h1></a>
//                                 </div>
//                             </div>
//                             <div className="col-xl-10 col-lg-10">
//                                 <div className="menu-wrapper  d-flex align-items-center justify-content-end">
//                                     <div className="main-menu d-none d-lg-block">
//                                         <nav>
//                                             <ul id="navigation">
//                                                 <li>
//                                                     <div className="header-right-btn ml-40">
//                                                         <Link to="/login" className="btn"
//                                                           style={{
//                                                             border: "none",
//                                                             padding: "18px 31px !important",
//                                                             textTransform: "uppercase !important",
//                                                             borderRadius: "0px",
//                                                             fontSize: "16px !important",
//                                                             fontWeight: "500 !important",
//                                                             display: "inline-block !important",
//                                                             color: "#fff !important",
//                                                             boxShadow: "0px 7px 21px 0px rgb(0 0 0 / 12%)",
//                                                             backgroundImage: "linear-gradient(to left, #FF5F21, #e6571e, #FF5F21)",
//                                                             backgroundPosition: "right",
//                                                             backgroundSize: "200%"
//                                                           }}
//                                                         >
//                                                           Login
//                                                         </Link>
//                                                     </div>
//                                                 </li>
//                                             </ul>
//                                         </nav>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </header>
//     <main>

//         <section className="slider-area" style={{backgroundImage: `url(${hero1})`}}>
//             <div className="slider-active">

//                 <div className=" slider-bg1 hero-overly slider-height d-flex align-items-center" style={{height: "100vh"}}>
//                     <div className="container" style={{color: "black"}}>
//                         <div className="row justify-content-center">
//                             <div className="col-xl-8 col-lg-9 col-md-12">
//                                 <div className="hero__caption text-center">
//                                     <h1 data-animation="bounceIn" data-delay="0.2s">Storage Volution</h1>
//                                     <p data-animation="fadeInUp" data-delay="0.4s">A platform built as a digitalization of goods delivery management from a warehouse. Conventional systems often cause human errors that are difficult to track so hopefully this platform can provide an efficient solution to make the delivery management system in a warehouse to be systematic and effective.</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>

//       </main>
//     </div>
//   );
// }
