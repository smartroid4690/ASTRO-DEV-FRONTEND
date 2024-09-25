import axios from "axios";

const API_BASE_URL = "https://3gc5tgdm-8000.inc1.devtunnels.ms/";

export const getBaseAlloys = async () => {
	try {
		const response = await axios.get(`${API_BASE_URL}/d/alloys/base_alloy/`);
		return response.data;
	} catch (error) {
		console.error("Error fetching base alloys", error.message);
		return [];
	}
};

export const getAlloysByBaseAlloyId = async (baseAlloyId) => {
	try {
		const response = await axios.get(
			`${API_BASE_URL}/d/alloys/${baseAlloyId}/sub_alloy`
		);
		return response.data;
	} catch (error) {
		console.error(
			"Error fetching alloys based on base alloy ID",
			error.message
		);
		return [];
	}
};

export const getTestCateogories = async () => {
	try {
		const response = await axios.get(`${API_BASE_URL}/d/testCategory/`);
		return response.data;
	} catch (error) {
		console.error("Error fetching tests", error.message);
		return [];
	}
};
