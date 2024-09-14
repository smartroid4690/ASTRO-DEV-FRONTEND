import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { CascadeSelect } from 'primereact/cascadeselect';
import axios from 'axios';
import Card from '../components/Cart'
const Form = () => {
    const [update, setUpdate] = useState(false);
    const [getDetail, setGetDetail] = useState([]);
    const { control, handleSubmit, getValues, setValue } = useForm({
        defaultValues:
        {
            "requestor": 1,
            "base_metal_alloy": "",
            "alloy": "",
            "details": [
                {
                    "test": "",
                    "test_objects": [
                        {
                            "test_object": "",
                            "test_object_quantity": "",
                            "test_condition": "",
                            "test_condition_value": "",
                            "unit_dimension": "",
                            "object_dimension": [
                                {
                                    "unit": "",
                                    "dimension": "",
                                    "value": ""
                                }
                            ],
                            "test_parameters": []
                        }
                    ]
                }
            ]
        }
    });
    const baseAlloyOptions = ['Iron', "Zinc", "Palladium"];
    const alloyOptions = ["Aluminium", "Copper", "Palladium", "Lead", "Nickel"];
    const testOptions = [
        {
            label: 'Static Tests',
            children: [
                { label: 'Tensile', value: 1 },
                { label: 'High Cycle Fatigue', value: 2 },
                { label: 'Low Cycle Fatigue', value: 3 },
            ],
        },
        {
            label: 'Cyclic Test',
            children: [
                { label: 'Cyclic1', value: 4 },
                { label: 'Cyclic2', value: 5 },
                { label: 'Cyclic3', value: 6 },
            ],
        },
        {
            label: 'Metallurgic Test',
            children: [
                { label: 'Metalurgic1', value: 7 },
                { label: 'Metalurgic2', value: 8 },
                { label: 'Metalurgic3', value: 9 },
            ],
        }];
    const objectOptions = [{ label: "Flat Bar", value: 1 }, { label: "Round Bar", value: 2 }];
    const conditionOptions = [{ label: "LCF", value: 1 }, { label: "HCF", value: 2 }];
    const unitOptions = [{ label: "mm", value: 1 }, { label: "c", value: 2 }];
    const parameterOptions = [{ label: "Stress Ratio", value: 1 }, { label: "Max Stress", value: 2 }];
    const parameterUnitOptions = [{ label: "Farhenite", value: 1 }, { label: "Celsius", value: 2 }];
    const quotationDimensionOptions = [{ label: "c", value: 1 }, { label: "mm", value: 2 }];
    const quotationUnitDimensionOptions = [{ label: 'width', value: 1 }, { label: "height", value: 2 }];

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('https://zl00v3nn-8000.inc1.devtunnels.ms/r/quotation/', data);
            const details = response.data.data || [response.data];
            setGetDetail(details);
        } catch (error) {
            console.log("error occur", error.message);
        }
    };
    const addTest = (event) => {
        event.preventDefault();
        const newTest = {
            "test": '',
            "test_objects": [
                {
                    "test_object": '',
                    "test_object_quantity": "",
                    "test_condition": '',
                    "test_condition_value": "",
                    "unit_dimension": '',
                    "object_dimension": [
                        { "dimension": '', "value": "", "unit": '' }
                    ],
                    "test_parameters": []
                }
            ]
        };

        const values = getValues();
        const newTests = [...values.details, newTest];
        setValue('details', newTests);
        setUpdate((prev) => !prev);
    };
    const addTestObject = (e, testIndex) => {
        e.preventDefault();
        const newTestObject = {
            "test_object": '',
            "test_object_quantity": '',
            "test_condition": '',
            "test_condition_value": '',
            "unit_dimension": '',
            "object_dimension": [
                { "dimension": '', "value": "", "unit": '' }
            ],
            "test_parameters": []
        };
        const values = getValues();
        const newDetails = [...values.details];
        newDetails[testIndex].test_objects.push(newTestObject);
        setValue('details', newDetails);
        setUpdate((prev) => !prev);
    };
    const addObjectDimension = (e, testIndex, objIndex) => {
        e.preventDefault();
        const newDimension = { "unit": "", "dimension": "", "value": "" };
        const values = getValues();
        const newDetails = [...values.details];
        newDetails[testIndex].test_objects[objIndex].object_dimension.push(newDimension);
        setValue('details', newDetails);
        setUpdate(prev => !prev);
    };
    const handleParameterChange = (e, testIndex, objIndex) => {
        const selectedParameters = e.value;
        const values = getValues();
        const newDetails = [...values.details];
        const result = newDetails[testIndex].test_objects[objIndex];
        result.test_parameters = selectedParameters.map((parameter, paramIndex) => ({
            "test_parameter": parameter,
            "test_parameter_value": result.test_parameters[paramIndex]?.test_parameter_value || "",
            "unit_dimension": result.test_parameters[paramIndex]?.unit_dimension || ""
        }));
        setUpdate(prev => !prev);
        setValue('details', newDetails);
    };
    const getSelectedParameters = (testIndex, objIndex) => {
        const values = getValues();
        const newValues = [...values.details];
        if (newValues) {
            const returnValue = values.details[testIndex].test_objects[objIndex].test_parameters;
            return returnValue.map(param => param.test_parameter);
        }
    };

    return (
        <>
            <div className='flex w-11 mx-auto gap-5'>
                <div className='flex flex-column gap-4 w-12 mx-auto'>
                    <div className='pt-4 w-11 mx-auto'>
                        <h1 className='m-0 p-0'>GET YOUR QUOTATION</h1>
                    </div>
                    <div className='overflow-y-scroll bg-norepeat p-3 ' style={{ scrollbarWidth: 'none', maxHeight: '570px' }} >
                        <div className='main shadow-5 p-3 border-round-3xl surface-0' style={{ contain: 'content' }}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <>
                                    <div className='flex align-items-center justify-content-between mb-4 '>
                                        <label className='font-semibold'>Select Your Base Alloy</label>
                                        <div className='flex gap-3 align-items-center' >
                                            <Controller
                                                name="base_metal_alloy"
                                                control={control}
                                                render={({ field }) => (
                                                    <Dropdown {...field}
                                                        options={baseAlloyOptions}
                                                        placeholder="Select Base Alloy" className="w-full md:w-14rem " />
                                                )}
                                            />
                                            <FontAwesomeIcon className='text-gray-700' icon={faCircleExclamation} />
                                        </div>
                                    </div>

                                    <div className='flex align-items-center justify-content-between mb-2'>
                                        <label className='font-semibold'>Select Your Alloy</label>
                                        <div className='flex gap-3 align-items-center'>
                                            <Controller
                                                name="alloy"
                                                control={control}
                                                render={({ field }) => (
                                                    <Dropdown {...field} options={alloyOptions}
                                                        placeholder="Select Alloy" className="w-full md:w-14rem" />
                                                )}
                                            />
                                            <FontAwesomeIcon className='text-gray-700' icon={faCircleExclamation} />
                                        </div>
                                    </div>

                                    <div className='py-2'><hr /></div>

                                </>
                                {getValues().details.map((test, testIndex) => (
                                    <div key={testIndex}>
                                        <div className='flex flex-column gap-2 mt-4 '>
                                            <label className='font-semibold'>Select Your Test</label>
                                            <Controller
                                                name={`details[${testIndex}].test`}
                                                control={control}
                                                render={({ field }) => {
                                                    return <CascadeSelect
                                                        options={testOptions}
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.value.value))}
                                                        optionLabel="label"
                                                        optionGroupLabel="label"
                                                        optionGroupChildren={['children']}
                                                        className="w-full md:w-19rem"
                                                        breakpoint="767px"
                                                        placeholder="Select a Test"
                                                        value={testOptions.flatMap(option => option.children).find(child => child.value === field.value)}
                                                    />
                                                }}
                                            />
                                        </div>
                                        <div className='py-4'><hr /> </div>
                                        {test.test_objects.map((testObject, objIndex) => (
                                            <React.Fragment key={objIndex}>
                                                < div className='flex flex-column gap-2' >
                                                    <label className='font-semibold'>Test Objects</label>
                                                    <div className='flex align-items-center gap-3'>
                                                        <Controller
                                                            name={`details[${testIndex}].test_objects[${objIndex}].test_object`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Dropdown {...field}
                                                                    onChange={(e) => field.onChange(e.value)}
                                                                    optionLabel={testOptions.label}
                                                                    options={objectOptions}
                                                                    placeholder="Select Test Object" className="w-19rem" />
                                                            )}
                                                        />
                                                        <FontAwesomeIcon className='text-gray-700' icon={faCircleExclamation} />
                                                    </div>
                                                </div>
                                                < div className='py-4' ><hr /></div>
                                                <div className='mb-4'>
                                                    <div className='flex flex-column gap-2'>
                                                        <label className='font-semibold'>Test Conditions</label>
                                                        <Controller
                                                            name={`details[${testIndex}].test_objects[${objIndex}].test_condition`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Dropdown {...field}
                                                                    onChange={(e) => field.onChange(e.value)}
                                                                    options={conditionOptions}
                                                                    placeholder="Select Test Condition" className="w-19rem" />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='flex justify-content-between mb-4 align-items-center'>
                                                    <div className='flex gap-2 align-items-center'>
                                                        <label className='font-semibold'>Test Condition Value</label>
                                                        <FontAwesomeIcon className='text-gray-700' icon={faCircleExclamation} />
                                                    </div>
                                                    <Controller
                                                        name={`details[${testIndex}].test_objects[${objIndex}].test_condition_value`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <InputText {...field}
                                                                type='number'
                                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                placeholder='Enter Value' className="w-19rem" />
                                                        )}
                                                    />
                                                </div>
                                                <div className='flex justify-content-between align-items-center'>
                                                    <div className='flex gap-2'>
                                                        <label className='font-semibold'>Unit Dimension</label>
                                                        <FontAwesomeIcon className='text-gray-700' icon={faCircleExclamation} />
                                                    </div>
                                                    <Controller
                                                        name={`details[${testIndex}].test_objects[${objIndex}].unit_dimension`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Dropdown {...field}
                                                                onChange={(e) => field.onChange(e.value)}
                                                                options={unitOptions}
                                                                placeholder="Select Unit Dimension" className="w-19rem" />
                                                        )}
                                                    />
                                                </div>

                                                <div className='py-4'><hr /></div>
                                                <div>
                                                    <div className='flex flex-column gap-2'>
                                                        <label className='font-semibold'>Test Object Quantity</label>
                                                        <div className='flex gap-3 align-items-center'>
                                                            <Controller
                                                                name={`details[${testIndex}].test_objects[${objIndex}].test_object_quantity`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <InputText {...field} className="w-19rem"
                                                                        type='number'
                                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                        placeholder='Enter object quantity' />
                                                                )}
                                                            />
                                                            <FontAwesomeIcon className='text-gray-700' icon={faCircleExclamation} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='py-4'><hr /></div>
                                                {testObject.object_dimension.map((dim, dimIndex) => (
                                                    <div key={dimIndex}>
                                                        <div className='flex flex-column gap-2 mb-4'>
                                                            <label className='font-semibold'>Object Dimension</label>
                                                            <Controller
                                                                name={`details[${testIndex}].test_objects[${objIndex}].object_dimension[${dimIndex}].dimension`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Dropdown {...field}
                                                                        onChange={(e) => field.onChange(e.value)}
                                                                        options={quotationUnitDimensionOptions}
                                                                        placeholder="Select Dimension" className="w-19rem" />
                                                                )}
                                                            />
                                                        </div>
                                                        <div className='flex justify-content-between mb-4' >
                                                            <div className='flex gap-2 align-items-center'>
                                                                <label className='font-semibold'>Object dimension Unit</label>
                                                                <FontAwesomeIcon className='text-gray-700' icon={faCircleExclamation} />
                                                            </div>
                                                            <Controller
                                                                name={`details[${testIndex}].test_objects[${objIndex}].object_dimension[${dimIndex}].unit`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Dropdown {...field}
                                                                        onChange={(e) => field.onChange(e.value)}
                                                                        options={quotationDimensionOptions}
                                                                        placeholder="Select Unit" className="w-19rem" />
                                                                )}
                                                            />
                                                        </div>
                                                        <div className='flex justify-content-between align-items-center gap-2 mb-4'>
                                                            <div className='flex gap-2 align-items-center'>
                                                                <label className='font-semibold'>object dimnesion Value</label>
                                                                <FontAwesomeIcon className='text-gray-700' icon={faCircleExclamation} />
                                                            </div>
                                                            <Controller
                                                                name={`details[${testIndex}].test_objects[${objIndex}].object_dimension[${dimIndex}].value`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <InputText {...field}
                                                                        type='number'
                                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                        className="w-19rem" placeholder='Enter value' />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button onClick={(e) => addObjectDimension(e, testIndex, objIndex,)} className='mt-4 w-19rem' label="Add Dimension" />
                                                <div className='py-4'><hr /></div>
                                                <div className='flex flex-column gap-2 mb-4'>
                                                    <label className='font-semibold'>Test Parameter</label>
                                                    <Controller
                                                        name={`details[${testIndex}].test_objects[${objIndex}].test_parameters`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <MultiSelect
                                                                {...field}
                                                                options={parameterOptions}
                                                                value={getSelectedParameters(testIndex, objIndex)}
                                                                onChange={(e) => handleParameterChange(e, testIndex, objIndex)}
                                                                placeholder='Select your test parameter'
                                                                className="w-19rem"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                {getValues().details[testIndex].test_objects[objIndex].test_parameters.map((parameter, parameterIndex) => (
                                                    <div key={parameterIndex}>
                                                        <div className='flex justify-content-between align-items-center mb-4'>
                                                            <div className='flex gap-3 align-items-center'>
                                                                <label className='font-semibold'>Test Parameter Value</label>
                                                                <FontAwesomeIcon className='text-gray-700' icon={faCircleExclamation} />
                                                            </div>
                                                            <Controller
                                                                name={`details[${testIndex}].test_objects[${objIndex}].test_parameters[${parameterIndex}].test_parameter_value`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <InputText
                                                                        {...field}
                                                                        type='number'
                                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                        className="w-19rem"
                                                                        placeholder='Enter Value'
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                        <div className='flex justify-content-between align-items-center gap-2 mb-3'>
                                                            <div className='flex gap-3 align-items-center'>
                                                                <label className='font-semibold'>Test Parameter Unit</label>
                                                                <FontAwesomeIcon className='text-gray-700' icon={faCircleExclamation} />
                                                            </div>
                                                            <Controller
                                                                name={`details[${testIndex}].test_objects[${objIndex}].test_parameters[${parameterIndex}].unit_dimension`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Dropdown
                                                                        {...field}
                                                                        onChange={(e) => field.onChange(e.value)}
                                                                        options={parameterUnitOptions}
                                                                        placeholder="Select Unit"
                                                                        className="w-19rem"
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>

                                                ))}

                                                <div className='py-4'><hr /></div>
                                            </React.Fragment>
                                        ))}
                                        <Button onClick={(e) => addTestObject(e, testIndex)} className='mt-4 w-full' label="Add Test Object" />
                                        <div className='py-4'><hr /></div>
                                    </div>
                                ))}
                                <div className='flex justify-content-center'>
                                    <Button className='mt-4 w-3' type="submit" label="Submit" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className='w-5 mt-5 hidden lg:block'>
                    <Card getDetail={getDetail} onClick={addTest} />
                </div>
            </div >
        </>
    );
}
export default Form;