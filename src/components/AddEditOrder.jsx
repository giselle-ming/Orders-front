import React, { useRef, useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useToken } from '../context/TokenContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import data from '../data.js';
import 'primeflex/primeflex.css';  
import '../Styles/AddEditOrder.css';

function AddEditOrder() {
  const [token, setToken] = useToken();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedExtra, setSelectedExtra] = useState(null); // Corrected variable name
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const params = useParams();
  let url = `https://orders-api-dx4t.onrender.com/api/order/${params.id || ''}`;
  let method = params.id ? 'PUT' : 'POST';
  let subtitle = params.id ? 'Editar Orden' : 'Agregar Orden';
  const toast = useRef(null);

  useEffect(() => {
    if (params.id) {
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
    }
  }, [params.id, token]);


  useEffect(() => {
    setProducts(data.pizzas.map(product => ({ label: `${product.name} - ${product.size}`, value: product })));
  }, []);

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

  const accept = () => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Order deleted', life: 3000 });
    fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((resp) => {
      if (resp.ok) {
        console.log('Order deleted successfully');
        navigate('/home');
      } else {
        console.log('Error deleting order');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };

  const reject = () => {
    // toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  };

const handleSubmit = (ev) => {
  ev.preventDefault();
  
  const orderData = {
    products: [
      ...selectedProducts.map(product => ({
        name: product.name,
        size: product.size,
        price: product.price
      })),
      ...selectedExtras.map(extra => ({ // Treat extras as products
        name: extra.name,
        size: '-', // Assuming size is not applicable for extras
        price: extra.price
      }))
    ],
    total: total
    // Add other necessary fields for the order
  };

  fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  })
  .then((resp) => {
    if (resp.ok) {
      console.log('Order ' + (params.id ? 'updated' : 'added') + ' successfully');
      setSelectedProducts([]);
      setSelectedExtras([]);
      setTotal(0); 
      navigate('/home');
    } else {
      console.log('Error ' + (params.id ? 'updating' : 'adding') + ' order');
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

  const handleAddProduct = () => {
    if (selectedProduct) {
      setSelectedProducts(prevState => [...prevState, selectedProduct]);
      setSelectedProduct(null);
    }
  };

  const handleAddExtra = () => { 
    if (selectedExtra) {
      setSelectedExtras(prevState => [...prevState, selectedExtra]);
      setSelectedExtra(null);
      calculateTotalPrice(); // Update total when adding an extra
    }
  };

  return (
    <>
      <h2>{subtitle}</h2>
      <div>
        <div className="flex flex-column flex-wrap gap-2 align-content-center justify-content-center align-self-start">
            <div className="flex flex-column gap-1">
              <label htmlFor="order_products">Pizzas</label>
              <Dropdown 
                id="order_products" 
                value={selectedProduct} 
                options={products} 
                onChange={(e) => {
                  setSelectedProduct(e.value);
                }} 
                style={{ width: '400px', height: '50px' }} 
              />
              <Button 
                style={{ width: '400px', height: '50px' }}
                label="Agregar" 
                className="p-button-primary" 
                onClick={handleAddProduct} 
              />
            </div>
          </div>
        <div className="flex flex-column flex-wrap gap-2 align-content-center justify-content-center align-self-start">
            <div className="flex flex-column gap-1">
              <label htmlFor="order_extras">Extras</label>
              <Dropdown 
                id="order_extras" 
                value={selectedExtra} 
                options={data.options.extras.map(extra => ({ label: extra.name, value: extra }))} 
                onChange={(e) => {
                  setSelectedExtra(e.value);
                }} 
                style={{ width: '400px', height: '50px' }} 
              />
              <Button 
                style={{ width: '400px', height: '50px' }}
                label="Agregar Extra" 
                className="p-button-primary" 
                onClick={handleAddExtra} 
              />
            </div>
          </div>
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
                        onClick={(ev) => handleDeleteExtra(ev, index)}
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
      </div>
    </>
  );
}

export default AddEditOrder;
