import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Quotationtable = () => {
    const [selectedQuoteId, setSelectedQuoteId] = useState(null);
    const [quotes, setQuotes] = useState([]);

    useEffect(() => {
        const getdata = async () => {
            try {
                const response = await axios.get('https://farheenkhan1995.pythonanywhere.com/r/quotation/');
                setQuotes(response.data);
            } catch (error) {
                console.log("error Occur getting Quotations", error.message);
            }
        };
        getdata();
    }, []);

    const handleCheckboxChange = (id) => {
        setSelectedQuoteId(prevId => (prevId === id ? null : id));
    };

    return (
        <>
            <div className='w-11 mx-auto p-3 mt-3'>
                <div className='flex flex-column gap-3'>
                    <div className='text-3xl font-semibold'>
                        <span>Select quotation to view</span>
                    </div>
                    <div className='flex gap-3 align-items-center'>
                        <div className='flex gap-3 align-items-center '>
                            <span className='text-lg'>Action:</span>
                            <span>
                                <Dropdown
                                    placeholder="-------------"
                                    className="w-full md:w-17rem h-2rem border-round-lg"
                                />
                            </span>
                        </div>
                        <div className='flex gap-5'>
                            <span>Go</span>
                            <span className='text-color-secondary'>
                                 0 of 5 Selected
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mt-5">
                    <table className="w-full text-left">
                        <thead className="text-xs text-gray-700 uppercase surface-200">
                            <tr>
                                <th className="px-2 py-3">
                                    <Checkbox />
                                </th>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">REQUESTOR</th>
                                <th className="px-6 py-3">Date CREATED</th>
                                <th className="px-6 py-3">STATUS</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotes.map((quote) => (
                                <tr
                                    key={quote.id}
                                    className={`border-b ${quote.id % 2 !== 0 ? 'bg-gray-300 bg-white' : 'bg-gray-300'}`}
                                >
                                    <td className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <Checkbox
                                            onChange={() => handleCheckboxChange(quote.id)}
                                            checked={selectedQuoteId === quote.id}
                                        />
                                    </td>
                                    <td className="px-6 py-2">{quote.id}</td>
                                    <td className="px-6 py-2">useradmin</td>
                                    <td className="px-6 py-2">{quote.requestor}</td>
                                    <td className="px-6 py-2">{quote.date_created}</td>
                                    <td className='px-6 py-2'>{quote.status}</td>
                                    <td className='px-6 py-2'>
                                        <Link to={`/default/view/${quote.id}`} className='outline-none no-underline text-600'>
                                            <FontAwesomeIcon icon={faEye} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Quotationtable;
