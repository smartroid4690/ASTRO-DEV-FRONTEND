import React from "react";
import "primeflex/primeflex.css";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Header = ({ toggleBar }) => {
	return (
		<>
			<header>
				<nav className="shadow-1">
					<div className="flex align-items-center py-3 ml-5 justify-content-between w-11">
						<div className=" flex align-items-center gap-7">
							<button
								onClick={toggleBar}
								className="bg-blue-600 text-white p-2 border-round-lg border-none"
							>
								<FontAwesomeIcon icon={faBars} className="text-2xl" />
							</button>
							<span className="text-4xl font-bold ">Astro</span>
						</div>

						<div className="flex gap-3">
							<Link className="font-semibold no-underline text-900 hidden lg:flex">
								Community{" "}
							</Link>
							<Link className="font-semibold no-underline text-900 hidden lg:flex">
								Solutions
							</Link>
							<Link className="font-semibold no-underline text-900 hidden lg:flex">
								Resources
							</Link>
							<Link className="font-semibold no-underline text-900 hidden lg:flex">
								Community
							</Link>
							<Link className="font-semibold no-underline text-900 hidden lg:flex">
								Pricing
							</Link>
							<Link className="font-semibold no-underline text-900 hidden lg:flex">
								Contact
							</Link>
						</div>
						<div>
							<Button label="Log out" className="font-bold " />
						</div>
					</div>
				</nav>
			</header>
		</>
	);
};

export default Header;
