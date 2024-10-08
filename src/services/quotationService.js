import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export const getTestConditionsByTestId = async (id) => {
	const response = await axios.get(`${API_BASE_URL}/d/condition/?test=${id}`);
	return response.data;
};

export const getUnitDimensionsByConditionId = async (id) => {
	const response = await axios.get(
		`${API_BASE_URL}/u/unitdimension/?condition=${id}`
	);
	return response.data;
};

export const getUnitDimensionsByParameterId = async (id) => {
	const response = await axios.get(
		`${API_BASE_URL}/u/unitdimension/?parameter=${id}`
	);
	return response.data;
};

export const getTestParametersByTestId = async (id) => {
	const response = await axios.get(`${API_BASE_URL}/d/parameter/?test=${id}`);
	return response.data;
};

export const getDimensions = async () => {
	const response = await axios.get(`${API_BASE_URL}/u/dimension/`);
	return response.data;
};

export const formSubmit = async (data) => {
	const response = await axios.post(`${API_BASE_URL}/r/quotation/`, data);
	return response.data;
};
