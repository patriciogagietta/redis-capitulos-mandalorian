import React from 'react'
import { Link } from 'react-router-dom'

import logo2 from '../assets/logo-header.webp'


export const Header = () => {
    return (
        <Link to={'/'} className='flex justify-center mt-6'>
            <img className='w-60 cursor-pointer hover:scale-103 duration-150' src={logo2} alt="Logo The Mandalorian" />
        </Link>
    )
}
