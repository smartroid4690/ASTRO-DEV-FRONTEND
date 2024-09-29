import React, { useEffect } from "react";
import { Card } from "primereact/card";
import { Accordion, AccordionTab } from "primereact/accordion";
export default function CardDetails({ detail }) {
	useEffect(() => {
		console.log(detail);
	});
	return (
		<Accordion className="w-full">
			<AccordionTab header={detail.test}>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa, cum.
				</p>
			</AccordionTab>
		</Accordion>
	);
}
