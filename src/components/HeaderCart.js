import React, { useContext } from 'react'
import { CurrencyContext } from '../CurrencyContext'
import AttributeHeader from './AttributeHeader';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, gql } from '@apollo/client';
import { ADD_TO_CART } from '../redux/constans/cartConstants';
import { deleteFromCart } from '../redux/actions/cartActions';
import { useNavigate } from 'react-router-dom'
const GET_CURRENCIES = gql`
query currencies {
  currencies {
        label
        symbol
    }
}`;


export default function HeaderCart(props) {
    // console.log(props);
    const { cart } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const { currency } = useContext(CurrencyContext);
    let navigate = useNavigate();

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
    // console.log(filteredCartArray);
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
        <section className={props.showCart ? 'add-cart-section-header-show' : 'add-cart-section-header-hide '}>
            {cart.length <= 0 ? (
                <div className='cart-is-empty-header'>
                    <h1>Cart is empty</h1>
                </div>
            ) : (
                <div>
                    <h1>My Bag,{cart.length}items</h1>

                    {cart.map((item, id) => {

                        return (

                            <div key={id} className='added-cart-details-header' >

                                <div>
                                    <div className='product-brand-name-header'>
                                        <h2>{item.brand}</h2>
                                        <h3>{item.name}</h3>
                                    </div>
                                    <div className='product-price-header'>
                                        {getPrice(item.prices)}

                                        <h4>{filteredPrices[0].currency.symbol}{item.count <= 0 ? Number((filteredPrices[0].amount).toFixed(1)) : Number((filteredPrices[0].amount).toFixed(1)) * item.count} </h4>


                                    </div>
                                    <div>
                                        {item.attributes.map((item, index) => {

                                            return (<AttributeHeader attributeData={item} key={index} />)
                                        })}
                                    </div>

                                </div>
                                <div className='added-cart-img-header'>
                                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", marginRight: "8px" }} >
                                        <button onClick={e =>
                                            increaseButton(

                                                e,
                                                item
                                            )
                                        }>+</button>
                                        <span className='added-cart-header-count'>{item.count === 0 ? dispatch(deleteFromCart(item)) : item.count} </span>
                                        <button onClick={e =>
                                            decreaseButton(

                                                e,
                                                item
                                            )
                                        }>-</button>


                                    </div>

                                    <img src={item.gallery[0]} alt={id} style={{ width: "120px", height: "190px" }} />

                                </div>


                            </div>



                        )




                    })



                    }

                    <div className='added-cart-order'>

                        <span style={{ display: "flex", justifyContent: "space-between", padding: "0 16px 16px 16px" }}>
                            <span>Total</span>
                            <span>{currencySymbol}{total}</span>
                        </span>

                        <div className='added-cart-btn-header'>

                            <button className='view-bag-btn' onClick={() => navigate("/cart")}>view bag</button>
                            <button className='check-out-btn'>CHECK OUT</button>
                        </div>
                    </div>
                </div>
            )
            }

        </section >
    )
}
