import React, { useRef, useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useToken } from '../context/TokenContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import 'primeflex/primeflex.css';  
import '../Styles/AddEditOrder.css';

function EditOrder() {
  const [token, setToken] = useToken();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const params = useParams();
  const toast = useRef(null);

  useEffect(() => {
    const url = `https://orders-api-dx4t.onrender.com/api/order/${params.id || ''}`;
    fetch(`${url}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
    .then((resp) => {
      if (resp.ok) {
        return resp.json();
      } else {
        console.log('Error fetching order');
      }
    })
    .then((data) => {
      const order = data.data;
      if (order) {
        setSelectedProducts(order.products);
        setSelectedExtras(order.extras); // Set selected extras
        setTotal(order.total);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }, [params.id, token]);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedProducts, selectedExtras]);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    selectedProducts.forEach(product => {
      totalPrice += product.price;
    });
    selectedExtras.forEach(extra => {
      totalPrice += extra.price;
    });
    setTotal(totalPrice);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    
    const orderData = {
      products: selectedProducts,
      extras: selectedExtras,
      total: total
      // Add other necessary fields for the order
    };

    const url = `https://orders-api-dx4t.onrender.com/api/order/${params.id}`;
    fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
    .then((resp) => {
      if (resp.ok) {
        console.log('Order updated successfully');
        navigate('/home');
      } else {
        console.log('Error updating order');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };

  const handleDelete = (index) => {
    setSelectedProducts(prevState => {
      const newSelectedProducts = [...prevState];
      newSelectedProducts.splice(index, 1);
      return newSelectedProducts;
    });
  };

  const handleDeleteExtra = (index) => {
    setSelectedExtras(prevState => {
      const newSelectedExtras = [...prevState];
      newSelectedExtras.splice(index, 1);
      return newSelectedExtras;
    });
  };

  return (
    <>
      <h2>Editar Orden</h2>
      <form onSubmit={handleSubmit} className='flex flex-column flex-wrap gap-2 align-content-center justify-content-center align-self-start'>
        <div className="selected-products-table">
          <h3>Factura</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '10px' }}>Producto</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Tamaño</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Precio</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '10px' }}>{product.name}</td>
                  <td style={{ border: '1px solid black', padding: '10px' }}>{product.size}</td>
                  <td style={{ border: '1px solid black', padding: '10px' }}>{product.price}</td>
                  <td style={{ border: '1px solid black', padding: '10px' }}>
                    <Button 
                      icon="pi pi-trash" 
                      className="p-button-rounded p-button-danger" 
                      onClick={() => handleDelete(index)}
                    />
                  </td>
                </tr>
              ))}
              {selectedExtras.map((extra, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '10px' }}>{extra.name}</td>
                  <td style={{ border: '1px solid black', padding: '10px' }}>-</td>
                  <td style={{ border: '1px solid black', padding: '10px' }}>{extra.price}</td>
                  <td style={{ border: '1px solid black', padding: '10px' }}>
                    <Button 
                      icon="pi pi-trash" 
                      className="p-button-rounded p-button-danger" 
                      onClick={() => handleDeleteExtra(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="card flex">
          <div className="flex flex-column gap-1">
            <label htmlFor="order_price">Total</label>
            <InputText 
              id="order_price" 
              aria-describedby="order_price-help" 
              value={total} 
              onChange={(e) => setTotal(e.target.value)} // Allow editing of the total
              style={{ width: '400px', height: '50px' }} 
            />
          </div> 
        </div>
        <div className='flex justify-content-center gap-2'>
          <Toast ref={toast} />
          <ConfirmPopup />
          <Button 
            label="Cancelar" 
            className="p-button-secondary" 
            onClick={() => navigate('/home')} // Go back to home page
          />
          <Button 
            label="Guardar" 
            icon="pi pi-check" 
            iconPos="right" 
            severity='success' 
            type="submit" 
            tooltip="Submit order" 
            tooltipOptions={{ position: 'bottom' }} 
          />
        </div>
      </form>
    </>
  );
}

export default EditOrder;
