import React, { useState } from 'react';
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

// Styles for PDF document
const styles = {
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  table: {
    display: 'table',
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 10
  },
  tableRow: {
    display: 'table-row',
  },
  columnHeader: {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    border: '1px solid #000',
    padding: 5
  },
  column: {
    border: '1px solid #000',
    padding: 5
  },
  total: {
    marginTop: 10,
    fontWeight: 'bold'
  }
};

  // Function to download the PDF
  const downloadPDF = () => {
    if (orders.length > 0) {
      const pdf = generatePDF();
      pdf.save(`ordenes-${startDate && startDate.toLocaleDateString('es')}-${endDate && endDate.toLocaleDateString('es')}.pdf`);
    }
  };

  // Function to calculate total sales during the period
  const calculateTotalSales = () => {
    let totalSales = 0;
    orders.forEach(order => {
      totalSales += order.total;
    });
    return totalSales;
  };

  useEffect(() => {
  if (orders.length > 0) {
    downloadPDF();
  }
  } , [orders]);

  return (
    <div className="download-orders-container">
      <h2>Descargar Órdenes</h2>
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
        <Button label="Descargar Ordenes" onClick={fetchOrders} />
      </div>
    </div>
  );
};

export default DownloadOrders;
