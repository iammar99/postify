import React from 'react'
import { Link } from 'react-router-dom'
import userLogo from "../../Assets/user.png"
import { useAuthContext } from 'Context/AuthContext'


export default function MobileNav() {

    const isAuth = useAuthContext()
    const auth =isAuth.isAuth 
    let userImg

    let user = JSON.parse(localStorage.getItem("user"))

    if (auth) {
        if (user.imageUrl) {
          userImg = user.imageUrl
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
            <nav className="mobile-nav">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col d-flex justify-content-between align-items-content">
                            <Link to={"/"}>
                                <i className="fa-solid fa-house" style={{ "color": "rgb(0, 0, 0)", "fontSize": "44px" }}></i>
                            </Link>
                            <Link to={"/dashboard/addPost"}>
                                <i className="fa-solid fa-plus" style={{ "color": "rgb(0, 0, 0)", "fontSize": "44px" }}></i>
                            </Link>
                            <div className="profile">
                                <Link to={"/dashboard/profile"}>
                                    <img className='mobile_nav_img' src={userImg} alt="" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
