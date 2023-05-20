import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, DetailPage } from './pages';
import { ROUTE } from './routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path={ROUTE.DETAILS} element={<DetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
