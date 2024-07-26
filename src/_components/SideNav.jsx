import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faGear,
  faNewspaper,
  faBook,
  faTable,
  faCalendarDay,
  faCommentDollar,
  faClipboardList,
  faChalkboardUser,
  faHollyBerry,
  faBuilding,
  faBookOpenReader,
  faTableCellsLarge,
  faFileInvoiceDollar,
  faSignal
} from "@fortawesome/free-solid-svg-icons";

const SideNav = () => {

  return (
    <>
      <div>
        <ul className='gap-6 flex flex-column mt-4'>
          <span className='flex gap-2 align-items-center'><FontAwesomeIcon icon={faTableCellsLarge} />
            <Link to='/' className='outline-none no-underline text-600'>Dashboard</Link>
          </span>
          <span className='flex gap-2 align-items-center'>
            <FontAwesomeIcon icon={faBookOpenReader} />
            <Link to='/quote' className='outline-none no-underline text-600'>QuoteForm</Link>
          </span>
          <span className='flex gap-2 align-items-center'>
            <FontAwesomeIcon icon={faFileInvoiceDollar} />
            <Link className='outline-none no-underline text-600'>Profile</Link>
          </span>
          <span className='flex gap-2 align-items-center'>
            <FontAwesomeIcon icon={faSignal} />
            <Link className='outline-none no-underline text-600'>Status</Link>
          </span>

        </ul>
      </div>
    </>
  )
}

export default SideNav