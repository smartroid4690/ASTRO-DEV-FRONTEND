import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVials } from "@fortawesome/free-solid-svg-icons";

const Tests = () => {
  return (
    <div>
      <span className='flex gap-2 align-items-center text-600'>
        <FontAwesomeIcon icon={faVials} />
        <Link to='/default/tests' className='outline-none no-underline text-600 '>Tests</Link>
      </span>

    </div>
  )
}

export default Tests
