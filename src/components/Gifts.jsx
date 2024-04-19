import React from 'react';
import { OrderList } from 'primereact/orderlist';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useToken } from '../context/TokenContext';
import { Button } from 'primereact/button';
import '../Styles/Gifts.css'

function Gifts() {
  const [gift, setGifts] = useState([]);
  const [token, setToken] = useToken();
  const navigate = useNavigate();
  let params = useParams();
  
  const addGift = () => {
    navigate(`/people/${params.id}/gifts/addGift`);
  };

  useEffect(() => {
    const url = `https://giftr.onrender.com/api/person/${params.id}`;
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
        setGifts(
          data.data.gifts.map((item) => (
            {_id: item._id,
              txt: item.txt,
              store: item.store,
              url:item.url
          }))
        );
      })
      .catch((error) => {
        console.warn(error.message);
      });
  }, [token, navigate, setToken]);



  const itemTemplate = (item) => {
      return (
        <div className="flex flex-wrap p-2 gap-3">
            <div className="flex-1 flex flex-column gap-2 xl:mr-8">
                <span className="font-bold">{item.txt}</span>
                <i className="pi pi-tag text-sm"></i>
                <div className="flex flex-column align-items-center gap-2">
                    <span>{item.store}</span>
                    <a href={item.url}><span className="text-sm">{item.url}</span></a>
                    
                </div>
            </div>
            <Button icon='pi pi-pencil' rounded text raised onClick={(ev) => navigate(`${item._id}`)} tooltip="Edit gift" tooltipOptions={{ position: 'bottom' }} />
        </div>
      );
  };
    
    return (
        <div className="card xl:flex xl:justify-content-center">
          <Button icon="pi pi-plus" rounded raised onClick={addGift} tooltip="New gift" tooltipOptions={{ position: 'bottom' }} />
            <OrderList value={gift} onChange={(e) => setGifts(e.value)} itemTemplate={itemTemplate} header="Gifts" filter filterBy="txt"></OrderList>
        </div>
    )
}

export default Gifts