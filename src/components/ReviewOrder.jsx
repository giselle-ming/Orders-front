import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToken } from '../context/TokenContext'; // Import useToken hook
import { PDFDownloadLink, PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

function ReviewOrder() {
  const [order, setOrder] = useState(null);
  const [token] = useToken(); // Use the useToken hook to get the token
  const params = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`https://orders-api-dx4t.onrender.com/api/order/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrder(data.data);
        } else {
          console.log('Error fetching order');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrder();
  }, [params.id, token]); // Add token to the dependency array

  // Function to format date as "dd-mm-yyyy hh:mm"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return formattedDate;
  };

  // PDF document component
  const FacturaPDF = () => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text>Detalle de la Orden</Text>
          <Text>Fecha: {order && formatDate(order.date)}</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={styles.columnHeader}>Producto</Text>
              <Text style={styles.columnHeader}>Tamaño</Text>
              <Text style={styles.columnHeader}>Precio</Text>
            </View>
            {order && order.products.map((product, index) => (
              <View style={styles.row} key={index}>
                <Text style={styles.column}>{product.name}</Text>
                <Text style={styles.column}>{product.size}</Text>
                <Text style={styles.column}>{product.price}</Text>
              </View>
            ))}
            <View style={styles.row}>
              <Text style={styles.totalColumn}>Total:</Text>
              <Text style={styles.total}>{order && order.total}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  // Styles for PDF document
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    },
    table: {
      display: 'table',
      width: '100%',
      borderStyle: 'solid',
      borderColor: '#000',
      borderWidth: 1,
      borderCollapse: 'collapse',
      marginTop: 10
    },
    row: {
      display: 'table-row',
    },
    columnHeader: {
      backgroundColor: '#f2f2f2',
      fontWeight: 'bold',
      borderStyle: 'solid',
      borderColor: '#000',
      borderWidth: 1,
      padding: 5
    },
    column: {
      borderStyle: 'solid',
      borderColor: '#000',
      borderWidth: 1,
      padding: 5
    },
    totalColumn: {
      backgroundColor: '#f2f2f2',
      fontWeight: 'bold',
      borderStyle: 'solid',
      borderColor: '#000',
      borderWidth: 1,
      padding: 5
    },
    total: {
      borderStyle: 'solid',
      borderColor: '#000',
      borderWidth: 1,
      padding: 5
    }
  });

  return (
    <>
      <h2>Detalle de la Orden</h2>
      {order && (
        <div>
          <h3>Fecha: {formatDate(order.date)}</h3>
          <div>
            <h3>Factura</h3>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid black', padding: '10px' }}>Producto</th>
                  <th style={{ border: '1px solid black', padding: '10px' }}>Tamaño</th>
                  <th style={{ border: '1px solid black', padding: '10px' }}>Precio</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid black', padding: '10px' }}>{product.name}</td>
                    <td style={{ border: '1px solid black', padding: '10px' }}>{product.size}</td>
                    <td style={{ border: '1px solid black', padding: '10px' }}>{product.price}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2" style={{ border: '1px solid black', padding: '10px', textAlign: 'right' }}>Total:</td>
                  <td style={{ border: '1px solid black', padding: '10px' }}>{order.total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          {/* PDF Download Button */}
          <PDFDownloadLink document={<FacturaPDF />} fileName="factura.pdf">
            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Descargar Factura')}
          </PDFDownloadLink>
        </div>
      )}
    </>
  );
}

export default ReviewOrder;
