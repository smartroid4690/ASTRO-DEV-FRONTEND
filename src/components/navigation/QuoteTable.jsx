import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
const QuoteTable = () => {
    return (
        <>
            <span className='flex gap-2 align-items-center text-600'>
                <FontAwesomeIcon icon={faFileInvoiceDollar} />
                <Link to='/default/quotetable' className='outline-none no-underline text-600 '>My Quotation</Link>
            </span>

        </>
    )
}

export default QuoteTable;