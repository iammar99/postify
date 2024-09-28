import React, { useState } from 'react'
import { Link } from 'react-router-dom'
// --------------------- Firebase ---------------------
import { auth, fireStore } from 'Config/firebase'
import { sendPasswordResetEmail   } from 'firebase/auth'
import { doc, setDoc } from "firebase/firestore";
// --------------------- Notification ---------------------
import { message } from 'antd';
import Spinner from 'Components/Spinner/Spinner';
import { useAuthContext } from 'Context/AuthContext';

export default function Reset() {

  const [state, setState] = useState({})
  const [checked, setChecked] = useState(false)
  const [isProccessing  , setIsProccessing] = useState(false)
  const {dispatch} = useAuthContext()

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    setIsProccessing(true)
    let { email, password } = state
    e.preventDefault()
    if (!email  ) {
      message.error("Enter Your Email")
      setIsProccessing(false)
    }
    else {
      sendPasswordResetEmail  (auth, email)
          .then(() => {
            // Signed in 
            message.success("Link Sent")
            setIsProccessing(false)
          })
          .catch((error) => {
            message.error("Wrong Email !!")
            setIsProccessing(false)
            // ..
          });
    }
  }

  const handleCheckbox = (e) => {
    setChecked(!checked)
  }

  const mainStyle = {
    "display": "flex",
    "justifyContent": "center",
    "alignItems": "center",
  }

  return (
    <main style={mainStyle} className='form-main'>
      <h1 className="reset-heading">
        Forgot Password
      </h1>
      <form className='reset'>
        {/* ---------- Email ---------- */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            placeholder='abc@example.com'
            className="form-control"
            id="email"
            name='email'
            onChange={handleChange}
          />
        </div>
        {/* ---------- Button ---------- */}
        <div className="d-flex justify-content-between align-items-center w-100">
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
            {
              isProccessing
              ?
              <Spinner/>
              :
            "Submit"
            }
          </button>
          <Link to={"/auth/register"} className='form-links'>
            Not a member ? SignUp
          </Link>
        </div>
      </form>

    </main>
  )
}
