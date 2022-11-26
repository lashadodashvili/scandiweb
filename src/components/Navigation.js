import React from 'react'
import { Link, } from 'react-router-dom'



export default function Navigation() {
    return (
        <>
            <nav className='nav' >
                <div className='nav-link'>
                    <Link className='nav-link' to='/products/all'>All</Link>
                    <Link className='nav-link' to='/products/clothes'>Clothes</Link>
                    <Link className='nav-link' to='/products/tech'>Tech</Link>
                </div>

               


            </nav>

        </>
    )
}
