import React from "react";
import { Button } from "primereact/button";
import QuotationCardDetails from "./QuotationCardDetails";

const QuotationOverview = ({
	onAddTestClick,
	onTestClick,
	selectedTestIndex,
	selectedTests,
	onTestRemove,
}) => {
	return (
		<div
			className="sticky top-0 h-screen flex flex-column border-round-3xl surface-0 shadow-5 w-21rem"
			style={{ maxHeight: "600px" }}
		>
			<div className="flex flex-grow-0 justify-content-between px-3 py-3 border-round-top-3xl surface-800 text-white">
				<span className="font-semibold text-2xl">Order Details</span>
				<span>
					<Button
						onClick={onAddTestClick}
						className="w-6rem"
						label="Add Test"
					/>
				</span>
			</div>
			<div
				className="h-27rem flex-grow-1 overflow-y-scroll gap-3 py-5 flex flex-column align-items-center w-full surface-200 px-3"
				style={{ scrollbarWidth: "none" }}
			>
				{selectedTests &&
					selectedTests.map((detail, index) => (
						<QuotationCardDetails
							key={index}
							index={index}
							label={detail?.label}
							isSelected={selectedTestIndex === index}
							onTestClick={onTestClick}
							onTestRemove={onTestRemove}
						/>
					))}
			</div>
			<div className="surface-900 flex-grow-0 text-white py-4 border-round-bottom-3xl ">
				<div className="flex justify-content-between px-4">
					<div className="font-bold">ESTIMATED COST</div>
					<div className="font-bold">$ 00.</div>
				</div>
			</div>
		</div>
	);
};

export default QuotationOverview;
{
	/* <Button
								key={index}
								className={`w-full ${
									selectedTestIndex === index ? "" : "p-button-outlined"
								}`}
								label={detail.label ? detail.label : "Test Label"}
								onClick={() => onTestClick(index)}
							/> */
}
