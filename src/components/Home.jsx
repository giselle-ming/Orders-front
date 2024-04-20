import { useEffect, useState } from 'react';
import { useToken } from '../context/TokenContext';
import { useNavigate } from 'react-router-dom';
import CheckToken from '../auth/CheckToken';
import { Button } from 'primereact/button';
import '../Styles/Home.css'
import { Card } from 'primereact/card';
import { Tooltip } from 'primereact/tooltip';
import data from '../data.js';

export default function People() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(data.pizzas);
  const [token, setToken] = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(products);
    const url = `https://orders-api-dx4t.onrender.com/api/order`;
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json'
      }
    })
      .then((resp) => {
        if (resp.status === 401) throw new Error('Unauthorized access to API.');
        if (!resp.ok) throw new Error('Invalid response.');
        return resp.json();
      })
      .then((data) => {
        setOrders(data.data);
      })
      .catch((error) => {
        console.warn(error.message);
      });
  }, [token, navigate, setToken]);

  return (
    <section>
      <CheckToken />
      <h2>Ordenes</h2>
      <div className='container'>
        <div className='row'>
          <div className='col'>
            <div>
              {orders.map((order) => (
                <Card key={order._id} title={order._id} className='cardP'>
                  <p className="m-0 p-0">Total: {order.total}</p>
                  <div className='flex gap-4'>
                    <Button icon='pi pi-user-edit' rounded severity="secondary" raised onClick={(ev) => navigate(`/orders/${order._id}/edit`)}/>
                    <Button icon='pi pi-trash' className='btn' rounded severity="secondary" raised onClick={(ev) => deleteOrder(order._id)}/>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}