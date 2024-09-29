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
	getUnitDImensionsByConditionId,
} from "../services/quotationService"; // Adjust the import path as needed
import CustomDivider from "../components/CustomDivider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const TestDetails = ({
	control,
	index,
	remove,
	add,
	setValue,
	setSelectedTests,
	testQuery,
	testObjectsQuery,
	unitDimensionsQuery,
	updateTest,
}) => {
	const [selectedTestId, setSelectedTestId] = useState(null);
	const [selectedCondition, setSelectedCondition] = useState(null);
	const [selectedConditionId, setSelectedConditionId] = useState(null);

	const {
		fields: testObjectFields,
		append: appendTestObject,
		remove: removeTestObject,
	} = useFieldArray({
		control,
		name: `details[${index}].test_objects`,
	});

	// API CALLS
	const { data: tests = [], isLoading: isTestsLoading } = useQuery({
		queryKey: ["testCategories"],
		queryFn: getTestCategories,
	});

	const { data: testObjects = [], isLoading: isTestObjectsLoading } = useQuery({
		queryKey: ["testObjects"],
		queryFn: getTestObjects,
		enabled: !!selectedTestId,
	});

	const { data: unitDimensions = null, isLoading: isUnitDimensionsLoading } =
		useQuery({
			queryKey: ["unitDimensions", selectedConditionId],
			queryFn: () => getUnitDImensionsByConditionId(selectedConditionId),
			enabled: !!selectedConditionId,
		});

	// ... (keep other useQuery hooks as they are)

	const unitOptions = [
		{ label: "mm", value: 1 },
		{ label: "c", value: 2 },
	];

	const parameterOptions = [
		{ label: "Stress Ratio", value: 1 },
		{ label: "Max Stress", value: 2 },
	];

	const parameterUnitOptions = [
		{ label: "Fahrenheit", value: 1 },
		{ label: "Celsius", value: 2 },
	];

	const quotationDimensionOptions = [
		{ label: "c", value: 1 },
		{ label: "mm", value: 2 },
	];

	const addTestObject = () => {
		appendTestObject({
			test_object: "",
			test_object_quantity: "",
			test_condition: "",
			test_condition_value: "",
			unit_dimension: "",
			object_dimension: [{ dimension: "", value: "", unit: "" }],
			test_parameters: [
				{ test_parameter: "", test_parameter_value: "", unit_dimension: "" },
			],
		});
	};

	const addObjectDimension = (objIndex) => {
		setValue(`details[${index}].test_objects[${objIndex}].object_dimension`, [
			...(control._formValues.details[index].test_objects[objIndex]
				.object_dimension || []),
			{ unit: "", dimension: "", value: "" },
		]);
	};

	const removeObjectDimension = (objIndex, dimIndex) => {
		const currentDimensions =
			control._formValues.details[index].test_objects[objIndex]
				.object_dimension;
		setValue(
			`details[${index}].test_objects[${objIndex}].object_dimension`,
			currentDimensions.filter((_, i) => i !== dimIndex)
		);
	};

	const addTestParameter = (objIndex) => {
		setValue(`details[${index}].test_objects[${objIndex}].test_parameters`, [
			...(control._formValues.details[index].test_objects[objIndex]
				.test_parameters || []),
			{ test_parameter: "", test_parameter_value: "", unit_dimension: "" },
		]);
	};

	const removeTestParameter = (objIndex, paramIndex) => {
		const currentParams =
			control._formValues.details[index].test_objects[objIndex].test_parameters;
		setValue(
			`details[${index}].test_objects[${objIndex}].test_parameters`,
			currentParams.filter((_, i) => i !== paramIndex)
		);
	};

	// ... (keep other handler functions as they are)

	const handleTestChange = (e) => {
		setValue(`details[${index}].test`, e.value.value);
		setValue(`details[${index}].testLabel`, e.value.label);
		updateTest({ id: e.value.value, selectedConditionId: null });
		setSelectedTests((prevSelectedTests) => {
			if (prevSelectedTests.some((item) => item.index === index)) {
				return prevSelectedTests.map((item) => {
					if (item.index === index) {
						return { ...item, label: e.value.label };
					}
					return item;
				});
			}
			return [...prevSelectedTests, { index: index, label: e.value.label }];
		});
	};

	const handleConditionChange = (e, objIndex) => {
		setValue(
			`details[${index}].test_objects[${objIndex}].test_condition`,
			e.value
		);
		updateTest({ selectedConditionId: e.value });
	};

	// const handleConditionChange = (e, idx) => {
	// 	setValue(`details[${index}].test_objects[${idx}].test_condition`, e.value);
	// 	setSelectedConditionId(e.value);
	// 	setSelectedCondition(findItemByValue(testConditions, e.value));
	// };

	return (
		<div>
			<div className="flex  justify-content-between align-items-end my-4">
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
									className="w-full md:w-19rem"
									breakpoint="767px"
									placeholder="Select a Test"
									value={findItemByValue(tests, field.value)}
								/>
							);
						}}
					/>
				</div>
				<ButtonGroup>
					<Button
						icon="pi pi-plus"
						label={"Add"}
						onClick={add}
						rounded
						text
						className="text-center"
						aria-label="Add Test Object"
					/>
					<Button
						icon="pi pi-times"
						label={"Delete"}
						onClick={remove}
						rounded
						text
						severity="danger"
					/>
				</ButtonGroup>
			</div>

			{/* ... (keep the existing JSX for test selection) */}

			{testObjectFields.map((testObject, objIndex) => (
				<div key={testObject.id} className="flex flex-column gap-4">
					{/* TEST CONDITIONS */}
					<div className="flex flex-column gap-2 ">
						<div className="p-inputgroup">
							<div className="flex flex-column gap-2 mt-2">
								<label className="font-semibold">Test Condition</label>
								<Controller
									name={`details[${index}].test_objects[${objIndex}].test_condition`}
									control={control}
									render={({ field }) => (
										<Dropdown
											{...field}
											options={testQuery?.data || []}
											loading={testQuery?.isLoading}
											onChange={(e) => handleConditionChange(e, objIndex)}
											placeholder="Select Condition"
											className="w-19rem"
										/>
									)}
								/>
							</div>
							<div className="flex flex-column gap-2 mt-2">
								<label className="font-semibold">Test Condition Value</label>
								<Controller
									name={`details[${index}].test_objects[${objIndex}].test_condition_value`}
									control={control}
									render={({ field }) => (
										<InputText
											{...field}
											type="number"
											placeholder="Enter Value"
											className="w-19rem"
											// max={}
										/>
									)}
								/>
							</div>
							<div className="flex flex-column gap-2 mt-2">
								<label className="font-semibold">unit</label>
								<Controller
									name={`details[${index}].test_objects[${objIndex}].unit_dimension`}
									control={control}
									render={({ field }) => (
										<>
											<Dropdown
												{...field}
												options={unitDimensions}
												placeholder="Unit"
												className="w-auto"
												variant="filled"
												loading={isUnitDimensionsLoading}
											/>
											{/* <InputText
											{...field}
											value={unitDimensions?.label || ""}
											placeholder="Unit"
											className="w-auto"
											readOnly
											variant="filled"
											disabled
											loading={isUnitDimensionsLoading}
										/>
										<input
											type="hidden"
											{...field}
											value={unitDimensions?.id || ""}
										/> */}
										</>
									)}
								/>
							</div>
						</div>
					</div>

					{/*  TEST OBJECTS */}
					<div className="flex justify-content-between align-items-end mt-2">
						<div className="flex flex-column gap-2">
							<label className="font-semibold">Test Objects</label>
							<div className="flex align-items-center gap-3">
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
											className="w-19rem"
										/>
									)}
								/>
								<FontAwesomeIcon
									className="text-gray-700"
									icon={faCircleExclamation}
								/>
							</div>
						</div>

						<ButtonGroup>
							<Button
								icon="pi pi-plus"
								label={"Add"}
								onClick={() => addTestObject(objIndex)}
								rounded
								text
								className="text-center"
								aria-label="Add Test Object"
							/>
							<Button
								icon="pi pi-times"
								label={"Delete"}
								onClick={() => removeTestObject(objIndex)}
								rounded
								text
								severity="danger"
							/>
						</ButtonGroup>
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
								onClick={() => addObjectDimension(objIndex)}
							/>
						</div>
						{control._formValues.details[index].test_objects[
							objIndex
						].object_dimension.map((dimension, dimIndex) => (
							<div key={dimIndex} className="flex align-items-center gap-2">
								<Controller
									name={`details[${index}].test_objects[${objIndex}].object_dimension[${dimIndex}].dimension`}
									control={control}
									render={({ field }) => (
										<Dropdown
											{...field}
											options={quotationDimensionOptions}
											placeholder="Select Dimension"
											className="w-19rem"
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
											className="w-19rem"
										/>
									)}
								/>
								<Controller
									name={`details[${index}].test_objects[${objIndex}].object_dimension[${dimIndex}].unit`}
									control={control}
									render={({ field }) => (
										<Dropdown
											{...field}
											options={unitOptions}
											placeholder="Select Unit"
											className="w-19rem"
										/>
									)}
								/>
								<Button
									icon="pi pi-times"
									onClick={() => removeObjectDimension(objIndex, dimIndex)}
									rounded
									text
									severity="danger"
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
								onClick={() => addTestParameter(objIndex)}
								className="p-0"
								rounded
								label="Add"
								text
							/>
						</div>
						{control._formValues.details[index].test_objects[
							objIndex
						].test_parameters.map((parameter, paramIndex) => (
							<div key={paramIndex} className="flex align-items-center gap-2">
								<Controller
									name={`details[${index}].test_objects[${objIndex}].test_parameters[${paramIndex}].test_parameter`}
									control={control}
									render={({ field }) => (
										<Dropdown
											{...field}
											options={parameterOptions}
											placeholder="Select Parameter"
											className="w-19rem"
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
											className="w-19rem"
										/>
									)}
								/>
								<Controller
									name={`details[${index}].test_objects[${objIndex}].test_parameters[${paramIndex}].unit_dimension`}
									control={control}
									render={({ field }) => (
										<Dropdown
											{...field}
											options={parameterUnitOptions}
											placeholder="Select Unit"
											className="w-19rem"
										/>
									)}
								/>
								<Button
									icon="pi pi-times"
									onClick={() => removeTestParameter(objIndex, paramIndex)}
									rounded
									text
									severity="danger"
								/>
							</div>
						))}
					</div>
					<Button
						icon="pi pi-times"
						label="Remove Test Object"
						onClick={() => removeTestObject(objIndex)}
						className="w-19rem mt-2"
						severity="danger"
					/>

					<CustomDivider />
				</div>
			))}

			<Button
				icon="pi pi-plus"
				label="Add Test Object"
				onClick={addTestObject}
				className="w-full mt-4"
			/>

			<CustomDivider />
		</div>
	);
};

export default TestDetails;
