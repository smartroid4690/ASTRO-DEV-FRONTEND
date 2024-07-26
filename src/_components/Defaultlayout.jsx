import React, { useState } from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import SideNav from './SideNav'

const Defaultlayout = () => {
    const [isOpen, setIsOpen] = useState(true)
    const toggleBar = () => {
        setIsOpen(!isOpen)
    }
    return (
        <>
            <div className='main_layout'>

                <div>
                    <Header toggleBar={toggleBar} />
                </div>

                <div className='flex' style={{ height: '581px' }}>
                    {isOpen && (
                        <div className='border-1 w-2 overflow-y-scroll' ><SideNav /></div>
                    )}
                    <div className='border-1 w-full overflow-y-scroll p-4 '>
                        <div className=''><Outlet /></div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Defaultlayout