import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { PDFDownloadLink, Document, Page, Text, View } from '@react-pdf/renderer';
import { useToken } from '../context/TokenContext';

const DownloadOrders = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orders, setOrders] = useState([]);
  const [token] = useToken(); // Import useToken hook

  // Function to fetch orders between start and end dates
  const fetchOrders = () => {
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
  };

  // Function to generate PDF document for orders
  const generatePDF = () => (
    <Document>
      <Page>
        <View>
          <Text>Orders between {startDate} and {endDate}</Text>
          {orders.map((order, index) => (
            <View key={index}>
              <Text>Date: {order.date}</Text>
              <Text>Order: {order.products.map(product => product.name).join(', ')}</Text>
              <Text>Total: {order.total}</Text>
            </View>
          ))}
          <Text>Total Sales: {calculateTotalSales()}</Text>
        </View>
      </Page>
    </Document>
  );

  // Function to calculate total sales during the period
  const calculateTotalSales = () => {
    let totalSales = 0;
    orders.forEach(order => {
      totalSales += order.total;
    });
    return totalSales;
  };

  return (
    <div>
      <h2>Download Orders</h2>
      <div>
        <label>Desde:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div>
        <label>Hasta:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <div>
        <Button label="Descargar Ordenes" onClick={fetchOrders} />
      </div>
      <div>
        {orders.length > 0 && (
          <PDFDownloadLink document={generatePDF()} fileName={`ordenes-${startDate}-${endDate}.pdf`}>
            {({ loading }) => (loading ? 'Loading...' : 'Download Orders')}
          </PDFDownloadLink>
        )}
      </div>
    </div>
  );
};

export default DownloadOrders;
