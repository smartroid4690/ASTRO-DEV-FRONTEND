import { useState, useCallback } from "react";
import { useQueries } from "@tanstack/react-query";
import {
	getTestConditionsByTestId,
	getTestObjects,
	getUnitDimensionsByConditionId,
	getTestParametersByTestId,
	getUnitDimensionsByParameterId,
} from "../services/quotationService";

const useMultipleTestDetails = (initialTests = []) => {
	const [selectedTests, setSelectedTests] = useState(
		initialTests.map((test) => ({
			...test,
		}))
	);

	const testQueries = useQueries({
		queries: selectedTests.flatMap((test) => [
			{
				queryKey: ["testConditions", test.id],
				queryFn: () => getTestConditionsByTestId(test.id),
				enabled: !!test.id,
			},
			{
				queryKey: ["testParameters", test.id],
				queryFn: () => getTestParametersByTestId(test.id),
				enabled: !!test.id,
			},
			{
				queryKey: ["unitDimensions", test.selectedConditionId],
				queryFn: () => getUnitDimensionsByConditionId(test.selectedConditionId),
				enabled: !!test.selectedConditionId,
			},
		]),
	});

	const testObjectsQuery = useQueries({
		queries: [
			{
				queryKey: ["testObjects"],
				queryFn: getTestObjects,
			},
		],
	})[0];

	const addTest = useCallback(() => {
		setSelectedTests((prevTests) => [
			...prevTests,
			{
				id: null,
				selectedConditionId: null,
				index: null,
				label: "",
			},
		]);
	}, []);

	const updateTest = useCallback((index, updates) => {
		setSelectedTests((prevTests) =>
			prevTests.map((test, i) => {
				if (i === index) {
					return {
						...test,
						...updates,
					};
				}
				return test;
			})
		);
	}, []);

	const removeTest = useCallback((index) => {
		setSelectedTests((prevTests) => prevTests.filter((_, i) => i !== index));
	}, []);

	//

	return {
		selectedTests,
		addTest,
		updateTest,
		removeTest,
		testQueries,
		testObjectsQuery,
	};
};

export default useMultipleTestDetails;
