

import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Redirect } from 'react-router-dom';
import Header from './components/Header';
import ProdactList from './components/ProductsList'
import ProductDetails from './components/ProductDetails'
import { CurrencyContext } from './CurrencyContext';
import Cart from './components/Cart'



// import { useQuery, gql } from '@apollo/client';

// const getCurrencies = gql`
//   query getCurrencies{
//       currencies {
//         label
//         symbol
//       }
//     }
// `;
function App(props) {
  const [currency, setCurrency] = useState("USD");



  return (<div>
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      <BrowserRouter>

        <Header />
        <Routes>

          <Route exact path='/' element={<ProdactList />}>
            <Route path='products/:category' element={<ProdactList />} />
          </Route>
          <Route path='product-details/:productID' element={<ProductDetails />} />
          <Route path='cart' element={<Cart />} />
        </Routes>

      </BrowserRouter>
    </CurrencyContext.Provider>
  </div>)
}

export default App;
