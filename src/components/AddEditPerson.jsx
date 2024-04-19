import { useRef } from 'react'
import { InputText } from 'primereact/inputtext';
import '../Styles/AddEditPerson.css'
import "primeicons/primeicons.css"; 
import 'primeflex/primeflex.css';
import { Calendar } from 'primereact/calendar';
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useToken } from '../context/TokenContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';


function AddEditPerson() {
  const [token, setToken] = useToken();
  const [name, setName] = useState('');
  const [date, setDate] = useState(null);
  const navigate = useNavigate();
  let params = useParams();
  let url = `https://giftr.onrender.com/api/person/${params.id}`;
  let method = 'PUT';
  let subtitle = `Edit ${name}`;
  const toast = useRef(null);

  const accept = () => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Person deleted', life: 3000 });
        fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => {
          if (resp.ok) {
            console.log('Person deleted successfully');
            navigate('/people');
          } else {
            console.log('Failed to delete person');
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
      dob: date.toISOString().split('T')[0]
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
          console.log('Person added successfully');
          setName('');
          setDate(null);
          navigate('/people');
        } else {
          console.log('Failed to add person');
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
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept,
            reject
        });
  };

  useEffect(() => {
      const url = `https://giftr.onrender.com/api/person/${params.id}/`;
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
          let d = new Date(data.data.dob)
          setDate(d)
        })
        .catch((error) => {
          console.warn(error.message);
        });
    }, [token, navigate, setToken, params.id, params.idGift]);

  if (!params.id) {
    subtitle = `Add Person`
    method = 'POST';
    url = `https://giftr.onrender.com/api/person/`;
  }

  return (
    <>
    <h2>{subtitle}</h2>
    <div className='bgForm'>
      
      <form onSubmit={handleSubmit} className='flex flex-column flex-wrap gap-4 align-content-center justify-content-center align-self-start'>
        <div className="card flex">
            <div className="flex flex-column gap-2">
                <label htmlFor="person_name">Name</label>
                <InputText id="person_name" aria-describedby="person_name-help" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
        </div>
        <div className="card flex justify-content-center">
            <div className="flex flex-column gap-2">
          <label htmlFor="birth_date">Birth Date</label>
            <Calendar value={date} onChange={(e) => setDate(e.value)} showIcon />
        </div>
        </div>
        <div className='flex justify-content-center gap-4'>
          <Toast ref={toast} />
          <ConfirmPopup />
          {(params.id) && <Button label="Delete" className="p-button-danger" icon="pi pi-delete-left" iconPos="right" onClick={handleDelete}/>}
          <Button label="Submit" icon="pi pi-check" iconPos="right" severity='success' type="submit" tooltip="Submit person" tooltipOptions={{ position: 'bottom' }} />
        </div>
      </form>
      
    </div>
    </>
  );
}

export default AddEditPerson