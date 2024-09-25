import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import { Routes, Route } from 'react-router-dom';
import Defaultlayout from './_components/Defaultlayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Form from './pages/Form';
import './App.css'
import Quotationtable from './pages/Quotationtable';
import QuotationView from './pages/QuotationView';
function App() {


  return (
    <>
      <Routes >
        <Route path='/' element={<Defaultlayout />}>
          <Route path='/' element={<Dashboard />}></Route>
          <Route path='/default/form' element={<Form />}></Route>
          <Route path='/default/quotetable' element={<Quotationtable />}></Route>
          <Route path='/default/view/:id' element={<QuotationView />}></Route>
        </Route>
        {/* <Route path='/' element={<Login />}></Route> */}


      </Routes>

    </>
  )
}

export default App; 
