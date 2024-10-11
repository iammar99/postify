import React from 'react'

export default function DelBin(props) {
    return (
        <>
            <svg fill="none" viewBox="0 0 15 15" height="1em" width="1em" style={{ marginRight: '10px' }} onClick={props.onClick}>
                <path
                    stroke="currentColor"
                    d="M4.5 3V1.5a1 1 0 011-1h4a1 1 0 011 1V3M0 3.5h15m-13.5 0v10a1 1 0 001 1h10a1 1 0 001-1v-10M7.5 7v5m-3-3v3m6-3v3"
                />
            </svg>
        </>
    )
}
