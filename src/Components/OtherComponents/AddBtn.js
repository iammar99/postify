import React from 'react'

export default function AddBtn() {
    return (
        <div className="wrapper">
            <input type="checkbox" id="toogle" className="hidden-trigger" />
            <label htmlFor="toogle" className="circle">
                <svg
                    className="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width={48}
                    height={48}
                    xmlSpace="preserve"
                    version="1.1"
                    viewBox="0 0 48 48"
                >
                    <image
                        width={48}
                        height={48}
                        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAbElEQVR4Ae3XwQnFQAiE4eVVsGAP1mkPFjwvQvYSWCQYCYGZv4Dv5MGB5ghcIiDQI+kCftCzNsAR8y5gYu2rwCBAgMBTgEC3rek2yQEtAZoDjso8AyaKexmIDJUZD40AAQIE0gwx449GgMC9/t0b7GTsa7J+AAAAAElFTkSuQmCC"
                    />
                </svg>
            </label>
            <div className="subs">
                <button className="sub-circle">
                    <input
                        defaultValue={1}
                        name="sub-circle"
                        type="radio"
                        id="sub1"
                        className="hidden-sub-trigger"
                    />
                    <label htmlFor="sub1" />
                </button>
                <button className="sub-circle">
                    <input
                        defaultValue={1}
                        name="sub-circle"
                        type="radio"
                        id="sub2"
                        className="hidden-sub-trigger"
                    />
                    <label htmlFor="sub2" />
                </button>
                <button className="sub-circle">
                    <input
                        defaultValue={1}
                        name="sub-circle"
                        type="radio"
                        id="sub3"
                        className="hidden-sub-trigger"
                    />
                    <label htmlFor="sub3" />
                </button>
                <button className="sub-circle">
                    <input
                        defaultValue={1}
                        name="sub-circle"
                        type="radio"
                        id="sub4"
                        className="hidden-sub-trigger"
                    />
                    <label htmlFor="sub4" />
                </button>
                <button className="sub-circle">
                    <input
                        defaultValue={1}
                        name="sub-circle"
                        type="radio"
                        id="sub5"
                        className="hidden-sub-trigger"
                    />
                    <label htmlFor="sub5" />
                </button>
                <button className="sub-circle">
                    <input
                        defaultValue={1}
                        name="sub-circle"
                        type="radio"
                        id="sub6"
                        className="hidden-sub-trigger"
                    />
                    <label htmlFor="sub6" />
                </button>
                <button className="sub-circle">
                    <input
                        defaultValue={1}
                        name="sub-circle"
                        type="radio"
                        id="sub7"
                        className="hidden-sub-trigger"
                    />
                    <label htmlFor="sub7" />
                </button>
                <button className="sub-circle">
                    <input
                        defaultValue={1}
                        name="sub-circle"
                        type="radio"
                        id="sub8"
                        className="hidden-sub-trigger"
                    />
                    <label htmlFor="sub8" />
                </button>
            </div>
        </div>

    )
}
