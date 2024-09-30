import { useState, useCallback } from "react";
import { useQueries } from "@tanstack/react-query";
import {
	getTestConditionsByTestId,
	getTestObjects,
	getUnitDImensionsByConditionId,
	getTestParametersByTestId,
} from "../services/quotationService";

const useMultipleTestDetails = (initialTests = []) => {
	const [tests, setTests] = useState(initialTests);

	const testConditionQueries = useQueries({
		queries: tests.map((test) => ({
			queryKey: ["testConditions", test.id],
			queryFn: () => getTestConditionsByTestId(test.id),
			enabled: !!test.id,
		})),
	});
	const testParamQueries = useQueries({
		queries: tests.map((test) => ({
			queryKey: ["testParameters", test.id],
			queryFn: () => getTestParametersByTestId(test.id),
			enabled: !!test.id,
		})),
	});

	const testObjectsQuery = useQueries({
		queries: [
			{
				queryKey: ["testObjects"],
				queryFn: getTestObjects,
			},
		],
	})[0];

	const unitDimensionsQueries = useQueries({
		queries: tests.map((test) => ({
			queryKey: ["unitDimensions", test.selectedConditionId],
			queryFn: () => getUnitDImensionsByConditionId(test.selectedConditionId),
			enabled: !!test.selectedConditionId,
		})),
	});

	const addTest = useCallback(() => {
		setTests((prevTests) => [
			...prevTests,
			{ id: null, selectedConditionId: null },
		]);
	}, []);

	const updateTest = useCallback((index, updates) => {
		setTests((prevTests) =>
			prevTests.map((test, i) => {
				return i === index ? { ...test, ...updates } : test;
			})
		);
	}, []);

	const removeTest = useCallback((index) => {
		setTests((prevTests) => prevTests.filter((_, i) => i !== index));
	}, []);

	return {
		tests,
		addTest,
		updateTest,
		removeTest,
		testConditionQueries,
		testParamQueries,
		testObjectsQuery,
		unitDimensionsQueries,
	};
};

export default useMultipleTestDetails;
