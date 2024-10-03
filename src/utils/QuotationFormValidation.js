import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Validation schema
const validationSchema = Yup.object().shape({
	base_metal_alloy: Yup.string().required("Base metal alloy is required"),
	alloy: Yup.string().required("Alloy is required"),
	details: Yup.array()
		.of(
			Yup.object().shape({
				test: Yup.string().required("Test is required"),
				testLabel: Yup.string().required("Test label is required"),
				test_objects: Yup.array()
					.of(
						Yup.object().shape({
							test_object: Yup.string().required("Test object is required"),
							test_object_quantity: Yup.number()
								.typeError("Quantity must be a number")
								.positive("Quantity must be positive")
								.required("Test object quantity is required"),
							test_condition: Yup.string(),
							test_condition_value: Yup.number().when("test_condition", {
								is: (value) => value && value.length > 0,
								then: Yup.number().required(
									"Condition value is required when condition is selected"
								),
							}),
							unit_dimension: Yup.string().when("test_condition", {
								is: (value) => value && value.length > 0,
								then: Yup.string().required(
									"Unit dimension is required when condition is selected"
								),
							}),
							object_dimension: Yup.array()
								.of(
									Yup.object().shape({
										dimension: Yup.string().required("Dimension is required"),
										value: Yup.number()
											.typeError("Value must be a number")
											.required("Dimension value is required"),
										unit: Yup.string().required("Dimension unit is required"),
									})
								)
								.min(1, "At least one object dimension is required"),
							test_parameters: Yup.array().of(
								Yup.object().shape({
									test_parameter: Yup.string(),
									test_parameter_value: Yup.number().when("test_parameter", {
										is: (value) => value && value.length > 0,
										then: Yup.number().required(
											"Parameter value is required when parameter is selected"
										),
									}),
									unit_dimension: Yup.string().when("test_parameter", {
										is: (value) => value && value.length > 0,
										then: Yup.string().required(
											"Unit dimension is required when parameter is selected"
										),
									}),
								})
							),
						})
					)
					.min(1, "At least one test object is required"),
			})
		)
		.min(1, "At least one test is required"),
});
