import React from 'react'
//@ts-ignore
import loader from '../images/loader.svg'
import '../index.css'

const Loader = () => {
  return (
    <img
      src={loader}
      alt='loader'
      className='loader'
      style={{ width: '30px', height: '40px', marginLeft: '5px', marginTop: '3px' }}
    />
  )
}

export default Loader