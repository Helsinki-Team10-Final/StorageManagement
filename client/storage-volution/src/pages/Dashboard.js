import { useState, useEffect } from 'react';
import '../assets/css/dashboard.css'
import Navigation from '../components/Navigation'
import Sidebar from '../components/Sidebar'
import CreatePO from './CreatePO'

export default function Dashboard(props) {
  const [showSidebar, setShowSidebar] = useState(false)
  
  return (
    <>
      <Navigation showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="wrapper">
        <Sidebar showSidebar={showSidebar} />
        <div className="container-fluid mx-5 my-3">
          <h1>Masuk Dashboard</h1>
          <CreatePO />
          {/* Lokasi SwitchRoute Child */}
        </div>
      </div>
      
    </>
  )
}