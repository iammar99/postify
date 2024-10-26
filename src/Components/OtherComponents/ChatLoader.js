import React from 'react'

export default function ChatLoader(props) {
    return (
        <div className={`loader ${props.margin}-auto`}>
            <div className="wrapper">
                <div className="circle" />
                <div className="line-3" />
                <div className="line-4" />
            </div>
        </div>

    )
}
