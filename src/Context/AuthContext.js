import React, { useState, createContext, useReducer, useContext, useEffect } from 'react'


export const AuthContext = createContext()


export const initalState = { isAuth: false, user: {} }

const reducer = (state, action) => {
    switch (action.type) {
        case "Set_Logged_In":
            return { isAuth: true, user: action.payload.user }
        case "Set_Logged_Out":
            return initalState
        default:
            return state
    }
}


const AuthContextProvider = ({ children }) => {
    let userID

    const [state, dispatch] = useReducer(reducer, initalState)
    const [isApploading, setIsApploading] = useState(true)




    useEffect(() => {
        const token = localStorage.getItem("Token")
        if (token === "True") {
            const user = JSON.parse(localStorage.getItem("user"))
            userID = user.userId
            dispatch({ type: "Set_Logged_In", payload: { user } })
        }
        setTimeout(() => {
            setIsApploading(false)
        }, 400)
    }, [])

return (
    <>
        <AuthContext.Provider value={{ ...state, dispatch, isApploading }}>
            {children}
        </AuthContext.Provider>
    </>
)
}

export const useAuthContext = () => useContext(AuthContext)

export { AuthContextProvider }