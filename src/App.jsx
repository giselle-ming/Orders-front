import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AddEditOrder from './components/AddEditOrder';
import FourOhFour from './components/FourOhFour';
import Home from './components/Home';
import Header from './components/Header'
import EditOrder from './components/EditOrder';

function App() {

  return (
    <div className='container'>
    <Header></Header>
      <Routes>
          <Route path='/' element={<Login></Login>}></Route>
          <Route path='/home' element={<Home></Home>}></Route>
          <Route path='/order/addOrder' element={<AddEditOrder></AddEditOrder>}></Route>
          <Route path='/order/:id/edit' element={<EditOrder></EditOrder>}></Route>
          <Route path='*' element={<FourOhFour></FourOhFour>}></Route>
          <Route path='/order/*' element={<FourOhFour></FourOhFour>}></Route>
          <Route path='/order/:id/edit/*' element={<FourOhFour></FourOhFour>}></Route>       
      </Routes>
      
    </div>
  )
}

export default App
