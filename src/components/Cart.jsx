import React from 'react'
import Cartdetails from './Cartdetails';
import { Button } from 'primereact/button';

const Cart = ({ getDetail, onClick }) => {
    return (
        <>
            <div className=' border-round-3xl surface-0 shadow-5 w-23rem'>
                <div className='flex justify-content-between px-3 py-3 border-round-top-3xl surface-800 text-white'>
                    <span className='font-semibold text-3xl'>Order Details</span>
                    <span>
                        <Button onClick={onClick} className='w-6rem' label="Add Test" />
                    </span>
                </div>
                <div className='h-27rem overflow-y-scroll flex flex-column align-items-center w-full surface-200' style={{ scrollbarWidth: 'none' }} >
                    < Cartdetails getDetail={getDetail} />
                </div>


                <div className='surface-900 text-white py-4 border-round-bottom-3xl '>
                    <div className='flex justify-content-between px-4'>
                        <div className='font-bold'>ESTIMATED COST</div>
                        <div className='font-bold'>$ 00.</div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Cart