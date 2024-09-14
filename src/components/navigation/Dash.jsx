import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
const Dash = () => {
    return (
        <div>
            <span className='flex gap-2 align-items-center text-600 none'><FontAwesomeIcon icon={faTableCellsLarge} />
                <Link to='/' className='outline-none no-underline text-600'>Dashboard</Link>
            </span> 

        </div>
    )
}

export default Dash;