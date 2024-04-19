import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyles from './Styles/GlobalStyle';
import { TokenProvider } from './context/TokenContext';


ReactDOM.createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <TokenProvider>
    <GlobalStyles></GlobalStyles>
    <App />
    </TokenProvider>
  </BrowserRouter>,
)
