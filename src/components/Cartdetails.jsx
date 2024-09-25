import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

const Cartdetails = ({ getDetail }) => {
    const [isOpen, setIsOpen] = useState([]);
    const [isObjectOpen, setIsObjectOpen] = useState([]);

    const toggleArrow = (index) => {
        setIsOpen((prevState) =>
            prevState.includes(index)
                ? prevState.filter((i) => i !== index)
                : [...prevState, index]
        );
    };

    const toggleObjectArrow = (index) => {
        setIsObjectOpen((prevState) =>
            prevState.includes(index)
                ? prevState.filter((i) => i !== index)
                : [...prevState, index]
        );
    };
    return (
        <>
            {getDetail.map((detail, detailIndex) => (
                <div key={detailIndex} className="w-19rem">
                    <div className=" text-lg flex justify-content-between py-3">
                        <span className="font-semibold text-600">{detail.alloy}</span>
                        <span className="text-700 cursor-pointer">
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </span>
                    </div>

                    {detail.details.map((item, itemIndex) => (
                        <div key={itemIndex} className="h-auto border-round-lg shadow-2 mb-2 py-2 surface-0">
                            <div onClick={() => toggleArrow(itemIndex)}
                                className="cursor-pointer w-18rem flex align-items-center gap-3 p-3 mb-1">
                                <FontAwesomeIcon icon={isOpen.includes(itemIndex) ? faAngleDown : faAngleRight} />
                                <span>{item.test}</span>
                            </div>

                            {isOpen.includes(itemIndex) && (
                                <div className="ml-3  ">
                                    {item.test_objects.map((testObject, testObjectIndex) => (
                                        <div key={testObjectIndex}>
                                            <div onClick={() => toggleObjectArrow(`${itemIndex}-${testObjectIndex}`)}
                                                className="cursor-pointer w-18rem flex align-items-center gap-2 mb-3  ml-3" >
                                                <FontAwesomeIcon icon={
                                                    isObjectOpen.includes(`${itemIndex}-${testObjectIndex}`)
                                                        ? faAngleDown
                                                        : faAngleRight
                                                } />
                                                <span>{testObject.test_object}</span>
                                            </div>

                                            {isObjectOpen.includes(`${itemIndex}-${testObjectIndex}`) && (
                                                <div className="ml-5">
                                                    <p>Object Quantity: {testObject.test_object_quantity}</p>
                                                    <p>Test Condition: {testObject.test_condition}</p>
                                                    <p>Test Condition Value: {testObject.test_condition_value}</p>
                                                    <p>Unit Dimension: {testObject.unit_dimension}</p>

                                                    <div className="pb-3">
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th className="pr-2">Dimension</th>
                                                                    <th className="pr-2">Value</th>
                                                                    <th>Unit</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {testObject.quotation_object_dimension.map((dim, dimIndex) => (
                                                                    <tr key={dimIndex}>
                                                                        <td>{dim.dimension}</td>
                                                                        <td>{dim.value}</td>
                                                                        <td>{dim.unit}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div className="pb-3">
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th className="pr-2">Parameter</th>
                                                                    <th className="pr-2">Value</th>
                                                                    <th>Unit</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {testObject.quotation_test_parameter.map((param, paramIndex) => (
                                                                    <tr key={paramIndex}>
                                                                        <td>{param.test_parameter}</td>
                                                                        <td>{param.test_parameter_value}</td>
                                                                        <td>{param.unit}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
};

export default Cartdetails;
