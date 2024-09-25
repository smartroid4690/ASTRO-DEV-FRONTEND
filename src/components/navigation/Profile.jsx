import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
const Profile = () => {
  return (
    <div>
      <span className='flex gap-2 align-items-center text-600'>
        <FontAwesomeIcon icon={faFileInvoiceDollar} />
        <Link className='outline-none no-underline text-600 '>Profile</Link>
      </span>
    </div>
  )
}

export default Profile