import React, { useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";

export default function QuotationCardDetails({
	label,
	index,
	isSelected,
	onTestClick,
	onTestRemove,
}) {
	const labelRef = useRef(null);
	return (
		<div
			key={index}
			className={`w-full p-2  py-3 border-round-2xl border-1 ${
				isSelected ? "bg-blue-50 border-blue-500" : " bg-white border-gray-400"
			} `}
		>
			<div className="flex px-1 align-items-center justify-content-between">
				<div
					className="flex gap-3 align-items-center"
					onClick={() => onTestClick(index)}
				>
					<Button
						icon="pi pi-pencil text-lg"
						className={`p-button-text p-button-rounded ${
							isSelected ? "text-primary" : "text-black-alpha-50"
						} `}
					/>
					<span
						className={`white-space-nowrap  max-w-8rem overflow-hidden text-overflow-ellipsis ${
							isSelected ? "text-black" : "text-black-alpha-70"
						}`}
						ref={labelRef}
					>
						{label ? label : "Test not selected"}
					</span>
					<Tooltip target={labelRef} content={label} position="top" />
				</div>
				<div className="flex align-items-center">
					<Button
						icon="pi pi-trash text-lg"
						className="p-button-text text-black-alpha-60 p-button-rounded hover:text-black-alpha-90 "
						onClick={() => onTestRemove(index)}
					/>
				</div>
			</div>
		</div>
	);
}
