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

  const deleteOrder = (orderId) => {
    // Function to delete the order
    const confirmDelete = window.confirm("Estas seguro que quieres eliminar esta orden?");
    if (!confirmDelete) return; // If user cancels, exit

    const url = `https://orders-api-dx4t.onrender.com/api/order/${orderId}`;
    fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((resp) => {
      if (resp.ok) {
        console.log('Order deleted successfully');
        // Remove the deleted order from the state
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      } else {
        console.log('Error deleting order');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };

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
              {orders.map((order) => {
                // Convert the date to dd/mm/yyyy format
                const date = new Date(order.date);
                const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

                return (
                  <Card key={order._id} title={`${order._id} - ${formattedDate}`} className='cardP'>
                    <p className="m-0 p-0">Total: {order.total}</p>
                    {order.products.map((product, index) => (
                      <p key={index}>{product.name}</p>
                    ))}
                    <div className='flex gap-4'>
                      <Button icon='pi pi-search-plus' label="Ver Factura" rounded severity="secondary" raised onClick={(ev) => navigate(`/order/${order._id}/review`)}/>
                      <Button icon='pi pi-trash' label="Eliminar" className='btn' style={{ background: 'red' }} rounded severity="secondary" raised onClick={(ev) => deleteOrder(order._id)}/>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
