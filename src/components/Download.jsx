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
  const [showDownloadLink, setShowDownloadLink] = useState(false); // State to control showing the download link

  useEffect(() => {
    if (orders.length > 0) {
      // Show the download link when orders are fetched
      setShowDownloadLink(true);
    }
  }, [orders]);

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
        // Filter orders based on selected dates
        const filteredOrders = data.data.filter(order => {
          const orderDate = new Date(order.date);
          return startDate && endDate
            ? orderDate >= startDate && orderDate <= endDate
            : true;
        });
        setOrders(filteredOrders);
      })
      .catch((error) => {
        console.warn(error.message);
      });
  };

const generatePDF = () => {
  const styles = {
    page: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      padding: 20
    },
    section: {
      flexGrow: 1,
      marginBottom: 20
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10
    },
    table: {
      display: 'table',
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableRow: {
      display: 'table-row'
    },
    columnHeader: {
      backgroundColor: '#f2f2f2',
      fontWeight: 'bold',
      border: '1px solid #000',
      padding: 8
    },
    column: {
      border: '1px solid #000',
      padding: 8
    },
    total: {
      fontWeight: 'bold',
      marginTop: 10
    }
  };

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Ventas</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.columnHeader}>Fecha - ID - Total</Text>
            </View>
            {orders.map((order, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.column}>{new Date(order.date).toLocaleDateString('es')} - {order._id} - {order.total}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.total}>Total Vendido entre {startDate} - {endDate}: {calculateTotalSales()}</Text>
        </View>
      </Page>
    </Document>
  );
};


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
        {/* Conditionally render the download link */}
        {showDownloadLink && (
          <PDFDownloadLink
            document={generatePDF()}
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
