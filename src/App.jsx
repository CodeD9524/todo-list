import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TodosPage from './features/pages/TodosPage';
import Header from './shared/Header/Header';
import About from './features/pages/About/About';
import NotFound from './features/pages/NotFound/NF'; 
import './App.css';

function App() {
  return (
      <div className="app">
        <Header title="My Awesome Application"/>

        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/About">About</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<TodosPage />} />
          <Route path="/About" element={<About />} />
          <Route path="*" element={<NotFound />} /> {}
        </Routes>
      </div>
  );
}

export default App;
