import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import { Routes, Route } from 'react-router-dom';
import Defaultlayout from './_components/Defaultlayout';
import Login from './pages/Login';
import QuoteForm from './pages/QuoteForm';
import Dashboard from './pages/Dashboard';

function App() {


  return (
    <>
      <Routes >
        <Route path='/' element={<Defaultlayout />}>
          <Route path='/' element={<Dashboard />}></Route>
          <Route path='/quote' element={<QuoteForm />}></Route>
        </Route>
        <Route path='/login' element={<Login />}></Route>


      </Routes>

    </>
  )
}

export default App
