import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "primereact/button";
import Card from "../components/Card";
import TestDetails from "./TestDetails";
import CustomDivider from "../components/CustomDivider";
import { useQuery } from "@tanstack/react-query";
import {
	getBaseAlloys,
	getAlloysByBaseAlloyId,
} from "../services/quotationService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "primereact/dropdown";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import useMultipleTestDetails from "../hooks/useMultipleTestDetails";

const LOCAL_STORAGE_KEY = "formData";
const Form = () => {
	const [selectedTestIndex, setSelectedTestIndex] = useState(0);
	const [loadedFormData, setLoadedFormData] = useState(null);
	const [selectedBaseAlloy, setSelectedBaseAlloy] = useState(null);
	const [selectedTests, setSelectedTests] = useState([]);

	const { control, handleSubmit, setValue, watch, reset } = useForm();
	const {
		tests,
		addTest,
		updateTest,
		removeTest,
		testQueries,
		testObjectsQuery,
		unitDimensionsQueries,
	} = useMultipleTestDetails();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "details",
	});
	// Get saved form data from local storage
	useEffect(() => {
		const savedFormData = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (savedFormData) {
			setLoadedFormData(JSON.parse(savedFormData));
		} else {
			setLoadedFormData({
				requestor: 1,
				base_metal_alloy: "",
				alloy: "",
				details: [],
			});
		}
	}, []);

	useEffect(() => {
		if (loadedFormData) {
			reset(loadedFormData);
		}
	}, [loadedFormData, reset]);

	// Save form data to local storage
	const formData = watch();

	useEffect(() => {
		if (formData && Object.keys(formData).length > 0) {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
		}
	}, [formData]);

	useEffect(() => {
		console.log(selectedTests);
	}, [selectedTests]);

	// API CALLS
	const { data: baseAlloys = [], isLoading: isBaseAlloysLoading } = useQuery({
		queryKey: ["baseAlloys"],
		queryFn: getBaseAlloys,
	});

	const { data: alloys = [], isLoading: isAlloysLoading } = useQuery({
		queryKey: ["alloys", selectedBaseAlloy?.id],
		queryFn: () => getAlloysByBaseAlloyId(selectedBaseAlloy.id),
		enabled: !!selectedBaseAlloy,
	});

	// Handle form methods

	const handleBaseAlloyChange = (e, field) => {
		console.log(fields);
		field.onChange(e.value.name);
		setSelectedBaseAlloy(e.value);
	};

	const handleTestClick = (index) => {
		setSelectedTestIndex(index);
	};

	const addNewTest = (e) => {
		e.preventDefault();
		append({
			test: "",
			testLabel: "",
			test_objects: [
				{
					test_object: "",
					test_object_quantity: "",
					test_condition: "",
					test_condition_value: "",
					unit_dimension: "",
					object_dimension: [{ unit: "", dimension: "", value: "" }],
					test_parameters: [
						{
							test_parameter: "",
							test_parameter_value: "",
							unit_dimension: "",
						},
					],
				},
			],
		});
		addTest();
		handleTestClick(fields.length);
	};
	const onSubmit = async (data) => {
		const submitData = {
			...data,
			details: data.details.map(({ testLabel, ...rest }) => rest),
		};
		console.log(data);
		console.log(submitData);
	};

	return (
		<div className="flex justify-content-between w-11 mx-auto gap-5">
			<div className="flex flex-column w-12 mx-auto">
				<div className="pt-4 w-11 mx-auto">
					<h1 className="m-0 p-0">GET YOUR QUOTATION</h1>
				</div>
				<div
					className="overflow-y-scroll bg-norepeat p-3"
					style={{ scrollbarWidth: "none" }}
				>
					<div
						className="main shadow-5 p-3 border-round-3xl surface-0"
						style={{ contain: "content" }}
					>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="flex align-items-center justify-content-between mb-4">
								<label className="font-semibold">Select Your Base Alloy</label>
								<div className="flex gap-3 align-items-center">
									<Controller
										name="base_metal_alloy"
										control={control}
										render={({ field }) => (
											<Dropdown
												{...field}
												options={baseAlloys.map((alloy) => ({
													label: alloy.name,
													value: alloy,
												}))}
												loading={isBaseAlloysLoading}
												editable
												onChange={(e) => handleBaseAlloyChange(e, field)}
												placeholder="Select Base Alloy"
												className="w-full md:w-14rem"
											/>
										)}
									/>
									<FontAwesomeIcon
										className="text-gray-700"
										icon={faCircleExclamation}
									/>
								</div>
							</div>
							<div className="flex align-items-center justify-content-between mb-2">
								<label className="font-semibold">Select Your Alloy</label>
								<div className="flex gap-3 align-items-center">
									<Controller
										name="alloy"
										control={control}
										render={({ field }) => (
											<Dropdown
												{...field}
												loading={isAlloysLoading}
												disabled={alloys.length === 0 ? true : false}
												options={alloys.map((alloy) => ({
													label: alloy.name,
													value: alloy.name,
												}))}
												placeholder="Select Alloy"
												className="w-full md:w-14rem"
											/>
										)}
									/>
									<FontAwesomeIcon
										className="text-gray-700"
										icon={faCircleExclamation}
									/>
								</div>
							</div>
							<CustomDivider />
							{fields.map(
								(item, index) =>
									index === selectedTestIndex && (
										<TestDetails
											key={item.id}
											control={control}
											index={index}
											remove={() => {
												remove(index);
												removeTest(index);
											}}
											add={addNewTest}
											setValue={setValue}
											setSelectedTests={setSelectedTests}
											testQuery={testQueries[index]}
											testObjectsQuery={testObjectsQuery}
											unitDimensionsQuery={unitDimensionsQueries[index]}
											updateTest={(updates) => updateTest(index, updates)}
										/>
									)
							)}
							<div className="flex justify-content-center">
								<Button className="mt-4 w-3" type="submit" label="Submit" />
							</div>
						</form>
					</div>
				</div>
			</div>
			<div className="mt-8 hidden lg:block">
				<Card
					formData={watch()}
					onClick={addNewTest}
					onTestClick={handleTestClick}
					selectedTestIndex={selectedTestIndex}
					selectedTests={selectedTests}
				/>
			</div>
		</div>
	);
};

export default Form;
