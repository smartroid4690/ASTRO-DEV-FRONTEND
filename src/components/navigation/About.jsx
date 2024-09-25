import React from 'react';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpenReader } from "@fortawesome/free-solid-svg-icons";

const About = () => {
  return (
    <div>
      <span className='flex gap-2 align-items-center text-600'>
        <FontAwesomeIcon icon={faBookOpenReader} />
        <Link to='/default/about' className='outline-none no-underline text-600 '>About</Link>
      </span>

    </div>
  )
}

export default About
