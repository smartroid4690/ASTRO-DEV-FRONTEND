import React, { useEffect, useState } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useQuery } from "@tanstack/react-query";
import { ButtonGroup } from "primereact/buttongroup";
import { CascadeSelect } from "primereact/cascadeselect";
import {
	getTestCategories,
	getTestObjects,
	getUnitDimensionsByConditionId,
	getDimensions,
} from "../services/quotationService";
import CustomDivider from "../components/CustomDivider";
const TestDetails = ({
	control,
	index,
	setValue,
	testConditionQuery,
	testParamQuery,
	updateTestParameter,
	unitDimensionsQuery,
	updateTest,
}) => {
	const [selectedTestId, setSelectedTestId] = useState(null);
	const [selectedDimensions, setSelectedDimensions] = useState({});
	const [selectedParameters, setSelectedParameters] = useState({});

	const {
		fields: testObjectFields,
		append: appendTestObject,
		remove: removeTestObject,
	} = useFieldArray({
		control,
		name: `details[${index}].test_objects`,
	});

	const { data: tests = [], isLoading: isTestsLoading } = useQuery({
		queryKey: ["testCategories"],
		queryFn: getTestCategories,
	});

	const { data: testObjects = [], isLoading: isTestObjectsLoading } = useQuery({
		queryKey: ["testObjects"],
		queryFn: getTestObjects,
		enabled: !!selectedTestId,
	});

	const { data: dimensions = [], isLoading: isDimensionsLoading } = useQuery({
		queryKey: ["dimensions"],
		queryFn: getDimensions,
	});
	useEffect(() => {
		const newSelectedDimensions = {};
		const newSelectedParameters = {};

		testObjectFields.forEach((testObject, objIndex) => {
			testObject.test_parameters.forEach((parameter, paramIndex) => {
				newSelectedParameters[`${objIndex}-${paramIndex}`] =
					parameter.test_parameter;
			});

			testObject.object_dimension.forEach((dimension, dimIndex) => {
				newSelectedDimensions[`${objIndex}-${dimIndex}`] = dimension.dimension;
			});
		});
		setSelectedDimensions(newSelectedDimensions);
		setSelectedParameters(newSelectedParameters);
	}, [testObjectFields]);

	const addTestObject = (e) => {
		e.preventDefault();
		appendTestObject({
			test_object: "",
			test_object_quantity: "",
			test_condition: "",
			test_condition_value: "",
			unit_dimension: "",
			object_dimension: [{ dimension: "", value: "", unit: "" }],
			test_parameters: [],
		});
	};

	const addObjectDimension = (e, objIndex) => {
		e.preventDefault();
		const newDimensions = [
			...(control._formValues.details[index].test_objects[objIndex]
				.object_dimension || []),
			{ unit: "", dimension: "", value: "" },
		];
		setValue(
			`details[${index}].test_objects[${objIndex}].object_dimension`,
			newDimensions
		);

		// Update selectedDimensions state
		setSelectedDimensions((prev) => ({
			...prev,
			[`${objIndex}-${newDimensions.length - 1}`]: "",
		}));
	};

	const removeObjectDimension = (objIndex, dimIndex) => {
		const currentDimensions =
			control._formValues.details[index].test_objects[objIndex]
				.object_dimension;
		setValue(
			`details[${index}].test_objects[${objIndex}].object_dimension`,
			currentDimensions.filter((_, i) => i !== dimIndex)
		);

		// Update selectedDimensions state
		setSelectedDimensions((prev) => {
			const newState = { ...prev };
			delete newState[`${objIndex}-${dimIndex}`];
			return newState;
		});
	};

	const addTestParameter = (e, objIndex) => {
		e.preventDefault();

		console.log(testParamQuery?.data?.length);
		console.log("param added");
		const newParameters = [
			...(control._formValues.details[index].test_objects[objIndex]
				.test_parameters || []),
			{ test_parameter: "", test_parameter_value: "", unit_dimension: "" },
		];
		setValue(
			`details[${index}].test_objects[${objIndex}].test_parameters`,
			newParameters
		);

		// Update selectedParameters state
		setSelectedParameters((prev) => ({
			...prev,
			[`${objIndex}-${newParameters.length - 1}`]: "",
		}));
	};

	const removeTestParameter = (objIndex, paramIndex) => {
		const currentParameters =
			control._formValues.details[index].test_objects[objIndex].test_parameters;
		setValue(
			`details[${index}].test_objects[${objIndex}].test_parameters`,
			currentParameters.filter((_, i) => i !== paramIndex)
		);

		// Update selectedParameters state
		setSelectedParameters((prev) => {
			const newState = { ...prev };
			delete newState[`${objIndex}-${paramIndex}`];
			return newState;
		});
	};

	const handleTestChange = (e) => {
		setValue(`details[${index}].test`, e.value.value);
		setValue(`details[${index}].testLabel`, e.value.label);
		updateTest({
			id: e.value.value,
			selectedConditionId: null,
			index: index,
			label: e.value.label,
		});
		setSelectedTestId(e.value.value);
	};

	const handleConditionChange = (e, objIndex) => {
		setValue(
			`details[${index}].test_objects[${objIndex}].test_condition`,
			e.value
		);
		updateTest({ selectedConditionId: e.value });
	};

	const handleDimensionChange = (e, objIndex, dimIndex) => {
		setValue(
			`details[${index}].test_objects[${objIndex}].object_dimension[${dimIndex}].dimension`,
			e.value
		);

		setSelectedDimensions((prev) => ({
			...prev,
			[`${objIndex}-${dimIndex}`]: e.value,
		}));

		setValue(
			`details[${index}].test_objects[${objIndex}].object_dimension[${dimIndex}].unit`,
			""
		);

		updateTest({ selectedDimension: e.value });
	};

	const handleParameterChange = (e, objIndex, paramIndex) => {
		setValue(
			`details[${index}].test_objects[${objIndex}].test_parameters[${paramIndex}].test_parameter`,
			e.value
		);

		setSelectedParameters((prev) => ({
			...prev,
			[`${objIndex}-${paramIndex}`]: e.value,
		}));

		setValue(
			`details[${index}].test_objects[${objIndex}].test_parameters[${paramIndex}].unit_dimension`,
			""
		);

		updateTest({ selectedParameter: e.value });
	};

	const handleConditionValueChange = (e, objIndex, value, isOptionsEmpty) => {
		if (isOptionsEmpty) {
			setValue(
				`details[${index}].test_objects[${objIndex}].test_condition_value`,
				null
			);
		} else {
			setValue(
				`details[${index}].test_objects[${objIndex}].test_condition_value`,
				e.target.value
			);
		}
	};

	return (
		<div>
			<div className="flex  justify-content-between align-items-end mb-5 mt-4 ">
				<div className="flex flex-column gap-2 ">
					<label className="font-semibold">Select Your Test</label>
					<Controller
						name={`details[${index}].test`}
						control={control}
						render={({ field }) => {
							const findItemByValue = (options, value) => {
								for (const option of options) {
									if (option.value === value) {
										return option;
									} else if (option.children) {
										const found = findItemByValue(option.children, value);
										if (found) {
											return found;
										}
									}
								}
								return null;
							};

							return (
								<CascadeSelect
									options={tests}
									{...field}
									onChange={(e) => handleTestChange(e)}
									optionLabel="label"
									loading={isTestsLoading}
									optionGroupLabel="label"
									optionGroupChildren={["children", "children", "children"]}
									className="w-full md:w-16rem"
									breakpoint="767px"
									placeholder="Select a Test"
									value={findItemByValue(tests, field.value)}
								/>
							);
						}}
					/>
				</div>
			</div>

			{testObjectFields.map((testObject, objIndex) => (
				<div key={testObject.id} className="flex flex-column gap-4 px-4 ">
					{/*  TEST OBJECTS */}
					<div className="flex justify-content-between align-items-end mt-2">
						<div className="flex flex-column gap-2">
							<label className="font-semibold">Test Objects</label>
							<div className="flex gap-2">
								<Controller
									name={`details[${index}].test_objects[${objIndex}].test_object`}
									control={control}
									render={({ field }) => (
										<Dropdown
											{...field}
											loading={isTestObjectsLoading}
											onChange={(e) => field.onChange(e.value)}
											options={testObjects}
											placeholder="Select Test Object"
											className="w-16rem flex-grow-1 max-w-18rem flex-shrink-1"
										/>
									)}
								/>
								<Controller
									name={`details[${index}].test_objects[${objIndex}].test_object_quantity`}
									control={control}
									render={({ field }) => (
										<InputText
											{...field}
											type="number"
											placeholder="Object Quantity"
											className="w-16rem flex-grow-1 max-w-18rem flex-shrink-1"
											// max={}
										/>
									)}
								/>
								<Button
									icon="pi pi-times"
									onClick={() => removeTestObject(objIndex)}
									rounded
									text
									disabled={testObjectFields.length <= 1}
									tooltip={
										testObjectFields.length <= 1
											? "Atleast one test object is required"
											: "Delete test object and related fields"
									}
									tooltipOptions={{ showOnDisabled: true }}
									severity={
										testObjectFields.length <= 1 ? "secondary" : "danger"
									}
								/>
							</div>
						</div>

						<Button
							icon="pi pi-plus"
							label={"Add"}
							onClick={(e) => addTestObject(e)}
							rounded
							text
							tooltip="Add test object"
							className="p-0"
							aria-label="Add Test Object"
						/>
					</div>

					{/* TEST CONDITIONS */}
					<div className="flex flex-column gap-2 ">
						<div className="p-inputgroup">
							<div className="flex flex-column gap-2 mt-2">
								<label className="font-semibold">Test Condition</label>
								<div className="flex gap-2">
									<Controller
										name={`details[${index}].test_objects[${objIndex}].test_condition`}
										control={control}
										render={({ field }) => {
											const isOptionsEmpty =
												testConditionQuery?.data?.length === 0;

											return (
												<Dropdown
													{...field}
													options={testConditionQuery?.data || []}
													loading={testConditionQuery?.isLoading}
													onChange={(e) => handleConditionChange(e, objIndex)}
													placeholder={
														isOptionsEmpty
															? "No Conditions Available"
															: "Select Condition"
													}
													value={isOptionsEmpty ? "" : field.value}
													disabled={isOptionsEmpty}
													className="w-16rem flex-grow-1 max-w-18rem flex-shrink-1"
												/>
											);
										}}
									/>

									<Controller
										name={`details[${index}].test_objects[${objIndex}].test_condition_value`}
										control={control}
										render={({ field }) => {
											const isOptionsEmpty =
												testConditionQuery?.data?.length === 0;

											return (
												<InputText
													{...field}
													type="number"
													placeholder="Condition Value"
													// value={isOptionsEmpty ? null : field.value}
													onChange={(e) =>
														handleConditionValueChange(
															e,
															objIndex,
															field.value,
															isOptionsEmpty
														)
													}
													disabled={isOptionsEmpty}
													className="w-16rem flex-grow-1 max-w-18rem flex-shrink-1"
												/>
											);
										}}
									/>

									<Controller
										name={`details[${index}].test_objects[${objIndex}].unit_dimension`}
										control={control}
										render={({ field }) => {
											const isOptionsEmpty =
												testConditionQuery?.data?.length === 0;

											return (
												<Dropdown
													{...field}
													options={unitDimensionsQuery?.data || []}
													loading={unitDimensionsQuery?.isLoading}
													placeholder="Unit"
													value={isOptionsEmpty ? "" : field.value}
													disabled={isOptionsEmpty}
													className="w-16rem flex-grow-1 max-w-18rem flex-shrink-1"
												/>
											);
										}}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* OBJECT DIMENSIONS */}
					<div className="flex flex-column gap-2 mt-2">
						<div className="flex w-full justify-content-between align-items-end">
							<label className="font-semibold">Object Dimensions</label>
							<Button
								icon="pi pi-plus"
								label="Add"
								rounded
								className="p-0"
								text
								onClick={(e) => addObjectDimension(e, objIndex)}
							/>
						</div>
						{control._formValues.details[index]?.test_objects[
							objIndex
						].object_dimension.map((dimension, dimIndex) => (
							<div key={dimIndex} className="flex align-items-center gap-2">
								<Controller
									name={`details[${index}].test_objects[${objIndex}].object_dimension[${dimIndex}].dimension`}
									control={control}
									render={({ field }) => (
										<Dropdown
											{...field}
											options={dimensions}
											loading={isDimensionsLoading}
											optionLabel="label"
											optionValue="id"
											onChange={(e) =>
												handleDimensionChange(e, objIndex, dimIndex)
											}
											placeholder="Select Dimension"
											className="w-16rem flex-grow-1 max-w-18rem flex-shrink-1"
										/>
									)}
								/>
								<Controller
									name={`details[${index}].test_objects[${objIndex}].object_dimension[${dimIndex}].value`}
									control={control}
									render={({ field }) => (
										<InputText
											{...field}
											type="number"
											placeholder="Enter Value"
											className="w-16rem flex-grow-1 max-w-18rem flex-shrink-1"
										/>
									)}
								/>
								<Controller
									name={`details[${index}].test_objects[${objIndex}].object_dimension[${dimIndex}].unit`}
									control={control}
									render={({ field }) => {
										const selectedDimension = dimensions.find(
											(param) =>
												param.id ===
												selectedDimensions[`${objIndex}-${dimIndex}`]
										);

										const unitOptions = selectedDimension
											? selectedDimension.units
											: [];

										return (
											<Dropdown
												{...field}
												options={unitOptions}
												optionLabel="label"
												optionValue="id"
												loading={isDimensionsLoading}
												disabled={
													!selectedDimensions[`${objIndex}-${dimIndex}`]
												}
												placeholder="Select Unit"
												className="w-16rem flex-grow-1 max-w-18rem flex-shrink-1"
											/>
										);
									}}
								/>
								<Button
									icon="pi pi-times"
									onClick={() => removeObjectDimension(objIndex, dimIndex)}
									rounded
									text
									disabled={
										control._formValues.details[index]?.test_objects[objIndex]
											.object_dimension.length <= 1
									}
									tooltip={
										control._formValues.details[index]?.test_objects[objIndex]
											.object_dimension.length <= 1
											? "Atleast one dimension is required"
											: ""
									}
									tooltipOptions={{ showOnDisabled: true }}
									severity={
										control._formValues.details[index]?.test_objects[objIndex]
											.object_dimension.length <= 1
											? "secondary"
											: "danger"
									}
								/>
							</div>
						))}
					</div>

					{/* TEST PARAMETERS */}
					<div className="flex flex-column gap-2 mt-2">
						<div className="flex w-full justify-content-between align-items-end">
							<label className="font-semibold">Test Parameters</label>
							<Button
								icon="pi pi-plus"
								onClick={(e) => addTestParameter(e, objIndex)}
								className="p-0"
								rounded
								label="Add"
								text
								disabled={!selectedTestId || testParamQuery?.data?.length <= 0}
							/>
						</div>
						{selectedTestId ? (
							testParamQuery?.data?.length > 0 ? (
								control._formValues.details[index]?.test_objects[
									objIndex
								].test_parameters.map((parameter, paramIndex) => (
									<div
										key={paramIndex}
										className="flex align-items-center gap-2"
									>
										<Controller
											name={`details[${index}].test_objects[${objIndex}].test_parameters[${paramIndex}].test_parameter`}
											control={control}
											render={({ field }) => (
												<Dropdown
													{...field}
													onChange={(e) =>
														handleParameterChange(e, objIndex, paramIndex)
													}
													options={testParamQuery?.data || []}
													loading={testParamQuery?.isLoading}
													optionLabel="label"
													optionValue="id"
													placeholder="Select Parameter"
													className="w-16rem flex-grow-1 max-w-18rem flex-shrink-1"
												/>
											)}
										/>
										<Controller
											name={`details[${index}].test_objects[${objIndex}].test_parameters[${paramIndex}].test_parameter_value`}
											control={control}
											render={({ field }) => (
												<InputText
													{...field}
													type="number"
													placeholder="Enter Value"
													className="w-16rem flex-grow-1 max-w-18rem flex-shrink-1"
												/>
											)}
										/>
										<Controller
											name={`details[${index}].test_objects[${objIndex}].test_parameters[${paramIndex}].unit_dimension`}
											control={control}
											render={({ field }) => {
												const selectedParam = testParamQuery?.data?.find(
													(param) =>
														param.id ===
														selectedParameters[`${objIndex}-${paramIndex}`]
												);

												const unitOptions = selectedParam
													? selectedParam.units
													: [];
												return (
													<Dropdown
														{...field}
														options={unitOptions || []}
														placeholder="Select Unit"
														className="w-16rem flex-grow-1 max-w-18rem flex-shrink-1"
													/>
												);
											}}
										/>
										<Button
											icon="pi pi-times"
											onClick={() => removeTestParameter(objIndex, paramIndex)}
											rounded
											text
											severity="danger"
										/>
									</div>
								))
							) : (
								<span className="text-black-alpha-40">
									No Available Parameters for this test
								</span>
							)
						) : (
							<span className="text-black-alpha-40">Please select a test</span>
						)}
					</div>

					<CustomDivider />
				</div>
			))}
		</div>
	);
};

export default TestDetails;
