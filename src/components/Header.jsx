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
          <h1>Pizzas-Caracas</h1>
        </header>
      </div>
    )
  } else if (location.pathname === '/home') {
    return (
    <div>
      <header>
        <Logout />
        <h1>Pizzas-Caracas</h1>
<div style={{ display: 'flex', gap: '10px' }}>
  <Button rounded text raised severity="secondary" onClick={(ev) => navigate(`order/addOrder`)}>
    Agregar Orden
  </Button>
</div>
      </header>
    </div>
    )
  } else if (location.pathname.endsWith('/order')) {
    return (
      <div>
        <header>
          <Button icon="pi pi-arrow-left" rounded text raised severity="secondary" onClick={(ev) => navigate(`/home`)} tooltip="Regresar" tooltipOptions={{ position: 'bottom' }}/>
          <h1>Pizzas-Caracas</h1>
        </header>
      </div>
    )
  } else {
    return (
      <div>
        <header>
          <Button icon="pi pi-arrow-left" rounded text raised severity="secondary" onClick={(ev) => navigate(`/home`)} tooltip="Regresar" tooltipOptions={{ position: 'bottom' }}/>
          <h1>Pizzas-Caracas</h1>
        </header>
      </div>
    )
  }
}
