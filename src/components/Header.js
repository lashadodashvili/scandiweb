import { React, useContext, useState } from 'react'
import Navigation from './Navigation'
import { Outlet, useNavigate } from 'react-router-dom'
import alogo from '../imgs/a-logo.png'
import Vector from '../imgs/Vector.png'
import { useQuery, gql } from '@apollo/client';
import Loading from './Loading';
import { CurrencyContext } from '../CurrencyContext';

import { useSelector } from 'react-redux'
import HeaderCart from './HeaderCart'

const GET_CURRENCIES = gql`
query currencies {
  currencies {
        label
        symbol
    }
}`;




export default function Header() {

    const { currency, setCurrency } = useContext(CurrencyContext);
    const { cart } = useSelector(state => state.cart)


    const [showCart, setShowCart] = useState(false);

    const { loading, error, data } = useQuery(GET_CURRENCIES);

    let navigate = useNavigate();

    const toggleShowCart = () => {
        setShowCart(current => !current)
        console.log(showCart);
    }


    return (<div>
        <div className='header'>
            <Navigation />
            <Outlet />

            <img className='logo' src={alogo} alt='alogo' onClick={() => navigate("/cart")} />
            <div style={{ display: "flex", alignItems: "center" }}>
                {loading ? <Loading /> :
                    <select onChange={(e) => setCurrency(e.target.value)} style={{ border: "none", cursor: "pointer", }}>
                        {data.currencies.map((item, index) => (
                            <option value={item.label} key={index} selected={item.label === "USD"} > {item.symbol} </option>
                        ))}
                    </select>
                }

                <img className='cart-icon' src={Vector} alt='carticon' onClick={toggleShowCart} ></img>
                <span className='badge badge-warning' id='lblCartCount'> {cart.length} </span>

            </div>

        </div >

        <HeaderCart showCart={showCart} />
    </div>
    )

}



