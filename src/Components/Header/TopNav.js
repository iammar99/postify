import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from "../../Assets/logo.jpg"
import userLogo from "../../Assets/user.png"
import { useAuthContext } from 'Context/AuthContext'



export default function TopNav() {

  const isAuth = useAuthContext()
  const auth = isAuth.isAuth
  let userImg

  let user = JSON.parse(localStorage.getItem("user"))

  if (auth) {
    if (user.imageUrl) {
      userImg = user.imageUrl
      console.log(userImg)
    }
    else {
      userImg = userLogo
    }
  }
  else {
    userImg = userLogo
  }


  return (
    <header>
      <nav className="navbar navbar-expand-lg ">
        <div className="container-fluid">
          <Link className="navbar-brand" to={"/"}>
            <img src={logo} style={{ "width": "50px", "borderRadius": "50%" }} alt="" />
          </Link>
          {/* ------------- togller & profile pic */}
          {/* <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button> */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to={"/"}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/dashboard/addPost"}>
                  Add Post
                </Link>
              </li>
            </ul>
          </div>
          <Link to={"/dashboard/profile"} className='ms-3'>
            <div className="profile-link">
              <img src={userImg} alt="profile" style={{ "height": "50px", "width": "-webkit-fill-available", "borderRadius": "50%" }} />
            </div>
          </Link>
        </div>
      </nav>

    </header>
  )
}
