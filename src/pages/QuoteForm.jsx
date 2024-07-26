import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import axios from 'axios';

const QuoteForm = () => {
    const [currPage, setCurrPage] = useState(1);
    const [update, setUpdate] = useState(false);
    const { control, handleSubmit, getValues, setValue } = useForm({
        defaultValues:
        {
            base_metal_alloy: "",
            alloy: "",
            tests: [
                {
                    test: '',
                    test_objects: [
                        {
                            test_object: '',
                            test_conditions: [
                                {
                                    test_object_quantity: '',
                                    test_condition: '',
                                    unit_dimension_id: '',
                                    quotation_object_dimension: [
                                        { dimension_id: '', value: '', unit_id: '' }
                                    ],
                                    quotationtestparameters: []
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    });

    const baseAlloyOptions = ["Iron", "Tin", "Cobalt", "Zinc"];
    const alloyOptions = ["Aluminium", "Copper", "Palladium", "Lead", "Nickel"];
    const testOptions = ["Static", "Cyclic", "Metallurgic", "Tensile", "Sicklikel"];
    const objectOptions = ["Round", "Flat", "Cuboid", "Others"];
    const conditionOptions = ["Temperature", "Pressure", "Rigidness", "Hardness"];
    const unitOptions = ["c", "f", "k", 'h'];
    const parameterOptions = ["stress ratio", "strength", "Brutality", 'Porous'];
    const parameterUnitOptions = ["centimeter", "meter", "millimeter", 'micrometer'];
    const quotationDimensionOptions = ["cubic", "inch", "meter", "diameter", "etc"];
    const quotationUnitDimensionOptions = ["centimeter", "meter", "millimeter", 'micrometer'];

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('https://jsonplaceholder.typicode.com/posts', data);
            console.log('submitted', response.data);
        } catch (error) {
            console.log("error occur", error.message);
        }
    };

    const addTest = () => {
        const newTest = {
            test: '',
            test_objects: [
                {
                    test_object: '',
                    test_conditions: [
                        {
                            test_object_quantity: '',
                            test_condition: '',
                            unit_dimension_id: '',
                            quotation_object_dimension: [
                                { dimension_id: '', value: '', unit_id: '' }
                            ],
                            quotationtestparameters: []
                        }
                    ]
                }
            ]
        };

        const values = getValues();
        const newTests = [...values.tests, newTest];
        setValue('tests', newTests);
        setUpdate((prev) => !prev);
    };

    const addTestObject = (testIndex) => {
        const newTestObject = {
            test_object: '',
            test_conditions: [
                {
                    test_object_quantity: '',
                    test_condition: '',
                    unit_dimension_id: '',
                    quotation_object_dimension: [
                        { dimension_id: '', value: '', unit_id: '' }
                    ],
                    quotationtestparameters: []
                }
            ]
        };

        const values = getValues();
        const newTests = [...values.tests];
        newTests[testIndex].test_objects.push(newTestObject);
        setValue('tests', newTests);
        setUpdate((prev) => !prev);
    };

    const addTestCondition = (testIndex, testObjectIndex) => {
        const newCondition = {
            test_object_quantity: '',
            test_condition: '',
            unit_dimension_id: '',
            quotation_object_dimension: [
                { dimension_id: '', value: '', unit_id: '' }
            ],
            quotationtestparameters: []
        };

        const values = getValues();
        const newTests = [...values.tests];
        newTests[testIndex].test_objects[testObjectIndex].test_conditions.push(newCondition);
        setValue('tests', newTests);
        setUpdate((prev) => !prev);
    };

    const handleParameterChange = (e, testIndex, objIndex, condIndex) => {
        const selectedParameters = e.value;
        const values = getValues();
        const newTests = [...values.tests];
        newTests[testIndex].test_objects[objIndex].test_conditions[condIndex].quotationtestparameters = selectedParameters.map(parameter => ({
            test_parameter: parameter,
            test_parameter_value: '',
            unit_dimension: ''
        }));

        setValue('tests', newTests);
        setUpdate(prev => !prev);
    };

    const getSelectedParameters = (testIndex, objIndex, condIndex) => {
        const values = getValues();
        return values.tests[testIndex].test_objects[objIndex].test_conditions[condIndex].quotationtestparameters.map(param => param.test_parameter);
    };

    return (
        <div className='surface-500 border-round-lg'>
            <h1 className='w-5 mx-auto'>Get your Quotation Ready</h1>
            <div className="form_Container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {currPage === 1 && (
                        <div className='flex flex-column  border-1 m-2 border-round-lg justify-content-center p-3 '>
                            {/* base-alloy-start */}
                            <div className='flex flex-column gap-2 '>
                                <label className='font-semibold'>Select Your Base Alloy</label>
                                <Controller
                                    name="base_metal_alloy"
                                    control={control}
                                    render={({ field }) => (
                                        <Dropdown {...field} options={baseAlloyOptions}
                                            placeholder="Select Base Alloy" className="w-full " />
                                    )}
                                />
                            </div>
                            {/* base-alloy-end */}

                            {/* alloy-start */}
                            <div className='flex flex-column gap-2 mt-4'>
                                <label className='font-semibold'>Select Your Alloy</label>
                                <Controller
                                    name="alloy"
                                    control={control}
                                    render={({ field }) => (
                                        <Dropdown {...field} options={alloyOptions}
                                            placeholder="Select Alloy" className="w-full" />
                                    )}
                                />
                            </div>
                            {/* alloy-end */}

                            {/* button */}
                            <div className='flex justify-content-center'>
                                <Button onClick={() => setCurrPage((currPage) => currPage + 1)} className='mt-4 w-2' label="Next" />
                            </div>
                        </div>
                    )}
                    {currPage === 2 && (
                        <div className=''>
                            {getValues().tests.map((test, testIndex) => (
                                <div key={testIndex}>
                                    {/* test-start */}
                                    <div className='flex flex-column gap-2 w-9 mx-auto'>
                                        <label className='font-semibold'>Select Test To Perform</label>
                                        <Controller
                                            name={`tests[${testIndex}].test`}
                                            control={control}
                                            render={({ field }) => (
                                                <Dropdown {...field} options={testOptions}
                                                    placeholder="Select Test" className="w-full" />
                                            )}
                                        />
                                    </div>
                                    {/* test-end */}
                                    {test.test_objects.map((testObject, objIndex) => (
                                        <div key={objIndex} className='border-1 bg-white p-5 w-9 mx-auto mt-2 border-round-lg'>
                                            {/* object-start */}
                                            <div className='flex flex-column gap-2 mb-2 '>
                                                <label className='font-semibold'>Select Test Object</label>
                                                <Controller
                                                    name={`tests[${testIndex}].test_objects[${objIndex}].test_object`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Dropdown {...field} options={objectOptions}
                                                            placeholder="Select Test Object" className="w-full md:w-14rem" />
                                                    )}
                                                />
                                            </div>
                                            {/* object-end */}
                                            {testObject.test_conditions.map((condition, condIndex) => (
                                                <div key={condIndex} className='border-round-lg surface-900 text-white p-3 mb-2'>
                                                    {/* test_condition-start */}
                                                    <div className='flex flex-column gap-2 mb-2'>
                                                        <label className='font-semibold'>Select Your Test Condition</label>
                                                        <div className='flex'>
                                                            <Controller
                                                                name={`tests[${testIndex}].test_objects[${objIndex}].test_conditions[${condIndex}].test_condition`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Dropdown {...field} options={conditionOptions}
                                                                        placeholder="Test Condition" className="w-2 border-noround-right " />
                                                                )}
                                                            />
                                                            <Controller
                                                                name={`tests[${testIndex}].test_objects[${objIndex}].test_conditions[${condIndex}].quantity`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <InputText {...field} placeholder='Condition Value' className='border-noround w-3' />
                                                                )}
                                                            />
                                                            <Controller
                                                                name={`tests[${testIndex}].test_objects[${objIndex}].test_conditions[${condIndex}].unit_dimension_id`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Dropdown {...field} options={unitOptions}
                                                                        placeholder="Unit" className="w-1 border-noround-left" />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* test_condition-end */}

                                                    {/* test_object-qty-start */}

                                                    <div className='flex flex-column gap-2 mb-2'>
                                                        <label className='font-semibold'>Add Test Object Quantity</label>
                                                        <Controller
                                                            name={`tests[${testIndex}].test_objects[${objIndex}].test_conditions[${condIndex}].test_object_quantity`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <InputText {...field} placeholder='Enter Quantity' />
                                                            )}
                                                        />
                                                    </div>
                                                    {/* test_object-qty-end */}

                                                    {/* test_obj_dimension-start */}
                                                    <div className='flex flex-column gap-2 mb-2'>
                                                        <label className='font-semibold'>Quotation Object Dimension</label>
                                                        <div className='flex'>
                                                            {condition.quotation_object_dimension.map((dimension, dimIndex) => (
                                                                <React.Fragment key={dimIndex}>
                                                                    <Controller
                                                                        name={`tests[${testIndex}].test_objects[${objIndex}].test_conditions[${condIndex}].quotation_object_dimension[${dimIndex}].dimension_id`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <Dropdown {...field} options={quotationDimensionOptions}
                                                                                placeholder="Select Quotation Object Dimension" className="w-2 border-noround-right" />
                                                                        )}
                                                                    />
                                                                    <Controller
                                                                        name={`tests[${testIndex}].test_objects[${objIndex}].test_conditions[${condIndex}].quotation_object_dimension[${dimIndex}].value`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <InputText {...field} placeholder='Enter Dimension Value' className='w-3 border-noround' />
                                                                        )}
                                                                    />
                                                                    <Controller
                                                                        name={`tests[${testIndex}].test_objects[${objIndex}].test_conditions[${condIndex}].quotation_object_dimension[${dimIndex}].unit_id`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <Dropdown {...field} options={quotationUnitDimensionOptions}
                                                                                placeholder="Select Unit" className="w-1 border-noround-left" />
                                                                        )}
                                                                    />
                                                                </React.Fragment>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {/* test-obj-dimesnion-end */}

                                                    {/* test_parameter-start */}
                                                    <div className='flex flex-column gap-2'>
                                                        <label className='font-semibold'>Quotation Test Parameters</label>
                                                        <Controller
                                                            name={`tests[${testIndex}].test_objects[${objIndex}].test_conditions[${condIndex}].quotationtestparameters`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <MultiSelect
                                                                    {...field}
                                                                    options={parameterOptions}
                                                                    value={getSelectedParameters(testIndex, objIndex, condIndex)}
                                                                    onChange={(e) => handleParameterChange(e, testIndex, objIndex, condIndex)}
                                                                    placeholder="Select Parameters"
                                                                    className="w-full md:w-14rem"
                                                                />
                                                            )}
                                                        />
                                                        <div className='flex gap-2'>
                                                            {condition.quotationtestparameters.map((parameter, paramIndex) => (
                                                                <React.Fragment key={paramIndex}>
                                                                    <div className='flex flex-column gap-2'>
                                                                        <Controller
                                                                            name={`tests[${testIndex}].test_objects[${objIndex}].test_conditions[${condIndex}].quotationtestparameters[${paramIndex}].test_parameter_value`}
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <InputText {...field} placeholder='Enter Parameter Value' />
                                                                            )}
                                                                        />
                                                                        <Controller
                                                                            name={`tests[${testIndex}].test_objects[${objIndex}].test_conditions[${condIndex}].quotationtestparameters[${paramIndex}].unit_dimension`}
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <Dropdown {...field} options={parameterUnitOptions}
                                                                                    placeholder="Select Unit" className="w-full md:w-14rem" />
                                                                            )}
                                                                        />
                                                                    </div>

                                                                </React.Fragment>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {/* test_parameter-end */}
                                                </div>
                                            ))}
                                            {/* button */}
                                            <div>
                                                <Button onClick={() => addTestCondition(testIndex, objIndex)} className='mt-4 w-2' label="Add Conditions" />
                                            </div>
                                        </div>
                                    ))}
                                    {/* button */}
                                    <div className='w-9 mx-auto flex justify-content-between'>
                                        <Button onClick={() => addTestObject(testIndex)} className='mt-4 w-2' label="Add test object" />
                                    </div>
                                </div>
                            ))}
                            {/* button */}
                            <div className='w-9 mx-auto flex justify-content-between'>
                                <Button onClick={addTest} className='mt-4 w-2' label="Add New Test" />
                            </div>
                        </div>
                    )}
                    {/* button */}
                    <div className='w-9 mx-auto flex justify-content-between py-4'>
                        {currPage > 1 && <Button onClick={() => setCurrPage((currPage) => currPage - 1)} className='mt-4 w-2' label="Prev" />}
                        {currPage > 1 && <Button type="submit" className='mt-4 w-2 bg-red-500' label="Submit" />}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuoteForm;
