import React, { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { CascadeSelect } from "primereact/cascadeselect";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import {
	getTestConditionsByTestId,
	getTestObjects,
	getTestCategories,
	getUnitDimensions,
} from "../services/quotationService";

const TestDetails = ({ control, index, remove, setValue }) => {
	const [selectedTestId, setSelectedTestId] = useState(null);
	const [selectedCondition, setSelectedCondition] = useState(null);

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
	const { data: testConditions = [], isLoading: isConditionsLoading } =
		useQuery({
			queryKey: ["testConditions", selectedTestId],
			queryFn: () => getTestConditionsByTestId(selectedTestId),
			enabled: !!selectedTestId,
		});

	const { data: testObjects = [], isLoading: isTestObjectsLoading } = useQuery({
		queryKey: ["testObjects"],
		queryFn: getTestObjects,
		enabled: !!selectedTestId,
	});

	const { data: unitDimensions = [], isLoading: isUnitDimensionsLoading } =
		useQuery({
			queryKey: ["unitDimensions"],
			queryFn: getUnitDimensions,
			enabled: !!selectedCondition,
		});

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

	// const quotationUnitDimensionOptions = [
	// 	{ label: "width", value: 1 },
	// 	{ label: "height", value: 2 },
	// ];

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

	const handleTestChange = (e) => {
		setValue(`details[${index}].test`, e.value.value);
		setSelectedTestId(e.value.value);
	};

	const handleConditionChange = (e, idx) => {
		setValue(`details[${index}].test_objects[${idx}].test_condition`, e.value);
		setSelectedCondition(e.value);
		console.log(e);
	};

	return (
		<div>
			<div className="flex flex-column gap-2 mt-4">
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

			<div className="py-4">
				<hr />
			</div>

			{testObjectFields.map((testObject, objIndex) => (
				<div key={testObject.id}>
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

					<div className="flex flex-column gap-2 mt-2">
						<label className="font-semibold">Test Condition</label>
						<div className="flex">
							<Controller
								name={`details[${index}].test_objects[${objIndex}].test_condition`}
								control={control}
								render={({ field }) => (
									<Dropdown
										{...field}
										options={testConditions}
										loading={isConditionsLoading}
										onChange={(e) => handleConditionChange(e, objIndex)}
										placeholder="Select Condition"
										className="w-19rem"
									/>
								)}
							/>
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
										/>
									)}
								/>
							</div>
							<div className="flex flex-column gap-2 mt-2">
								<label className="font-semibold">
									Test Condition Dimension
								</label>
								<Controller
									name={`details[${index}].test_objects[${objIndex}].unit_dimension`}
									control={control}
									render={({ field }) => (
										<Dropdown
											{...field}
											options={unitDimensions}
											placeholder="Select Dimension"
											className="w-19rem"
										/>
									)}
								/>
							</div>
						</div>
					</div>

					<div className="flex flex-column gap-2 mt-2">
						<label className="font-semibold">Object Dimensions</label>
						{testObject.object_dimension.map((dimension, dimIndex) => (
							<div key={dimIndex}>
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
							</div>
						))}
					</div>

					<div className="flex flex-column gap-2 mt-2">
						<label className="font-semibold">Test Parameters</label>
						{testObject.test_parameters.map((parameter, paramIndex) => (
							<div key={paramIndex}>
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
							</div>
						))}
					</div>

					<Button
						onClick={() => removeTestObject(objIndex)}
						className="mt-4 w-19rem"
						label="Remove Test Object"
					/>
					<div className="py-4">
						<hr />
					</div>
				</div>
			))}

			<Button
				onClick={addTestObject}
				className="mt-4 w-full"
				label="Add Test Object"
			/>

			<Button onClick={remove} className="mt-4 w-full" label="Remove Test" />
			<div className="py-4">
				<hr />
			</div>
		</div>
	);
};

export default TestDetails;
