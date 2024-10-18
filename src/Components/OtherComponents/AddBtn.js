import React from 'react'
import { Link } from 'react-router-dom'

export default function AddBtn() {
    return (
        <Link to={"/dashboard/addPost"} style={{"color":"white","textDecoration":"none"}}>
            <button className="cssbuttons-io-button">
                <svg
                    height={24}
                    width={24}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" fill="currentColor" />
                </svg>
                <span>Add</span>
            </button>
        </Link>
    )
}
