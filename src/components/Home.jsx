import { useEffect, useState } from 'react';
import { useToken } from '../context/TokenContext';
import { useNavigate } from 'react-router-dom';
import CheckToken from '../auth/CheckToken';
import { Button } from 'primereact/button';
import '../Styles/Home.css'
import { Card } from 'primereact/card';
import { Tooltip } from 'primereact/tooltip';

export default function People() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useToken();
  const navigate = useNavigate();

  useEffect(() => {
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

  useEffect(() => {
    const url = `https://orders-api-dx4t.onrender.com/api/product`;
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
        setProducts(data.data);
      })
      .catch((error) => {
        console.warn(error.message);
      });
  }, [token, navigate, setToken]);

  return (
    <section>
      <CheckToken />
      <h2>Inicio</h2>
      <div className='container'>
        <div className='row'>
          <div className='col'>
            <h3>Ordenes</h3>
            <div>
              {orders.map((order) => (
                <Card key={order._id} title={order.date} className='cardP'>
                  <p className="m-0 p-0">Price: {order.price}</p>
                  <div className='flex gap-4'>
                    <Button icon='pi pi-user-edit' rounded severity="secondary" raised onClick={(ev) => navigate(`/orders/${order._id}/edit`)}/>
                    <Button icon='pi pi-trash' className='btn' rounded severity="secondary" raised onClick={(ev) => deleteOrder(order._id)}/>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className='col'>
            <h3>Productos</h3>
            <div>
              {products.map((product) => (
                <Card key={product._id} title={product.name} className='cardP'>
                  <p className="m-0 p-0">Ingredientes: {product.ingredients ? product.ingredients.join(', ') : 'N/A'}</p>
                  <p className="m-0 p-0">Price: {Number(product.price).toFixed(2)}</p>
                  <div className='flex gap-4'>
                    <Button icon='pi pi-user-edit' rounded severity="secondary" raised onClick={(ev) => navigate(`/products/${product._id}/edit`)}/>
                    <Button icon='pi pi-trash' className='btn' rounded severity="secondary" raised onClick={(ev) => deleteProduct(product._id)}/>
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