import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useToken } from '../context/TokenContext';
import '../Styles/Login.css';
import { Button } from 'primereact/button';
import { useState } from 'react';

function Login() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [token, setToken] = useToken();
  const [option, setOption] = useState('home');

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      navigate('/home');
    }
    // check if token already exists in context
    if (token) {
      navigate('/home');
    }
  }, []);

function doLogin() {
  const redirect = `https://pizzaordenes.netlify.app/`;
  //const redirect = `http://localhost:5173/`;
  const baseURL = `https://orders-api-dx4t.onrender.com/auth/google?redirect_url=${redirect}`; //callback

  location.href = baseURL;

  addEventListener('message', async (event) => {
    if (event.origin === 'https://giftr.onrender.com') {
      const { token } = event.data;
      sessionStorage.setItem(token);
      navigate(redirect);
    }
  });
}

  return (
    <div className='logIn container flex flex-column justify-content-center align-content-center gap-2 align-items-center'>
      <img src='login.jpeg' className='gifts'></img>
      <p>Ingresa para continuar</p>
      <div className='google flex justify-content-center align-content-center gap-2 align-items-center'>
        <img src="google-icon.png" alt="google" />
        <Button label="Ingresa con Google" rounded text onClick={doLogin} />
      </div>
    </div>
  );
}

export default Login;