import { useContext, createContext, useState, useEffect } from 'react';

const TokenContext = createContext();

function TokenProvider(props) {
  const [token, setToken] = useState(null);
  const tokenKey = "Login";

  useEffect(() => {
    const storedToken = sessionStorage.getItem(tokenKey);
    if (storedToken) {
      setToken(storedToken);
    }
    if (!storedToken && token) {
      sessionStorage.setItem(tokenKey, token);
    }
    if (!token) {
      sessionStorage.removeItem(tokenKey);
    }
  }, [token, tokenKey]);

  return <TokenContext.Provider value={[token, setToken]} {...props} />;
}

function useToken() {
  const context = useContext(TokenContext);
  if (!context) throw new Error('No Token Context');
  return context;
}

export { TokenProvider, useToken };