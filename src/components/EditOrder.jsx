import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function EditOrder() {
  const [order, setOrder] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`https://orders-api-dx4t.onrender.com/api/order/${params.id}`);
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
  }, [params.id]);

  return (
    <>
      <h2>Detalle de la Orden</h2>
      {order && (
        <div>
          <h3>Productos:</h3>
          <ul>
            {order.products.map((product, index) => (
              <li key={index}>{product.name} - Tamaño: {product.size} - Precio: {product.price}</li>
            ))}
          </ul>
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

export default EditOrder;
