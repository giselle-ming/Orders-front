import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { PDFDownloadLink, Document, Page, Text, View } from '@react-pdf/renderer';
import { useToken } from '../context/TokenContext';
import '../Styles/DownloadOrders.css';
import { Calendar } from 'primereact/calendar';

const DownloadOrders = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [orders, setOrders] = useState([]);
  const [token] = useToken(); // Import useToken hook
  const [pdfDocument, setPdfDocument] = useState(null);

  useEffect(() => {
    if (orders.length > 0) {
      // Generate PDF when orders are fetched
      const pdf = generatePDF();
      setPdfDocument(pdf);
    }
  }, [orders, startDate, endDate]);

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
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Ventas</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.columnHeader}>Fecha</Text>
              <Text style={styles.columnHeader}>Orden</Text>
              <Text style={styles.columnHeader}>Total</Text>
            </View>
            {orders.map((order, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.column}>{new Date(order.date).toLocaleDateString('es')}</Text>
                <Text style={styles.column}>{order.products.map(product => product.name).join(', ')}</Text>
                <Text style={styles.column}>{order.total}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.total}>Total Sales: {calculateTotalSales()}</Text>
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
      <h2>Descargar Ordenes</h2>
      <div className="date-inputs">
        <div className="date-input">
          <label htmlFor="startDate">Desde: </label>
          <Calendar value={startDate} onChange={(e) => setStartDate(e.value)} showIcon />
        </div>
        <div className="date-input">
          <label htmlFor="endDate">Hasta: </label>
          <Calendar value={endDate} onChange={(e) => setEndDate(e.value)} showIcon />
        </div>
      </div>
      <div className="button-container">
        <Button label="Consultar Ordenes" onClick={fetchOrders} />
      </div>
      <div className="download-link-container">
        {pdfDocument && (
          <PDFDownloadLink
            document={pdfDocument}
            fileName={`ordenes-${startDate && startDate.toLocaleDateString('es')}-${endDate && endDate.toLocaleDateString('es')}.pdf`}
          >
            {({ loading }) => (loading ? 'Cargando...' : 'Descargar Órdenes')}
          </PDFDownloadLink>
        )}
      </div>
    </div>
  );
};

export default DownloadOrders;
