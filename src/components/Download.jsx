import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { PDFDownloadLink, Document, Page, Text, View } from '@react-pdf/renderer';
import { useToken } from '../context/TokenContext';
import '../Styles/DownloadOrders.css';

const DownloadOrders = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
          <Text>Orders between {startDate && startDate.toLocaleDateString('es')} and {endDate && endDate.toLocaleDateString('es')}</Text>
          {orders.map((order, index) => (
            <View key={index}>
              <Text>Date: {new Date(order.date).toLocaleDateString('es')}</Text>
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
    <div className="download-orders-container">
      <h2>Descargar Órdenes</h2>
      <div className="date-inputs">
        <div className="date-input">
          <label htmlFor="startDate">Desde:</label>
          <Calendar
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.value)}
            locale="es"
            showIcon
          />
        </div>
        <div className="date-input">
          <label htmlFor="endDate">Hasta:</label>
          <Calendar
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.value)}
            locale="es"
            showIcon
          />
        </div>
      </div>
      <div className="button-container">
        <Button label="Descargar Órdenes" onClick={fetchOrders} />
      </div>
      <div className="download-link-container">
        {orders.length > 0 && (
          <PDFDownloadLink document={generatePDF()} fileName={`ordenes-${startDate && startDate.toLocaleDateString('es')}-${endDate && endDate.toLocaleDateString('es')}.pdf`}>
            {({ loading }) => (loading ? 'Cargando...' : 'Descargar Órdenes')}
          </PDFDownloadLink>
        )}
      </div>
    </div>
  );
};

export default DownloadOrders;
