import axios from "axios";

const API_BASE_URL = "https://3gc5tgdm-8000.inc1.devtunnels.ms/";

export const getBaseAlloys = async () => {
	const response = await axios.get(`${API_BASE_URL}/d/alloys/base_alloy/`);
	return response.data;
};

export const getAlloysByBaseAlloyId = async (baseAlloyId) => {
	const response = await axios.get(
		`${API_BASE_URL}/d/alloys/${baseAlloyId}/sub_alloy`
	);
	return response.data;
};

export const getTestCategories = async () => {
	const response = await axios.get(`${API_BASE_URL}/d/testCategory/`);

	return response.data;
};

export const getTestObjects = async () => {
	const response = await axios.get(`${API_BASE_URL}/d/testObject/`);

	return response.data;
};

export const getTestConditionsByTestId = async (testId) => {
	const response = await axios.get(
		`${API_BASE_URL}/d/condition/${testId}/test/`
	);
	console.log(response.data, "test condition");
	return response.data;
};

export const getUnitDimensions = async () => {
	const response = await axios.get(`${API_BASE_URL}/u/unitdimension/`);
	return response.data;
};