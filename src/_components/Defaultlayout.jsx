import React, { useEffect, useState } from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import SideNav from './SideNav'
import Footer from './Footer'

const Defaultlayout = () => {
    const [isOpen, setIsOpen] = useState(true)
    const toggleBar = () => {

        setIsOpen(!isOpen)
    }
    return (
        <>
            <div className='h-full'>
                <div className=''>
                    <Header toggleBar={toggleBar} />
                </div>
                <div className='flex' style={{ height: '670px' }}>
                    {isOpen && (
                        <div className='w-2 overflow-y-scroll' style={{ scrollbarWidth: 'thin', scrollbarColor: '#2196f3 #e0e0e4', scroll }}   >
                            <SideNav />
                        </div>)}
                    <div className='w-full overflow-y-scroll' style={{scrollbarWidth:'none'}}>
                        <Outlet />
                    </div>
                </div>
                <div>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default Defaultlayout