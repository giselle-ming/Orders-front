import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToken } from '../context/TokenContext'; // Import useToken hook

function ReviewOrder() {
  const [order, setOrder] = useState(null);
  const [token] = useToken(); // Use the useToken hook to get the token
  const params = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`https://orders-api-dx4t.onrender.com/api/order/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrder(data.data);
        } else {
          console.log('Error fetching order');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrder();
  }, [params.id, token]); // Add token to the dependency array

  // Function to format date as "dd-mm-yyyy hh:mm"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return formattedDate;
  };

  return (
    <>
      <h2>Detalle de la Orden</h2>
      {order && (
        <div>
          <h3>Fecha: {formatDate(order.date)}</h3>
          <div>
            <h3>Factura</h3>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid black', padding: '10px' }}>Producto</th>
                  <th style={{ border: '1px solid black', padding: '10px' }}>Tamaño</th>
                  <th style={{ border: '1px solid black', padding: '10px' }}>Precio</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid black', padding: '10px' }}>{product.name}</td>
                    <td style={{ border: '1px solid black', padding: '10px' }}>{product.size}</td>
                    <td style={{ border: '1px solid black', padding: '10px' }}>{product.price}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2" style={{ border: '1px solid black', padding: '10px', textAlign: 'right' }}>Total:</td>
                  <td style={{ border: '1px solid black', padding: '10px' }}>{order.total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default ReviewOrder;
