import React from "react";

const Footer = () => {
	return (
		<>
			<footer style={{ backgroundColor: "#BFDBFE", padding: "2rem" }}>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<div style={{ flex: "1 1 100%", textAlign: "center" }}>
						<a
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<span
								style={{
									fontSize: "1.5rem",
									fontWeight: "bold",
									color: "#1E3A8A",
								}}
							>
								Get in Touch
							</span>
						</a>
					</div>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							justifyContent: "space-around",
							width: "100%",
							marginTop: "1rem",
						}}
					>
						<div style={{ margin: "0 1rem" }}>
							<h2 style={{ fontSize: "1rem", fontWeight: "600" }}>Resources</h2>
							<ul style={{ listStyleType: "none", padding: "0" }}>
								<li>
									<a style={{ color: "#1E3A8A", textDecoration: "none" }}>
										About
									</a>
								</li>
								<li>
									<a style={{ color: "#1E3A8A", textDecoration: "none" }}>
										Gallery
									</a>
								</li>
							</ul>
						</div>
						<div style={{ margin: "0 1rem" }}>
							<h2 style={{ fontSize: "1rem", fontWeight: "600" }}>Follow us</h2>
							<ul style={{ listStyleType: "none", padding: "0" }}>
								<li>
									<a style={{ color: "#1E3A8A", textDecoration: "none" }}>
										Github
									</a>
								</li>
								<li>
									<a style={{ color: "#1E3A8A", textDecoration: "none" }}>
										Discord
									</a>
								</li>
							</ul>
						</div>
						<div style={{ margin: "0 1rem" }}>
							<h2 style={{ fontSize: "1rem", fontWeight: "600" }}>Legal</h2>
							<ul style={{ listStyleType: "none", padding: "0" }}>
								<li>
									<a
										href="#"
										style={{ color: "#1E3A8A", textDecoration: "none" }}
									>
										Privacy Policy
									</a>
								</li>
								<li>
									<a
										href="#"
										style={{ color: "#1E3A8A", textDecoration: "none" }}
									>
										Terms & Conditions
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<hr style={{ marginTop: "1rem", borderColor: "#1E3A8A" }} />
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginTop: "1rem",
					}}
				>
					<span style={{ fontSize: "0.875rem", color: "#1E3A8A" }}>
						© 2024{" "}
						<a
							href="https://flowbite.com/"
							style={{ color: "#1E3A8A", textDecoration: "none" }}
						>
							Footer
						</a>
						. All Rights Reserved.
					</span>
				</div>
			</footer>
		</>
	);
};

export default Footer;
