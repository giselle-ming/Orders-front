import { useNavigate } from 'react-router-dom';
import { useToken } from '../context/TokenContext';
import { Button } from 'primereact/button';

export default function Logout() {
  const navigate = useNavigate();
  const [token, setToken] = useToken();

  function doLogout() {
    // Remove the token from session storage
    sessionStorage.removeItem('Login');
    setToken(null);
    navigate('/');
  }

  return (
    <div>
      <Button icon="pi pi-sign-out" rounded text raised severity="secondary" onClick={doLogout} tooltip="Log out" tooltipOptions={{ position: 'bottom' }}/>
    </div>
  );
}