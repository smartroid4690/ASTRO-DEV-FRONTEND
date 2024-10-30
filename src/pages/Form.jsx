import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "primereact/button";
import QuotationOverview from "../components/QuotationOverview";
import TestDetails from "./TestDetails";
import CustomDivider from "../components/CustomDivider";
import { useQuery } from "@tanstack/react-query";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "primereact/dropdown";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import useMultipleTestDetails from "../hooks/useMultipleTestDetails";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import {
	getBaseAlloys,
	getAlloysByBaseAlloyId,
	formSubmit,
} from "../services/quotationService";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "../utils/QuotationFormValidation";
import { classNames } from "primereact/utils";
import { toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import { useNavigate } from 'react-router-dom';
  


const LOCAL_STORAGE_KEY = "formData";
const Form = () => {
	const [selectedTestIndex, setSelectedTestIndex] = useState(0);
	const [selectedBaseAlloy, setSelectedBaseAlloy] = useState(null);
	const [useCustomAlloy, setUseCustomAlloy] = useState(false);
	const navigate = useNavigate();

	const {
		control,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors },
	} = useForm({
		defaultValues: {
			requestor: 1,
		},
	});
	const {
		selectedTests,
		addTest,
		updateTest,
		removeTest,
		testQueries,
		testObjectsQuery,
	} = useMultipleTestDetails();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "details",
	});

	// API CALLS
	const { data: baseAlloys = [], isLoading: isBaseAlloysLoading } = useQuery({
		queryKey: ["baseAlloys"],
		queryFn: getBaseAlloys,
		enabled: !useCustomAlloy,
	});

	const { data: alloys = [], isLoading: isAlloysLoading } = useQuery({
		queryKey: ["alloys", selectedBaseAlloy?.id],
		queryFn: () => getAlloysByBaseAlloyId(selectedBaseAlloy.id),
		enabled: !!selectedBaseAlloy && !useCustomAlloy,
	});

	// Handle form methods

	const handleBaseAlloyChange = (e, field) => {
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
					test_parameters: [],
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

		try {
			const token = localStorage.getItem('access_token');
			if(token){
				let response = await formSubmit(submitData);
				navigate("/default/quotetable");
				toast.success("Form submitted successfully!");
			} else{
				navigate("/login");
				toast.error("Please logged in for quotation form submission")
			}
		  } catch (error) {
			console.log(error);
			toast.error("Form submission failed!...");
		  }
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
							<div className="flex align-items-center justify-content-between align-items-center mb-2">
								<label
									className={`font-semibold ${
										useCustomAlloy && "text-black-alpha-40"
									}`}
								>
									Select Your Base Alloy
								</label>
								<div className="flex gap-3 align-items-center">
									<Controller
										name="base_metal_alloy"
										control={control}
										render={({ field, fieldState: { invalid } }) => (
											<>
												<Dropdown
													{...field}
													options={baseAlloys.map((alloy) => ({
														label: alloy.name,
														value: alloy,
													}))}
													disabled={useCustomAlloy}
													loading={isBaseAlloysLoading}
													editable
													onChange={(e) => handleBaseAlloyChange(e, field)}
													placeholder="Select Base Alloy"
													className={classNames("w-full md:w-14rem", {
														"p-invalid": invalid,
													})}
												/>
											</>
										)}
									/>
									<FontAwesomeIcon
										className="text-gray-700"
										icon={faCircleExclamation}
									/>
								</div>
							</div>

							<div className="flex align-items-center justify-content-between align-items-center mb-2">
								<label
									className={`font-semibold ${
										useCustomAlloy && "text-black-alpha-40"
									}`}
								>
									Select Your Alloy
								</label>
								<div className="flex gap-3 align-items-center">
									<Controller
										name="alloy"
										control={control}
										render={({ field }) => (
											<Dropdown
												{...field}
												loading={isAlloysLoading}
												disabled={alloys.length === 0 || useCustomAlloy}
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

							<div className="flex align-items-center gap-2 align-items-center my-3">
								<label className="">Use Custom Alloy</label>
								<Checkbox
									checked={useCustomAlloy}
									onChange={(e) => setUseCustomAlloy(e.checked)}
								/>
							</div>
							{useCustomAlloy && (
								<>
									<div className="flex align-items-center justify-content-between align-items-center mb-2">
										<label className="font-semibold">Enter Base Alloy</label>
										<div className="flex gap-3 align-items-center">
											<Controller
												name="base_metal_alloy"
												control={control}
												render={({ field }) => (
													<InputText
														{...field}
														required
														value={field.value || ""}
														placeholder="Enter Base Alloy"
														className="w-full md:w-14rem"
													/>
												)}
											/>
										</div>
									</div>

									<div className="flex align-items-center justify-content-between align-items-center mb-4">
										<label className="font-semibold">Enter Alloy</label>
										<div className="flex gap-3 align-items-center">
											<Controller
												name="alloy"
												control={control}
												render={({ field }) => (
													<InputText
														{...field}
														required
														value={field.value || ""}
														placeholder="Enter Alloy"
														className="w-full md:w-14rem"
													/>
												)}
											/>
										</div>
									</div>
								</>
							)}

							<div className="py-4">
								<CustomDivider />
							</div>

							{fields.map((item, index) => {
								return (
									index === selectedTestIndex && (
										<TestDetails
											key={item.id}
											control={control}
											index={index}
											setValue={setValue}
											getValues={getValues}
											testConditionQuery={testQueries[index * 3]}
											testParamQuery={testQueries[index * 3 + 1]}
											unitDimensionsQuery={testQueries[index * 3 + 2]}
											testObjectsQuery={testObjectsQuery}
											updateTest={(updates) => updateTest(index, updates)}
										/>
									)
								);
							})}

							<div className="flex justify-content-center">
								<Button className="mt-4 w-3" type="submit" label="Submit" />
							</div>
						</form>
					</div>
				</div>
			</div>
			<div className="mt-8 hidden lg:block">
				<QuotationOverview
					onAddTestClick={addNewTest}
					onTestClick={handleTestClick}
					onTestRemove={(index) => {
						remove(index);
						removeTest(index);
					}}
					selectedTestIndex={selectedTestIndex}
					selectedTests={selectedTests}
				/>
			</div>
		</div>
	);
};

export default Form;
