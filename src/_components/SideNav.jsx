import React from "react";
import Dash from "../components/navigation/Dash";
import Profile from "../components/navigation/Profile";
import Status from "../components/navigation/Status";
import NewForm from "../components/navigation/NewForm";
import About from "../components/navigation/About";
import Order from "../components/navigation/Order";
import Tests from "../components/navigation/Tests";
import Contact from "../components/navigation/Contact";
import QuoteTable from "../components/navigation/QuoteTable";

const SideNav = () => {
	return (
		<>
			<div>
				<ul className="gap-6 flex flex-column mt-4 list-none">
					<li>
						<Dash />
					</li>
					<li>
						<Profile />
					</li>
					<li>
						<Status />
					</li>
					<li>
						<NewForm />
					</li>
					<li>
						<About />
					</li>
					<li>
						<QuoteTable />
					</li>
					<li>
						<Tests />
					</li>
					<li>
						<Contact />
					</li>
					<li>
						<About />
					</li>
					<li>
						<Profile />
					</li>
				</ul>
			</div>
		</>
	);
};

export default SideNav;
