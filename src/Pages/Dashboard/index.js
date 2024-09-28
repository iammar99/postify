import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from 'Components/Header'
import Footer from 'Components/Footer'
import Profile from './Profile'
import Setting from './Setting'
import AddPost from './AddPost'

export default function Dashboard() {
  return (
    <>
    <Header/>
    <Routes>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/setting' element={<Setting/>}/>
      <Route path='/addPost' element={<AddPost/>}/>
    </Routes>
    <Footer/>
    </>
  )
}
