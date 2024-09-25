import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Accordion, AccordionTab } from 'primereact/accordion';
import axios from 'axios';

const QuotationView = () => {
    const { id } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        const getDetails = async () => {
            try {
                const response = await axios.get(`https://farheenkhan1995.pythonanywhere.com/r/quotation/${id}`);
                setData(response.data);
                console.log(response.data);
            } catch (error) {
                console.log('error occurred', error.message);
            }
        };
        getDetails();
    }, [id]);

    return (
        <div className='w-11 mx-auto p-3 mt-3 over'>
            <div>
                <div className='grid'>
                    <div className='col-2 text-color-secondary' >
                        <p>ID:</p>
                        <p>Requestor name:</p>
                        <p>Requestor email:</p>
                        <p>Date created:</p>
                        <p>Status:</p>
                    </div>
                    <div className='col font-semibold'>
                        <p> {data.id}</p>
                        <p> admin user</p>
                        <p> {data.requestor}</p>
                        <p> {data.date_created}</p>
                        <p> {data.status}</p>
                    </div>

                </div>
                <div className='mt-6 mb-1'>
                    <hr />
                </div>
                <div>
                    <div className='text-3xl text-color-secondary'>
                        <span>Quotation Details:</span>
                    </div>
                    <div className='mt-4 grid'>
                        <div className='col-1'>
                            <p className='text-color-secondary'>Base Metal:</p>
                            <p className='text-color-secondary'>Alloy:</p>
                        </div>
                        <div className='col'>
                            <p className='font-semibold'>{data.base_metal_alloy}</p>
                            <p className='font-semibold'>{data.alloy}</p>
                        </div>

                    </div>
                </div>
                <div className='mt-5 flex flex-column gap-3'>
                    <div className='text-2xl text-color-secondary'>
                        Quotation Tests:
                    </div>
                    <div>
                        <Accordion multiple className='mb-8'>
                            {data.details && data.details.map((detail, index) => (
                                <AccordionTab header={detail.test} key={index}>
                                    <table>
                                        <thead>
                                            <tr className='text-xs text-color-secondary px-8'>
                                                <th className='font-semibold pb-2 px-3'>TEST_OBJECT</th>
                                                <th className='font-semibold pb-2 px-3'>TEST_OBJECT_QUANTITY</th>
                                                <th className='font-semibold pb-2 px-3'>TEST_CONDITION</th>
                                                <th className='font-semibold pb-2 px-3'>TEST_CONDITION_VALUE</th>
                                                <th className='font-semibold pb-2 px-3'>UNIT_DIMENSION</th>
                                                <th className='font-semibold pb-2 px-3'>QUOTATION_OBJECT_DIMENSION</th>
                                                <th className='font-semibold pb-2 px-3'>QUOTATION_TEST_PARAMETER</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detail.test_objects.map((testObject, objIndex) => (
                                                <tr key={objIndex} className='text-xs font-semibold'>
                                                    <td className='font-semibold px-3'>{testObject.test_object}</td>
                                                    <td className='font-semibold px-3'>{testObject.test_object_quantity}</td>
                                                    <td className='font-semibold px-3'>{testObject.test_condition}</td>
                                                    <td className='font-semibold px-3'>{testObject.test_condition_value}</td>
                                                    <td className='font-semibold px-3'>{testObject.unit_dimension}</td>
                                                    <td className='font-semibold px-3'
                                                        style={{
                                                            maxHeight: '20px',
                                                            overflowY: 'scroll', 
                                                            paddingRight: '10px',
                                                            
                                                        }}>
                                                        {testObject.quotation_object_dimension.map((dimension, dimIndex) => (
                                                            <div key={dimIndex} className='flex gap-3'>
                                                                <div>
                                                                    {dimension.dimension}:
                                                                </div>
                                                                {dimension.value} {dimension.unit}
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td className='font-semibold px-3 text-center'
                                                        style={{
                                                            maxHeight: '20px',
                                                            overflowY: 'scroll',
                                                            paddingRight: '10px',
                                                            display: 'block'
                                                        }}>
                                                        {testObject.quotation_test_parameter.map((param, paramIndex) => (
                                                            <div key={paramIndex} className='flex gap-3'>
                                                                <div>
                                                                    {param.test_parameter}:
                                                                </div>
                                                                {param.test_parameter_value} {param.unit}
                                                            </div>
                                                        ))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </AccordionTab>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotationView;


