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

const LOCAL_STORAGE_KEY = "formData";

const Form = () => {
	const [selectedTestIndex, setSelectedTestIndex] = useState(0);
	const [loadedFormData, setLoadedFormData] = useState(null);
	const [selectedBaseAlloy, setSelectedBaseAlloy] = useState(null);
	const [selectedTests, setSelectedTests] = useState([]);

	// FORM SETUP
	const { control, handleSubmit, setValue, watch, reset } = useForm();
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

	const addTest = (e) => {
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
											remove={() => remove(index)}
											add={addTest}
											setValue={setValue}
											setSelectedTests={setSelectedTests}
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
					formData={formData}
					onClick={addTest}
					onTestClick={handleTestClick}
					selectedTestIndex={selectedTestIndex}
					selectedTests={selectedTests}
				/>
			</div>
		</div>
	);
};

export default Form;

// const Form = () => {
// 	const [getDetail, setGetDetail] = useState([]);
// 	const [selectedBaseAlloy, setSelectedBaseAlloy] = useState(null);
// 	const [loadedFormData, setLoadedFormData] = useState(null);
// 	const isFirstRender = useRef(true);

// 	useEffect(() => {
// 		const savedFormData = localStorage.getItem(LOCAL_STORAGE_KEY);
// 		if (savedFormData) {
// 			setLoadedFormData(JSON.parse(savedFormData));
// 		} else {
// 			setLoadedFormData({
// 				requestor: 1,
// 				base_metal_alloy: "",
// 				alloy: "",
// 				details: [],
// 			});
// 		}
// 	}, []);

// 	const { control, handleSubmit, setValue, watch, reset } = useForm();

// 	const { fields, append, remove } = useFieldArray({
// 		control,
// 		name: "details",
// 	});

// 	useEffect(() => {
// 		if (loadedFormData) {
// 			reset(loadedFormData);
// 		}
// 	}, [loadedFormData, reset]);

// 	const formData = watch();

// 	useEffect(() => {
// 		if (isFirstRender.current) {
// 			isFirstRender.current = false;
// 			return;
// 		}
// 		if (formData && Object.keys(formData).length > 0) {
// 			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
// 		}
// 	}, [formData]);

// 	// API CALLS
// 	const { data: baseAlloys = [], isLoading: isBaseAlloysLoading } = useQuery({
// 		queryKey: ["baseAlloys"],
// 		queryFn: getBaseAlloys,
// 	});

// 	const { data: alloys = [], isLoading: isAlloysLoading } = useQuery({
// 		queryKey: ["alloys", selectedBaseAlloy?.id],
// 		queryFn: () => getAlloysByBaseAlloyId(selectedBaseAlloy.id),
// 		enabled: !!selectedBaseAlloy,
// 	});

// 	const onSubmit = async (data) => {
// 		console.log(data);
// 		// try {
// 		// 	const response = await axios.post(
// 		// 		"https://farheenkhan1995.pythonanywhere.com/r/quotation/",
// 		// 		data
// 		// 	);
// 		// 	const details = response.data.data || [response.data];
// 		// 	setGetDetail(details);
// 		// } catch (error) {
// 		// 	console.log("Error occurred", error.message);
// 		// }
// 	};

// 	const addTest = (e) => {
// 		e.preventDefault();
// 		append({
// 			test: "",
// 			test_objects: [
// 				{
// 					test_object: "",
// 					test_object_quantity: "",
// 					test_condition: "",
// 					test_condition_value: "",
// 					unit_dimension: "",
// 					object_dimension: [{ unit: "", dimension: "", value: "" }],
// 					test_parameters: [
// 						{
// 							test_parameter: "",
// 							test_parameter_value: "",
// 							unit_dimension: "",
// 						},
// 					],
// 				},
// 			],
// 		});
// 	};

// 	const handleBaseAlloyChange = (e, field) => {
// 		console.log(fields);
// 		field.onChange(e.value.name);
// 		setSelectedBaseAlloy(e.value);
// 	};

// 	if (!loadedFormData) {
// 		return (
// 			<div className="h-30rem w-full flex justify-content-center align-items-center">
// 				<ProgressSpinner />
// 			</div>
// 		);
// 	}

// 	return (
// 		<>
// 			<div className="flex justify-content-between w-11 mx-auto gap-5">
// 				<div className="flex flex-column w-12 mx-auto">
// 					<div className="pt-4 w-11 mx-auto">
// 						<h1 className="m-0 p-0">GET YOUR QUOTATION</h1>
// 					</div>
// 					<div
// 						className="overflow-y-scroll bg-norepeat p-3"
// 						style={{ scrollbarWidth: "none" }}
// 					>
// 						<div
// 							className="main shadow-5 p-3 border-round-3xl surface-0"
// 							style={{ contain: "content" }}
// 						>
// 							<form onSubmit={handleSubmit(onSubmit)}>
// 								<div className="flex align-items-center justify-content-between mb-4">
// 									<label className="font-semibold">
// 										Select Your Base Alloy
// 									</label>
// 									<div className="flex gap-3 align-items-center">
// 										<Controller
// 											name="base_metal_alloy"
// 											control={control}
// 											render={({ field }) => (
// 												<Dropdown
// 													{...field}
// 													options={baseAlloys.map((alloy) => ({
// 														label: alloy.name,
// 														value: alloy,
// 													}))}
// 													loading={isBaseAlloysLoading}
// 													editable
// 													onChange={(e) => handleBaseAlloyChange(e, field)}
// 													placeholder="Select Base Alloy"
// 													className="w-full md:w-14rem"
// 												/>
// 											)}
// 										/>
// 										<FontAwesomeIcon
// 											className="text-gray-700"
// 											icon={faCircleExclamation}
// 										/>
// 									</div>
// 								</div>
// 								<div className="flex align-items-center justify-content-between mb-2">
// 									<label className="font-semibold">Select Your Alloy</label>
// 									<div className="flex gap-3 align-items-center">
// 										<Controller
// 											name="alloy"
// 											control={control}
// 											render={({ field }) => (
// 												<Dropdown
// 													{...field}
// 													loading={isAlloysLoading}
// 													disabled={alloys.length === 0 ? true : false}
// 													options={alloys.map((alloy) => ({
// 														label: alloy.name,
// 														value: alloy.name,
// 													}))}
// 													placeholder="Select Alloy"
// 													className="w-full md:w-14rem"
// 												/>
// 											)}
// 										/>
// 										<FontAwesomeIcon
// 											className="text-gray-700"
// 											icon={faCircleExclamation}
// 										/>
// 									</div>
// 								</div>

// 								<CustomDivider />

// 								{fields.map((item, index) => (
// 									<TestDetails
// 										key={item.id}
// 										control={control}
// 										index={index}
// 										remove={() => remove(index)}
// 										add={addTest}
// 										setValue={setValue}
// 									/>
// 								))}
// 								<div className="flex justify-content-center">
// 									<Button className="mt-4 w-3" type="submit" label="Submit" />
// 								</div>
// 							</form>
// 						</div>
// 					</div>
// 				</div>
// 				<div className="mt-8 hidden lg:block">
// 					<Card getDetail={getDetail} onClick={addTest} formData={formData} />
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default Form;

// ^ NEW START BEFORE LOCALSTORAGE

// import React, { useState, useEffect, useRef } from "react";
// import { useForm, Controller, useFieldArray } from "react-hook-form";
// import { Dropdown } from "primereact/dropdown";
// import { Button } from "primereact/button";
// import { ProgressSpinner } from "primereact/progressspinner";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
// import Card from "../components/Cart";
// import {
// 	getBaseAlloys,
// 	getAlloysByBaseAlloyId,
// } from "../services/quotationService";
// import { useQuery } from "@tanstack/react-query";
// import TestDetails from "./TestDetails";

// const LOCAL_STORAGE_KEY = "formData";

// const Form = () => {
// 	const [getDetail, setGetDetail] = useState([]);
// 	const [selectedBaseAlloy, setSelectedBaseAlloy] = useState(null);
// 	const [loadedFormData, setLoadedFormData] = useState(null);
// 	const isFirstRender = useRef(true);

// 	useEffect(() => {
// 		const savedFormData = localStorage.getItem(LOCAL_STORAGE_KEY);
// 		if (savedFormData) {
// 			setLoadedFormData(JSON.parse(savedFormData));
// 		} else {
// 			setLoadedFormData({
// 				requestor: 1,
// 				base_metal_alloy: "",
// 				alloy: "",
// 				details: [],
// 			});
// 		}
// 	}, []);

// 	const { control, handleSubmit, setValue, getValues, watch, reset } =
// 		useForm();

// 	const { fields, append, remove } = useFieldArray({
// 		control,
// 		name: "details",
// 	});

// 	useEffect(() => {
// 		if (loadedFormData) {
// 			reset(loadedFormData);
// 		}
// 	}, [loadedFormData, reset]);

// 	const formData = watch();

// 	useEffect(() => {
// 		if (isFirstRender.current) {
// 			isFirstRender.current = false;
// 			return;
// 		}
// 		if (formData && Object.keys(formData).length > 0) {
// 			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
// 		}
// 	}, [formData]);

// 	// const { control, handleSubmit, setValue, getValues, watch } = useForm({
// 	// 	defaultValues: loadedFormData || {
// 	// 		requestor: 1,
// 	// 		base_metal_alloy: "",
// 	// 		alloy: "",
// 	// 		details: [],
// 	// 	},
// 	// });

// 	// const { control, handleSubmit, getValues, watch, setValue } = useForm({
// 	// 	defaultValues: {
// 	// 		requestor: 1,
// 	// 		base_metal_alloy: "",
// 	// 		alloy: "",
// 	// 		details: [],
// 	// 	},
// 	// });
// 	// const formData = watch();

// 	// useEffect(() => {
// 	// 	console.log(formData);
// 	// 	if (loadedFormData) {
// 	// 		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
// 	// 	}
// 	// }, [formData]);

// 	// API CALLS
// 	const { data: baseAlloys = [], isLoading: isBaseAlloysLoading } = useQuery({
// 		queryKey: ["baseAlloys"],
// 		queryFn: getBaseAlloys,
// 	});

// 	const { data: alloys = [], isLoading: isAlloysLoading } = useQuery({
// 		queryKey: ["alloys", selectedBaseAlloy?.id],
// 		queryFn: () => getAlloysByBaseAlloyId(selectedBaseAlloy.id),
// 		enabled: !!selectedBaseAlloy,
// 	});

// 	const onSubmit = async (data) => {
// 		console.log(data);
// 		try {
// 			const response = await axios.post(
// 				"https://farheenkhan1995.pythonanywhere.com/r/quotation/",
// 				data
// 			);
// 			const details = response.data.data || [response.data];
// 			setGetDetail(details);
// 		} catch (error) {
// 			console.log("Error occurred", error.message);
// 		}
// 	};

// 	const addTest = (e) => {
// 		e.preventDefault();
// 		append({
// 			test: "",
// 			test_objects: [
// 				{
// 					test_object: "",
// 					test_object_quantity: "",
// 					test_condition: "",
// 					test_condition_value: "",
// 					unit_dimension: "",
// 					object_dimension: [{ unit: "", dimension: "", value: "" }],
// 					test_parameters: [
// 						{
// 							test_parameter: "",
// 							test_parameter_value: "",
// 							unit_dimension: "",
// 						},
// 					],
// 				},
// 			],
// 		});
// 	};

// 	const handleBaseAlloyChange = (e, field) => {
// 		console.log(fields);
// 		field.onChange(e.value.name);
// 		setSelectedBaseAlloy(e.value);
// 	};

// 	if (!loadedFormData) {
// 		return (
// 			<div className="h-30rem w-full flex justify-content-center align-items-center">
// 				<ProgressSpinner />
// 			</div>
// 		);
// 	}

// 	return (
// 		<>
// 			<div className="flex justify-content-between w-11 mx-auto gap-5">
// 				<div className="flex flex-column w-12 mx-auto">
// 					<div className="pt-4 w-11 mx-auto">
// 						<h1 className="m-0 p-0">GET YOUR QUOTATION</h1>
// 					</div>
// 					<div
// 						className="overflow-y-scroll bg-norepeat p-3"
// 						style={{ scrollbarWidth: "none" }}
// 					>
// 						<div
// 							className="main shadow-5 p-3 border-round-3xl surface-0"
// 							style={{ contain: "content" }}
// 						>
// 							<form onSubmit={handleSubmit(onSubmit)}>
// 								<div className="flex align-items-center justify-content-between mb-4">
// 									<label className="font-semibold">
// 										Select Your Base Alloy
// 									</label>
// 									<div className="flex gap-3 align-items-center">
// 										<Controller
// 											name="base_metal_alloy"
// 											control={control}
// 											render={({ field }) => (
// 												<Dropdown
// 													{...field}
// 													options={baseAlloys.map((alloy) => ({
// 														label: alloy.name,
// 														value: alloy,
// 													}))}
// 													loading={isBaseAlloysLoading}
// 													editable
// 													onChange={(e) => handleBaseAlloyChange(e, field)}
// 													placeholder="Select Base Alloy"
// 													className="w-full md:w-14rem"
// 												/>
// 											)}
// 										/>
// 										<FontAwesomeIcon
// 											className="text-gray-700"
// 											icon={faCircleExclamation}
// 										/>
// 									</div>
// 								</div>

// 								<div className="flex align-items-center justify-content-between mb-2">
// 									<label className="font-semibold">Select Your Alloy</label>
// 									<div className="flex gap-3 align-items-center">
// 										<Controller
// 											name="alloy"
// 											control={control}
// 											render={({ field }) => (
// 												<Dropdown
// 													{...field}
// 													loading={isAlloysLoading}
// 													disabled={alloys.length === 0 ? true : false}
// 													options={alloys.map((alloy) => ({
// 														label: alloy.name,
// 														value: alloy.name,
// 													}))}
// 													placeholder="Select Alloy"
// 													className="w-full md:w-14rem"
// 												/>
// 											)}
// 										/>
// 										<FontAwesomeIcon
// 											className="text-gray-700"
// 											icon={faCircleExclamation}
// 										/>
// 									</div>
// 								</div>

// 								<div className="py-2">
// 									<hr />
// 								</div>

// 								{fields.map((item, index) => (
// 									<TestDetails
// 										key={item.id}
// 										control={control}
// 										index={index}
// 										remove={() => remove(index)}
// 										setValue={setValue}
// 									/>
// 								))}

// 								<div className="flex justify-content-center">
// 									<Button className="mt-4 w-3" type="submit" label="Submit" />
// 								</div>
// 							</form>
// 						</div>
// 					</div>
// 				</div>
// 				<div className="mt-8 hidden lg:block">
// 					<Card getDetail={getDetail} onClick={addTest} />
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default Form;

// ^ NEW END BEFORE LOCALSTORAGE

// import React, { useEffect, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { Dropdown } from "primereact/dropdown";
// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
// import { MultiSelect } from "primereact/multiselect";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
// import { CascadeSelect } from "primereact/cascadeselect";
// import axios from "axios";
// import Card from "../components/Cart";
// import {
// 	getBaseAlloys,
// 	getAlloysByBaseAlloyId,
// 	getTestCategories,
// 	getTestObjects,
// } from "../services/quotationService";
// import { useQuery } from "@tanstack/react-query";

// const Form = () => {
// 	const [update, setUpdate] = useState(false);
// 	const [getDetail, setGetDetail] = useState([]);
// 	const [selectedBaseAlloyId, setSelectedBaseAlloyId] = useState(null);
// 	// const [baseAlloys, setBaseAlloys] = useState([]);
// 	// const [alloys, setAlloys] = useState([]);
// 	// const [tests, setTests] = useState([]);
// 	const { control, handleSubmit, getValues, setValue, watch } = useForm({
// 		defaultValues: {
// 			requestor: 1,
// 			base_metal_alloy: "",
// 			alloy: "",
// 			details: [
// 				{
// 					test: "",
// 					test_objects: [
// 						{
// 							test_object: "",
// 							test_object_quantity: "",
// 							test_condition: "",
// 							test_condition_value: "",
// 							unit_dimension: "",
// 							object_dimension: [
// 								{
// 									unit: "",
// 									dimension: "",
// 									value: "",
// 								},
// 							],
// 							test_parameters: [],
// 						},
// 					],
// 				},
// 			],
// 		},
// 	});

// 	const {
// 		data: baseAlloys = [],
// 		isLoading: isBaseAlloysLoading,
// 		isError: isBaseAlloysError,
// 		error: baseAlloysError,
// 	} = useQuery({ queryKey: ["baseAlloys"], queryFn: getBaseAlloys });

// 	const {
// 		data: tests = [],
// 		isLoading: isTestsLoading,
// 		isError: isTestsError,
// 		error: testsError,
// 	} = useQuery({ queryKey: ["testCategories"], queryFn: getTestCategories });

// 	const {
// 		data: alloys = [],
// 		isLoading: isAlloysLoading,
// 		isError: isAlloysError,
// 		error: alloysError,
// 	} = useQuery({
// 		queryKey: ["alloys", selectedBaseAlloyId],
// 		queryFn: () => getAlloysByBaseAlloyId(selectedBaseAlloyId),
// 		enabled: !!selectedBaseAlloyId,
// 	});

// 	const {
// 		data: testObjects = [],
// 		isLoading: isTestObjectsLoading,
// 		isError: isTestObjectsError,
// 		error: testObjectsError,
// 	} = useQuery({
// 		queryKey: ["testObjects"],
// 		queryFn: getTestObjects,
// 	});

// 	const conditionOptions = [
// 		{ label: "LCF", value: 1 },
// 		{ label: "HCF", value: 2 },
// 	];
// 	const unitOptions = [
// 		{ label: "mm", value: 1 },
// 		{ label: "c", value: 2 },
// 	];
// 	const parameterOptions = [
// 		{ label: "Stress Ratio", value: 1 },
// 		{ label: "Max Stress", value: 2 },
// 	];
// 	const parameterUnitOptions = [
// 		{ label: "Farhenite", value: 1 },
// 		{ label: "Celsius", value: 2 },
// 	];
// 	const quotationDimensionOptions = [
// 		{ label: "c", value: 1 },
// 		{ label: "mm", value: 2 },
// 	];
// 	const quotationUnitDimensionOptions = [
// 		{ label: "width", value: 1 },
// 		{ label: "height", value: 2 },
// 	];

// 	const onSubmit = async (data) => {
// 		try {
// 			const response = await axios.post(
// 				"https://farheenkhan1995.pythonanywhere.com/r/quotation/",
// 				data
// 			);
// 			const details = response.data.data || [response.data];
// 			setGetDetail(details);
// 		} catch (error) {
// 			console.log("error occur", error.message);
// 		}
// 	};
// 	const addTest = (event) => {
// 		event.preventDefault();
// 		const newTest = {
// 			test: "",
// 			test_objects: [
// 				{
// 					test_object: "",
// 					test_object_quantity: "",
// 					test_condition: "",
// 					test_condition_value: "",
// 					unit_dimension: "",
// 					object_dimension: [{ dimension: "", value: "", unit: "" }],
// 					test_parameters: [],
// 				},
// 			],
// 		};

// 		const values = getValues();
// 		const newTests = [...values.details, newTest];
// 		setValue("details", newTests);
// 		setUpdate((prev) => !prev);
// 	};
// 	const addTestObject = (e, testIndex) => {
// 		e.preventDefault();
// 		const newTestObject = {
// 			test_object: "",
// 			test_object_quantity: "",
// 			test_condition: "",
// 			test_condition_value: "",
// 			unit_dimension: "",
// 			object_dimension: [{ dimension: "", value: "", unit: "" }],
// 			test_parameters: [],
// 		};
// 		const values = getValues();
// 		const newDetails = [...values.details];
// 		newDetails[testIndex].test_objects.push(newTestObject);
// 		setValue("details", newDetails);
// 		setUpdate((prev) => !prev);
// 	};
// 	const addObjectDimension = (e, testIndex, objIndex) => {
// 		e.preventDefault();
// 		const newDimension = { unit: "", dimension: "", value: "" };
// 		const values = getValues();
// 		const newDetails = [...values.details];
// 		newDetails[testIndex].test_objects[objIndex].object_dimension.push(
// 			newDimension
// 		);
// 		setValue("details", newDetails);
// 		setUpdate((prev) => !prev);
// 	};
// 	const handleParameterChange = (e, testIndex, objIndex) => {
// 		const selectedParameters = e.value;
// 		const values = getValues();
// 		const newDetails = [...values.details];
// 		const result = newDetails[testIndex].test_objects[objIndex];
// 		result.test_parameters = selectedParameters.map(
// 			(parameter, paramIndex) => ({
// 				test_parameter: parameter,
// 				test_parameter_value:
// 					result.test_parameters[paramIndex]?.test_parameter_value || "",
// 				unit_dimension:
// 					result.test_parameters[paramIndex]?.unit_dimension || "",
// 			})
// 		);
// 		setUpdate((prev) => !prev);
// 		setValue("details", newDetails);
// 	};
// 	const getSelectedParameters = (testIndex, objIndex) => {
// 		const values = getValues();
// 		const newValues = [...values.details];
// 		if (newValues) {
// 			const returnValue =
// 				values.details[testIndex].test_objects[objIndex].test_parameters;
// 			return returnValue.map((param) => param.test_parameter);
// 		}
// 	};

// 	const handleBaseAlloyChange = (e) => {
// 		setValue("base_metal_alloy", e.value.name);
// 		setSelectedBaseAlloyId(e.value.id);
// 	};

// 	return (
// 		<>
// 			<div className="flex justify-content-between w-11 mx-auto gap-5">
// 				<div className="flex flex-column w-12 mx-auto">
// 					<div className="pt-4 w-11 mx-auto">
// 						<h1 className="m-0 p-0">GET YOUR QUOTATION</h1>
// 					</div>
// 					<div
// 						className="overflow-y-scroll bg-norepeat p-3 "
// 						style={{ scrollbarWidth: "none" }}
// 					>
// 						<div
// 							className="main shadow-5 p-3 border-round-3xl surface-0"
// 							style={{ contain: "content" }}
// 						>
// 							<form onSubmit={handleSubmit(onSubmit)}>
// 								<>
// 									<div className="flex align-items-center justify-content-between mb-4 ">
// 										<label className="font-semibold">
// 											Select Your Base Alloy
// 										</label>
// 										<div className="flex gap-3 align-items-center">
// 											<Controller
// 												name="base_metal_alloy"
// 												control={control}
// 												render={({ field }) => (
// 													<Dropdown
// 														{...field}
// 														options={baseAlloys.map((alloy) => ({
// 															label: alloy.name,
// 															value: alloy,
// 														}))}
// 														loading={isBaseAlloysLoading}
// 														editable
// 														onChange={(e) => handleBaseAlloyChange(e)}
// 														placeholder="Select Base Alloy"
// 														className="w-full md:w-14rem"
// 													/>
// 												)}
// 											/>
// 											<FontAwesomeIcon
// 												className="text-gray-700"
// 												icon={faCircleExclamation}
// 											/>
// 										</div>
// 									</div>

// 									<div className="flex align-items-center justify-content-between mb-2">
// 										<label className="font-semibold">Select Your Alloy</label>
// 										<div className="flex gap-3 align-items-center">
// 											<Controller
// 												name="alloy"
// 												control={control}
// 												disabled={alloys.length === 0 ? true : false}
// 												render={({ field }) => (
// 													<Dropdown
// 														{...field}
// 														loading={isAlloysLoading}
// 														options={alloys.map((alloy) => ({
// 															label: alloy.name,
// 															value: alloy.name,
// 														}))}
// 														placeholder="Select Alloy"
// 														className="w-full md:w-14rem"
// 													/>
// 												)}
// 											/>
// 											<FontAwesomeIcon
// 												className="text-gray-700"
// 												icon={faCircleExclamation}
// 											/>
// 										</div>
// 									</div>

// 									<div className="py-2">
// 										<hr />
// 									</div>
// 								</>
// 								{getValues().details.map((test, testIndex) => (
// 									<div key={testIndex}>
// 										<div className="flex flex-column gap-2 mt-4 ">
// 											<label className="font-semibold">Select Your Test</label>
// 											<Controller
// 												name={`details[${testIndex}].test`}
// 												control={control}
// 												render={({ field }) => {
// 													const findItemByValue = (options, value) => {
// 														for (const option of options) {
// 															if (option.value === value) {
// 																return option;
// 															} else if (option.children) {
// 																const found = findItemByValue(
// 																	option.children,
// 																	value
// 																);
// 																if (found) {
// 																	return found;
// 																}
// 															}
// 														}
// 														return null;
// 													};

// 													return (
// 														<CascadeSelect
// 															options={tests}
// 															{...field}
// 															onChange={(e) => field.onChange(e.value.value)}
// 															optionLabel="label"
// 															loading={isTestsLoading}
// 															optionGroupLabel="label"
// 															optionGroupChildren={[
// 																"children",
// 																"children",
// 																"children",
// 															]}
// 															className="w-full md:w-19rem"
// 															breakpoint="767px"
// 															placeholder="Select a Test"
// 															value={findItemByValue(tests, field.value)}
// 														/>
// 													);
// 												}}
// 											/>
// 										</div>
// 										<div className="py-4">
// 											<hr />{" "}
// 										</div>
// 										{test.test_objects.map((testObject, objIndex) => (
// 											<React.Fragment key={objIndex}>
// 												<div className="flex flex-column gap-2">
// 													<label className="font-semibold">Test Objects</label>
// 													<div className="flex align-items-center gap-3">
// 														<Controller
// 															name={`details[${testIndex}].test_objects[${objIndex}].test_object`}
// 															control={control}
// 															render={({ field }) => (
// 																<Dropdown
// 																	{...field}
// 																	onChange={(e) => field.onChange(e.value)}
// 																	options={testObjects}
// 																	placeholder="Select Test Object"
// 																	className="w-19rem"
// 																/>
// 															)}
// 														/>
// 														<FontAwesomeIcon
// 															className="text-gray-700"
// 															icon={faCircleExclamation}
// 														/>
// 													</div>
// 												</div>
// 												<div className="py-4">
// 													<hr />
// 												</div>
// 												<div className="mb-4">
// 													<div className="flex flex-column gap-2">
// 														<label className="font-semibold">
// 															Test Conditions
// 														</label>
// 														<Controller
// 															name={`details[${testIndex}].test_objects[${objIndex}].test_condition`}
// 															control={control}
// 															render={({ field }) => (
// 																<Dropdown
// 																	{...field}
// 																	onChange={(e) => field.onChange(e.value)}
// 																	options={conditionOptions}
// 																	placeholder="Select Test Condition"
// 																	className="w-19rem"
// 																/>
// 															)}
// 														/>
// 													</div>
// 												</div>
// 												<div className="flex justify-content-between mb-4 align-items-center">
// 													<div className="flex gap-2 align-items-center">
// 														<label className="font-semibold">
// 															Test Condition Value
// 														</label>
// 														<FontAwesomeIcon
// 															className="text-gray-700"
// 															icon={faCircleExclamation}
// 														/>
// 													</div>
// 													<Controller
// 														name={`details[${testIndex}].test_objects[${objIndex}].test_condition_value`}
// 														control={control}
// 														render={({ field }) => (
// 															<InputText
// 																{...field}
// 																type="number"
// 																onChange={(e) =>
// 																	field.onChange(parseInt(e.target.value))
// 																}
// 																placeholder="Enter Value"
// 																className="w-19rem"
// 															/>
// 														)}
// 													/>
// 												</div>
// 												<div className="flex justify-content-between align-items-center">
// 													<div className="flex gap-2">
// 														<label className="font-semibold">
// 															Unit Dimension
// 														</label>
// 														<FontAwesomeIcon
// 															className="text-gray-700"
// 															icon={faCircleExclamation}
// 														/>
// 													</div>
// 													<Controller
// 														name={`details[${testIndex}].test_objects[${objIndex}].unit_dimension`}
// 														control={control}
// 														render={({ field }) => (
// 															<Dropdown
// 																{...field}
// 																onChange={(e) => field.onChange(e.value)}
// 																options={unitOptions}
// 																placeholder="Select Unit Dimension"
// 																className="w-19rem"
// 															/>
// 														)}
// 													/>
// 												</div>

// 												<div className="py-4">
// 													<hr />
// 												</div>
// 												<div>
// 													<div className="flex flex-column gap-2">
// 														<label className="font-semibold">
// 															Test Object Quantity
// 														</label>
// 														<div className="flex gap-3 align-items-center">
// 															<Controller
// 																name={`details[${testIndex}].test_objects[${objIndex}].test_object_quantity`}
// 																control={control}
// 																render={({ field }) => (
// 																	<InputText
// 																		{...field}
// 																		className="w-19rem"
// 																		type="number"
// 																		onChange={(e) =>
// 																			field.onChange(parseInt(e.target.value))
// 																		}
// 																		placeholder="Enter object quantity"
// 																	/>
// 																)}
// 															/>
// 															<FontAwesomeIcon
// 																className="text-gray-700"
// 																icon={faCircleExclamation}
// 															/>
// 														</div>
// 													</div>
// 												</div>
// 												<div className="py-4">
// 													<hr />
// 												</div>
// 												{testObject.object_dimension.map((dim, dimIndex) => (
// 													<div key={dimIndex}>
// 														<div className="flex flex-column gap-2 mb-4">
// 															<label className="font-semibold">
// 																Object Dimension
// 															</label>
// 															<Controller
// 																name={`details[${testIndex}].test_objects[${objIndex}].object_dimension[${dimIndex}].dimension`}
// 																control={control}
// 																render={({ field }) => (
// 																	<Dropdown
// 																		{...field}
// 																		onChange={(e) => field.onChange(e.value)}
// 																		options={quotationUnitDimensionOptions}
// 																		placeholder="Select Dimension"
// 																		className="w-19rem"
// 																	/>
// 																)}
// 															/>
// 														</div>
// 														<div className="flex justify-content-between mb-4">
// 															<div className="flex gap-2 align-items-center">
// 																<label className="font-semibold">
// 																	Object dimension Unit
// 																</label>
// 																<FontAwesomeIcon
// 																	className="text-gray-700"
// 																	icon={faCircleExclamation}
// 																/>
// 															</div>
// 															<Controller
// 																name={`details[${testIndex}].test_objects[${objIndex}].object_dimension[${dimIndex}].unit`}
// 																control={control}
// 																render={({ field }) => (
// 																	<Dropdown
// 																		{...field}
// 																		onChange={(e) => field.onChange(e.value)}
// 																		options={quotationDimensionOptions}
// 																		placeholder="Select Unit"
// 																		className="w-19rem"
// 																	/>
// 																)}
// 															/>
// 														</div>
// 														<div className="flex justify-content-between align-items-center gap-2 mb-4">
// 															<div className="flex gap-2 align-items-center">
// 																<label className="font-semibold">
// 																	object dimnesion Value
// 																</label>
// 																<FontAwesomeIcon
// 																	className="text-gray-700"
// 																	icon={faCircleExclamation}
// 																/>
// 															</div>
// 															<Controller
// 																name={`details[${testIndex}].test_objects[${objIndex}].object_dimension[${dimIndex}].value`}
// 																control={control}
// 																render={({ field }) => (
// 																	<InputText
// 																		{...field}
// 																		type="number"
// 																		onChange={(e) =>
// 																			field.onChange(parseInt(e.target.value))
// 																		}
// 																		className="w-19rem"
// 																		placeholder="Enter value"
// 																	/>
// 																)}
// 															/>
// 														</div>
// 													</div>
// 												))}
// 												<Button
// 													onClick={(e) =>
// 														addObjectDimension(e, testIndex, objIndex)
// 													}
// 													className="mt-4 w-19rem"
// 													label="Add Dimension"
// 												/>
// 												<div className="py-4">
// 													<hr />
// 												</div>
// 												<div className="flex flex-column gap-2 mb-4">
// 													<label className="font-semibold">
// 														Test Parameter
// 													</label>
// 													<Controller
// 														name={`details[${testIndex}].test_objects[${objIndex}].test_parameters`}
// 														control={control}
// 														render={({ field }) => (
// 															<MultiSelect
// 																{...field}
// 																options={parameterOptions}
// 																value={getSelectedParameters(
// 																	testIndex,
// 																	objIndex
// 																)}
// 																onChange={(e) =>
// 																	handleParameterChange(e, testIndex, objIndex)
// 																}
// 																placeholder="Select your test parameter"
// 																className="w-19rem"
// 															/>
// 														)}
// 													/>
// 												</div>
// 												{getValues().details[testIndex].test_objects[
// 													objIndex
// 												].test_parameters.map((parameter, parameterIndex) => (
// 													<div key={parameterIndex}>
// 														<div className="flex justify-content-between align-items-center mb-4">
// 															<div className="flex gap-3 align-items-center">
// 																<label className="font-semibold">
// 																	Test Parameter Value
// 																</label>
// 																<FontAwesomeIcon
// 																	className="text-gray-700"
// 																	icon={faCircleExclamation}
// 																/>
// 															</div>
// 															<Controller
// 																name={`details[${testIndex}].test_objects[${objIndex}].test_parameters[${parameterIndex}].test_parameter_value`}
// 																control={control}
// 																render={({ field }) => (
// 																	<InputText
// 																		{...field}
// 																		type="number"
// 																		onChange={(e) =>
// 																			field.onChange(parseInt(e.target.value))
// 																		}
// 																		className="w-19rem"
// 																		placeholder="Enter Value"
// 																	/>
// 																)}
// 															/>
// 														</div>
// 														<div className="flex justify-content-between align-items-center gap-2 mb-3">
// 															<div className="flex gap-3 align-items-center">
// 																<label className="font-semibold">
// 																	Test Parameter Unit
// 																</label>
// 																<FontAwesomeIcon
// 																	className="text-gray-700"
// 																	icon={faCircleExclamation}
// 																/>
// 															</div>
// 															<Controller
// 																name={`details[${testIndex}].test_objects[${objIndex}].test_parameters[${parameterIndex}].unit_dimension`}
// 																control={control}
// 																render={({ field }) => (
// 																	<Dropdown
// 																		{...field}
// 																		onChange={(e) => field.onChange(e.value)}
// 																		options={parameterUnitOptions}
// 																		placeholder="Select Unit"
// 																		className="w-19rem"
// 																	/>
// 																)}
// 															/>
// 														</div>
// 													</div>
// 												))}

// 												<div className="py-4">
// 													<hr />
// 												</div>
// 											</React.Fragment>
// 										))}
// 										<Button
// 											onClick={(e) => addTestObject(e, testIndex)}
// 											className="mt-4 w-full"
// 											label="Add Test Object"
// 										/>
// 										<div className="py-4">
// 											<hr />
// 										</div>
// 									</div>
// 								))}
// 								<div className="flex justify-content-center">
// 									<Button className="mt-4 w-3" type="submit" label="Submit" />
// 								</div>
// 							</form>
// 						</div>
// 					</div>
// 				</div>
// 				<div className="mt-8 hidden lg:block">
// 					<Card getDetail={getDetail} onClick={addTest} />
// 				</div>
// 			</div>
// 		</>
// 	);
// };
// export default Form;

// // useEffect(() => {
// // 	const fetchBaseAlloys = async () => {
// // 		const baseAlloyOptions = await getBaseAlloys();

// // 		setBaseAlloys(baseAlloyOptions);
// // 	};

// // 	const fetchTestCategories = async () => {
// // 		const testCategories = await getTestCategories();
// // 		setTests(testCategories);
// // 	};

// // 	fetchBaseAlloys();
// // 	fetchTestCategories();
// // }, []);

// // const baseAlloyOptions = ["Iron", "Zinc", "Palladium"];
// // const alloyOptions = ["Aluminium", "Copper", "Palladium", "Lead", "Nickel"];

// // const testOptions = [
// // 	{
// // 		label: "Static Tests",
// // 		children: [
// // 			{ label: "Tensile", value: 1 },
// // 			{ label: "High Cycle Fatigue", value: 2 },
// // 			{ label: "Low Cycle Fatigue", value: 3 },
// // 		],
// // 	},
// // 	{
// // 		label: "Cyclic Test",
// // 		children: [
// // 			{ label: "Cyclic1", value: 4 },
// // 			{ label: "Cyclic2", value: 5 },
// // 			{ label: "Cyclic3", value: 6 },
// // 		],
// // 	},
// // 	{
// // 		label: "Metallurgic Test",
// // 		children: [
// // 			{
// // 				label: "Metalurgic1",
// // 				children: [
// // 					{ label: "Metalurgic11", value: 7 },
// // 					{ label: "Metalurgic12", value: 8 },
// // 					{ label: "Metalurgic13", value: 9 },
// // 				],
// // 			},
// // 			{ label: "Metalurgic2", value: 8 },
// // 			{ label: "Metalurgic3", value: 9 },
// // 		],
// // 	},
// // ];

// // const objectOptions = [
// // 	{ label: "Flat Bar", value: 1 },
// // 	{ label: "Round Bar", value: 2 },
// // ];