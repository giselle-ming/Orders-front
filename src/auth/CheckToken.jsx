import { useToken } from "../context/TokenContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckToken() {
  const [token, setToken] = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return null;
}