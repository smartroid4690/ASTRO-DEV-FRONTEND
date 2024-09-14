import React from 'react';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
    return (
        <div>
            <span className='flex gap-2 align-items-center text-600'>
                <FontAwesomeIcon icon={faClipboardList} />
                <Link to='/default/contact' className='outline-none no-underline text-600 '>Contact</Link>
            </span>
        </div>
    )
}

export default Contact
