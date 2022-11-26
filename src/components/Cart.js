import React, { useContext } from 'react'
import { CurrencyContext } from '../CurrencyContext'
import Attribute from './Attribute';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, gql } from '@apollo/client';
import { ADD_TO_CART } from '../redux/constans/cartConstants';
import { deleteFromCart } from '../redux/actions/cartActions';
import Product from './ProductsList';

const GET_CURRENCIES = gql`
query currencies {
  currencies {
        label
        symbol
    }
}`;


export default function Cart() {
  const { cart } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const { currency } = useContext(CurrencyContext);
  const { loading, error, data } = useQuery(GET_CURRENCIES);
  let currencies = [];
  let currencySymbol = '';
  if (!loading) {
    currencies = data.currencies.filter((item) => {
      if (item.label === currency) {
        return item;
      }
    })
    currencySymbol = currencies[0].symbol;
  }
  let filteredPrices;
  const getPrice = (productPrice) => {
    filteredPrices = productPrice.filter((price) => {

      return price.currency.label === currency;

    })
  }


  let cartArray = localStorage.getItem('cart');


  cartArray = JSON.parse(cartArray);
  let filteredCartArray = cartArray.map((item) => {
    let filteredPrices = item.prices.find((price) => {
      return price.currency.label === currency;
    });
    return [filteredPrices, item.count];
  });
  console.log(filteredCartArray);
  let total = filteredCartArray.reduce((prev, cur) => (cur[0].amount * cur[1]) + prev, 0);
  let tax = total * (21 / 100)
  const increaseButton = (e, item) => {

    const cart = localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];

    cart.forEach(cartItem => {
      if (cartItem.id === item.id) {
        cartItem.count++;
      }
    });

    localStorage.setItem('cart', JSON.stringify(cart));

    dispatch({
      type: ADD_TO_CART,
      payload: cart,
    });
  };
  const decreaseButton = (e, item) => {

    const cart = localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];

    cart.forEach(cartItem => {
      if (cartItem.id === item.id) {
        cartItem.count--;
      }

    });

    localStorage.setItem('cart', JSON.stringify(cart));

    dispatch({
      type: ADD_TO_CART,
      payload: cart,
    });






  };


  return (
    <section className='added-cart-section'>
      {cart.length <= 0 ? (
        <div className='cart-is-empty'>
          <h1>Cart is empty</h1>
        </div>
      ) : (
        <div className='added-cart'>

          {cart.map((item, id) => {

            return (

              <div key={id} className='added-cart-details' >

                <div>
                  <div className='product-brand-name'>
                    <h2>{item.brand}</h2>
                    <h3>{item.name}</h3>
                  </div>
                  <div className='product-price'>
                    {getPrice(item.prices)}

                    <h4>{filteredPrices[0].currency.symbol}{item.count <= 0 ? Number((filteredPrices[0].amount).toFixed(1)) : Number((filteredPrices[0].amount).toFixed(1)) * item.count} </h4>


                  </div>
                  <div>
                    {item.attributes.map((item, index) => {

                      return (<Attribute attributeData={item} key={index} />)
                    })}
                  </div>

                </div>
                <div className='added-cart-img'>
                  <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", marginRight: "25px" }} >
                    <button onClick={e =>
                      increaseButton(

                        e,
                        item
                      )
                    }>+</button>
                    <span style={{ textAlign: "center" }}>{item.count === 0 ? dispatch(deleteFromCart(item)) : item.count} </span>
                    <button onClick={e =>
                      decreaseButton(

                        e,
                        item
                      )
                    }>-</button>


                  </div>

                  <img src={item.gallery[0]} alt={id} style={{ width: "200px", height: "288px" }} />

                </div>


              </div>



            )




          })



          }

          <div className='added-cart-order'>
            <span>Tax 21%:{Number(tax).toFixed(1)}</span>
            <span>Quantity:{cart.length}</span>
            <span>Total:{currencySymbol}{total}</span>





            <button className='order-btn'>order</button>
          </div>
        </div>
      )
      }

    </section >
  )
}
