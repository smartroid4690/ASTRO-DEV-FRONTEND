import React, { useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import Footer from "./Footer";

const Defaultlayout = () => {
	const [isOpen, setIsOpen] = useState(false);
	const toggleBar = () => {
		setIsOpen(!isOpen);
	};
	return (
		<>
			<div className="h-screen flex flex-column">
				<div className="">
					<Header toggleBar={toggleBar} />
				</div>

				<div className="flex flex-grow overflow-hidden">
					{isOpen && (
						<div className="w-2 max-w-20 overflow-y-auto bg-gray-100">
							<SideNav />
						</div>
					)}

					<div className="flex-auto overflow-y-auto">
						<Outlet />
						{/* <div className="flex-none">
							<Footer />
						</div> */}
					</div>
				</div>
			</div>
		</>
	);
};

export default Defaultlayout;

{
	/* <div className="h-screen overflow-hidden">
	<div className="">
		<Header toggleBar={toggleBar} />
	</div>
	<div className="flex">
		{isOpen && (
			<div
				className="w-2 overflow-y-scroll"
				style={{
					scrollbarWidth: "thin",
					scrollbarColor: "#2196f3 #e0e0e4",
					scroll,
				}}
			>
				<SideNav />
			</div>
		)}
		<div
			className="w-full border-red-100 border-2 !overflow-y-scroll"
			// style={{ scrollbarWidth: "none" }}
		>
			<Outlet />
		</div>
	</div>
	{/* <div>
                    <Footer />
                </div> */
}
// </div>; */}
