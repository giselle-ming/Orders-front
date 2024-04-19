import { useRef } from 'react'
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import '../Styles/AddEditProduct.css'
import "primeicons/primeicons.css"; 
import 'primeflex/primeflex.css';
import { RadioButton } from 'primereact/radiobutton';
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useToken } from '../context/TokenContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';


function AddEditProduct() {
  const [token, setToken] = useToken();
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [price, setPrice] = useState('');
  const navigate = useNavigate();
  let params = useParams();
  let url = `https://orders-api-dx4t.onrender.com/api/product/${params.id}`;
  let method = 'PUT';
  let subtitle = `Edit ${name}`;
  const toast = useRef(null);
  const [size, setSize] = useState('No aplica');

  const sizes = [
    {label: 'Pequeña', value: 'Pequeña'},
    {label: 'Mediana', value: 'Mediana'},
    {label: 'Grande', value: 'Grande'},
    {label: 'No aplica', value: 'No aplica'}
  ];

  const accept = () => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Product deleted', life: 3000 });
        fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => {
          if (resp.ok) {
            console.log('Product eliminada exitosamente');
            navigate('/products');
          } else {
            console.log('Error eliminando product');
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
      name: name,
      ingredients: ingredients.split(','),
      size: size,
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
          console.log('Product agregada exitosamente');
          setName('');
          setIngredients('');
          setSize('');
          setPrice('');
          navigate('/products');
        } else {
          console.log('Error eliminando product');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = (ev) => {
    ev.preventDefault();
    confirmPopup({
            target: event.currentTarget,
            message: 'Seguro que quieres eliminar este product?',
            icon: 'pi pi-exclamation-triangle',
            accept,
            reject
        });
  };

  useEffect(() => {
      const url = `https://orders-api-dx4t.onrender.com/api/product/${params.id}/`;
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
          setName(data.data.name);
          setIngredients(data.data.ingredients.join(','));
          setSize(data.data.size);
          setPrice(data.data.price);
        })
        .catch((error) => {
          console.warn(error.message);
        });
    }, [token, navigate, setToken, params.id]);

  if (!params.id) {
    subtitle = `Agregar Producto`
    method = 'POST';
    url = `https://orders-api-dx4t.onrender.com/api/product/`;
  }

  return (
    <>
    <h2>{subtitle}</h2>
    <div className='bgForm'>
      
      <form onSubmit={handleSubmit} className='flex flex-column flex-wrap gap-2 align-content-center justify-content-center align-self-start'>
        <div className="card flex">
          <div className="flex flex-column gap-1">
            <label htmlFor="product_name">Nombre del producto</label>
            <InputText id="product_name" aria-describedby="product_name-help" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '400px', height: '50px' }} />
          </div>
        </div>
        <div className="card flex">
          <div className="flex flex-column gap-1">
            <label htmlFor="product_ingredients">Ingredientes</label>
            <InputTextarea id="product_ingredients" aria-describedby="product_ingredients-help" value={ingredients} onChange={(e) => setIngredients(e.target.value)} style={{ width: '400px', height: '150px' }} />
          </div>
        </div>
        <div className="card flex">
          <div className="flex flex-column gap-1">
            <label htmlFor="product_size">Tamaño</label>
            <Dropdown id="product_size" value={size} options={sizes} onChange={(e) => setSize(e.value)} style={{ width: '400px', height: '50px' }} />
          </div>
        </div>
        <div className="card flex">
          <div className="flex flex-column gap-1">
            <label htmlFor="product_price">Precio</label>
            <InputText id="product_price" aria-describedby="product_price-help" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '400px', height: '50px' }} />
          </div>
        </div>
        <div className='flex justify-content-center gap-2'>
          <Toast ref={toast} />
          <ConfirmPopup />
          {(params.id) && <Button label="Delete" className="p-button-danger" icon="pi pi-delete-left" iconPos="right" onClick={handleDelete}/>}
          <Button label="Guardar" icon="pi pi-check" iconPos="right" severity='success' type="submit" tooltip="Submit product" tooltipOptions={{ position: 'bottom' }} />
        </div>
      </form>
      
    </div>
    </>
  );
}

  export default AddEditProduct