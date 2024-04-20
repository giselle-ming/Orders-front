import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Gifts from './components/Gifts';
import AddEditProduct from './components/AddEditProduct';
import AddEditOrder from './components/AddEditOrder';
import AddEditGift from './components/AddEditGift';
import FourOhFour from './components/FourOhFour';
import Home from './components/Home';
import Header from './components/Header'

function App() {

  return (
    <div className='container'>
    <Header></Header>
      <Routes>
          <Route path='/' element={<Login></Login>}></Route>
          <Route path='/home' element={<Home></Home>}></Route>
          <Route path='/product/addProduct' element={<AddEditProduct></AddEditProduct>}></Route>
          <Route path='/product/:id/edit' element={<AddEditProduct></AddEditProduct>}></Route>
          <Route path='/order/addOrder' element={<AddEditOrder></AddEditOrder>}></Route>
          <Route path='/order/:id/edit' element={<AddEditOrder></AddEditOrder>}></Route>
          <Route path='*' element={<FourOhFour></FourOhFour>}></Route>
          <Route path='/order/*' element={<FourOhFour></FourOhFour>}></Route>
          <Route path='/order/:id/edit/*' element={<FourOhFour></FourOhFour>}></Route>
          <Route path='/product/*' element={<FourOhFour></FourOhFour>}></Route>
          <Route path='/product/:id/edit/*' element={<FourOhFour></FourOhFour>}></Route>          
      </Routes>
      
    </div>
  )
}

export default App
