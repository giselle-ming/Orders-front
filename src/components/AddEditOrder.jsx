import { useRef, useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useToken } from '../context/TokenContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

function AddEditOrder() {
  const [token, setToken] = useToken();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();
  let params = useParams();
  let url = `https://orders-api-dx4t.onrender.com/api/order/${params.id}`;
  let method = 'PUT';
  let subtitle = `Edit Order`;
  const toast = useRef(null);

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
        navigate('/orders');
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
    
    const data = {
      products: selectedProducts,
      price: price
    };

    fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((resp) => {
      if (resp.ok) {
        console.log('Order added successfully');
        setSelectedProducts([]);
        setPrice(0);
        navigate('/orders');
      } else {
        console.log('Error adding order');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };

  const handleDelete = (ev) => {
    ev.preventDefault();
    confirmPopup({
      target: ev.currentTarget,
      message: 'Are you sure you want to delete this order?',
      icon: 'pi pi-exclamation-triangle',
      accept,
      reject
    });
  };

  useEffect(() => {
    const url = `https://orders-api-dx4t.onrender.com/api/product/`;
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

  if (!params.id) {
    subtitle = `Add Order`
    method = 'POST';
    url = `https://orders-api-dx4t.onrender.com/api/order/`;
  }

  return (
    <>
    <h2>{subtitle}</h2>
    <div className='bgForm'>
      
      <form onSubmit={handleSubmit} className='flex flex-column flex-wrap gap-2 align-content-center justify-content-center align-self-start'>
        <div className="card flex">
          <div className="flex flex-column gap-1">
            <label htmlFor="order_products">Products</label>
            <Dropdown id="order_products" value={selectedProducts} options={products} onChange={(e) => setSelectedProducts(e.value)} style={{ width: '400px', height: '50px' }} />
          </div>
        </div>
        <div className="card flex">
          <div className="flex flex-column gap-1">
            <label htmlFor="order_price">Price</label>
            <InputText id="order_price" aria-describedby="order_price-help" value={price} readOnly style={{ width: '400px', height: '50px' }} />
          </div>
        </div>
        <div className='flex justify-content-center gap-2'>
          <Toast ref={toast} />
          <ConfirmPopup />
          {(params.id) && <Button label="Delete" className="p-button-danger" icon="pi pi-delete-left" iconPos="right" onClick={handleDelete}/>}
          <Button label="Save" icon="pi pi-check" iconPos="right" severity='success' type="submit" tooltip="Submit order" tooltipOptions={{ position: 'bottom' }} />
        </div>
      </form>
      
    </div>
    </>
  );
}

export default AddEditOrder