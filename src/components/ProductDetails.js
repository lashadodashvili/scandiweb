
import React, { useState, useContext, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import Loading from './Loading';
import Attribute from './Attribute';
import { CurrencyContext } from '../CurrencyContext';
import { addToCart } from '../redux/actions/cartActions'
import { useDispatch } from 'react-redux'

const GET_PRODUCT = gql`
  query ($id: String!) {
  product(id: $id ) {
    id
    name
    inStock
    gallery
    description
    attributes {
      id
      name
      type
      items {
        displayValue
        value
        id
      }
    }
    prices {
      currency {
        label
        symbol
      }
      amount
    }
    brand
  }
  }
`;



export default function ProductDetails() {

  const { currency } = useContext(CurrencyContext);

  var parse = require('html-react-parser');

  const location = useLocation();

  let id = location.pathname.replace("/product-details/", "");

  const { loading, error, data } = useQuery(GET_PRODUCT, { variables: { id } });

  let price;

  if (!loading) {

    price = data.product.prices.filter((item) => {
      return item.currency.label === currency;
    });
  }


  const [img, setImg] = useState("")

  const changeImg = (index) => {
    setImg(data.product.gallery[index])
  }
  const dispatch = useDispatch();

  const handelAddtoCart = () => {

    dispatch(addToCart(data.product));
  }
  console.log(data)

  return (
    <div className='desc-cont'>
      {loading ? <Loading /> :
        (<div className="desc-pic">
          <div className="desc-small-pic-cont">
            {data.product.gallery.map((item, index) => {
              return (

                <img className='desc-small-pic' src={item}
                  key={index} onClick={() => changeImg(index)} />

              )
            })}
          </div>
          <img src={img ? img : data.product.gallery[0]}
            style={{ width: "610px", height: "510px" }} />


          <div className='product-attribute'>
            <div className='product-brand-name'>
              <h1>{data.product.brand}</h1>
              <h2>{data.product.name}</h2>
            </div>
            <div >
              {data.product.attributes.map((item, index) => {

                return (

                  <Attribute attributeData={item} key={index} />
                )

              })}
            </div>
            <div className='product-price'>
              <h3>Price:</h3>
              <span>
                <h4>
                  {price[0]?.currency.symbol}
                </h4>
                <h4>
                  {price[0]?.amount}
                </h4>
              </span>
            </div>
            <div>
              <button className='add-tocart' onClick={handelAddtoCart}>ADD TO CART</button>
            </div>
            <div className='cart-desc'>
              {parse(data.product.description)}
            </div>
          </div>

        </div>)


      }

    </div >)
}
