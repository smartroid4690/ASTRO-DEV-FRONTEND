import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignal } from "@fortawesome/free-solid-svg-icons";

const Status = () => {
  return (
    <div>
      <span className='flex gap-2 align-items-center text-600'>
        <FontAwesomeIcon icon={faSignal} />
        <Link className='outline-none no-underline text-600 '>Status</Link>
      </span>
    </div>
  )
}

export default Status