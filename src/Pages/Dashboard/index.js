import React from 'react'
// Components functions
import { Route, Routes ,useLocation } from 'react-router-dom'

// Components
import Header from 'Components/Header'
import Footer from 'Components/Footer'
import Profile from './Profile'
import Setting from './Setting'
import AddPost from './AddPost'
import Clan from './Clan'

export default function Dashboard() {
  const location = useLocation();

  return (
    <>
      {/* Only show Header and Footer if the path does not start with '/clan' */}
      {!location.pathname.startsWith('/dashboard/clan') && <Header />}
      
      <Routes>
        <Route path='/profile' element={<Profile />} />
        <Route path='/setting' element={<Setting />} />
        <Route path='/addPost' element={<AddPost />} />
        <Route path='/clan' element={<Clan />} />
      </Routes>
      
      {!location.pathname.startsWith('/dashboard/clan') && <Footer />}
    </>
  );
}
