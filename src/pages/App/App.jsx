import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import HomePage from '../HomePage/HomePage';

import NavBar from '../../components/NavBar/NavBar';


function App() {
  const [search, setSearch] = useState(false);

  const searchProperties = () => {
    setSearch(false);
  };

  const sendInformation = () => {
    setSearch(true);
  };

  return (
    <>
      <main className="App">
          <>
            <NavBar
              searchProperties={searchProperties}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <div className="center-searchPage">
                    <HomePage
                      search={search}
                      sendInformation={sendInformation}
                    />
                  </div>
                }
              />
            </Routes>
          </>
         
      </main>
    </>
  );
}

export default App;
