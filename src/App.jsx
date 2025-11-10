import { useState, useEffect} from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router";
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';

import FestivalsIndex from '@/pages/festivals/Index';
import FestivalsShow from '@/pages/festivals/Show';


export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const onLogin = (auth, token) => {
    setLoggedIn(auth);

    if(auth){
      localStorage.setItem('token', token)
    }
    else {
      localStorage.removeItem('token');
    }
  };

  return (
    <>
      <Router>
        <Navbar onLogin={onLogin} loggedIn={loggedIn} />
        <Routes>
          <Route path='/' element={<Home onLogin={onLogin} loggedIn={loggedIn} />} />

          <Route path="/festivals" element={<FestivalsIndex />} />
          <Route path="/festivals/:id" element={<FestivalsShow loggedIn={loggedIn} />} />

        </Routes>
      </Router>
    </>
  )
}