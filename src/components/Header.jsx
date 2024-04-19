import React from 'react';
import { Button } from 'primereact/button';
import '../assets/theme.css';
import "primeicons/primeicons.css";                                          
import '../Styles/Header.css'
import Logout from './Logout';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/') {
    return (
      <div>
        <header>
          <h1>GIFT APP</h1>
        </header>
      </div>
    )
  } else if (location.pathname === '/people') {
    return (
      <div>
        <header>
          <Logout />
          <h1>GIFT APP</h1>
          <Button icon="pi pi-plus" rounded text raised severity="secondary" onClick={(ev) => navigate(`people/addPeople`)} tooltip="Add/Edit person" tooltipOptions={{ position: 'bottom' }}/>
        </header>
      </div>
    )
  } else if (location.pathname.endsWith('/gifts')) {
    return (
      <div>
        <header>
          <Button icon="pi pi-arrow-left" rounded text raised severity="secondary" onClick={(ev) => navigate(`/people`)} tooltip="Back" tooltipOptions={{ position: 'bottom' }}/>
          <h1>GIFT APP</h1>
        </header>
      </div>
    )
  } else if (location.pathname.endsWith('/gifts/addGift')) {
    return (
      <div>
        <header>
          <Button icon="pi pi-arrow-left" rounded text raised severity="secondary" onClick={(ev) => navigate(-1)} tooltip="Back" tooltipOptions={{ position: 'bottom' }}/>
          <h1>GIFT APP</h1>
        </header>
      </div>
    )
  } else {
    return (
      <div>
        <header>
          <Button icon="pi pi-arrow-left" rounded text raised severity="secondary" onClick={(ev) => navigate(`/people`)} tooltip="Back" tooltipOptions={{ position: 'bottom' }}/>
          <h1>GIFT APP</h1>
        </header>
      </div>
    )
  }
}
