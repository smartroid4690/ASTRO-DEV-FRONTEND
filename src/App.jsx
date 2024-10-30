import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { Routes, Route } from "react-router-dom";
import Defaultlayout from "./_components/Defaultlayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Form from "./pages/Form";
import "./App.css";
import Quotationtable from "./pages/Quotationtable";
import QuotationView from "./pages/QuotationView";
import SignUp from "./components/navigation/SignUp";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Profile_layout } from "./components/Profile_layout";

function App() {
	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={true}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				limit={1}
			/>
			<Routes>
				<Route path="/" element={<Defaultlayout />}>
					<Route path="/" element={<Dashboard />}></Route>
					<Route path="/default/form" element={<Form />}></Route>
					<Route
						path="/default/quotetable"
						element={<Quotationtable />}
					></Route>
					<Route path="/default/view/:id" element={<QuotationView />}></Route>
					<Route path="/signUp" element={<SignUp />} />
					<Route path='/login' element={<Login />}></Route>
					<Route path='/profile' element={<Profile_layout />}></Route>

				</Route>
			</Routes>
		</>
	);
}

export default App;
