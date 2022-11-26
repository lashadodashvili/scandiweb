import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import Loading from './Loading';
import { CurrencyContext } from '../CurrencyContext';
import { render } from '@testing-library/react';

const GET_PRODUCTS = gql`
  query ($category: String!) {
  category(input: {title: $category}) {
    name
    products {
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
}
`;

export default function Product() {
  const { currency, setCurrency } = useContext(CurrencyContext);

  const location = useLocation();
  let category = location.pathname.replace("/products/", "");
  if (category === '/') {
    category = 'all';
  }

  const { loading, error, data } = useQuery(GET_PRODUCTS, { variables: { category } });

  const navigate = useNavigate();

  const navigateToProductDetails = (id) => {
    // console.log(category);
    navigate(`/product-details/${id}`);

  };
  let filteredPrices;
  const getPrice = (productPrice) => {
    // console.log(productPrice)
    filteredPrices = productPrice.filter((price) => {
      return price.currency.label === currency;
    })
  }

  // console.log(data)
  return (
    <section className='main-section'>
      <h1 className='title'>{category}</h1>

      <section className='cart-list' >
        {loading ? (
          <Loading />
        ) : (
          data.category.products.map((product) => (

            <div onClick={() => navigateToProductDetails(product.id)} key={product.id}>

              <div className='cart'>
                <div className={product.inStock ? 'cart-img' : 'cart-img-blur'} style={{ backgroundImage: `url(${product.gallery[0]})` }} >{!product.inStock ? 'out of stock' : ''}</div>
                <article className='product-desc'>{product.brand}  {product.name}</article>

                {getPrice(product.prices)}

                <h1> {filteredPrices[0].currency.symbol}{filteredPrices[0].amount}</h1>
              </div>


            </div>
          )))

        }
      </section>

    </section >
  )
}
