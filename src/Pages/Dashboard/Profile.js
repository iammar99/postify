import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { auth, fireStore, storage } from 'Config/firebase'
import { signOut } from 'firebase/auth'
import { ref, deleteObject } from "firebase/storage";
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useAuthContext } from 'Context/AuthContext';
import { message } from 'antd'
import userImg from "../../Assets/user.png"
import Loader from 'Components/DataLoader/Loader';
import ReactQuill from 'react-quill';




export default function Profile() {

    let user = JSON.parse(localStorage.getItem("user"))
    const { dispatch } = useAuthContext()
    const [isProccessing, setIsProccessing] = useState(false)
    const [posts, setPosts] = useState([])
    const [expandedPosts, setExpandedPosts] = useState({});
    // Edit Post
    const [username, setUsername] = useState("")
    const [file, setFile] = useState(null)
    const [editPost, setEditPost] = useState({})
    const [image, setImage] = useState(null)


    let newDate = new Date()

    let profileImg

    if (user.imageUrl === undefined) {
        profileImg = userImg
    }
    else {
        profileImg = user.imageUrl
    }

    const fetchData = useCallback(async () => {
        setIsProccessing(true)
        let array = []
        const q = query(collection(fireStore, "Posts"), where("createrID", "==", user.userId));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            let data = doc.data()
            array.push(data)
        });
        setPosts(array)
        setIsProccessing(false)
    })

    useEffect(() => {
        fetchData()
    }, [])





    const handleLogout = (e) => {
        e.preventDefault()
        signOut(auth)
            .then(() => {
                localStorage.setItem("Token", "False")
                localStorage.removeItem("user")
                dispatch({ type: "Set_Logged_Out", payload: {} })
                message.success("Loggoed Out")

            })
            .catch((error) => {
                console.log('error', error)
                // ..
            });
    }

    // EDit


    const handleEdit = async () => {
        let updatedPost = { ...editPost }
        let newPosts = posts.filter((post) => {
            if (post.postID !== updatedPost.postID) {
                return post
            }
            else {
                return updatedPost
            }
        })
        const PostRef = doc(fireStore, "Posts", updatedPost.Postid);
        await updateDoc(PostRef, updatedPost);
        setPosts(newPosts)
        message.success("Updated")
    }



    // Delete

    const handleDelete = async (post) => {
        console.log(post)
        let newArr = posts.filter((doc) => {
            return doc.Postid !== post.Postid
        })
        await deleteDoc(doc(fireStore, "Posts", post.Postid));
        const desertRef = ref(storage, "postImages/" + post.imgName);
        // Delete the file
        deleteObject(desertRef).then(() => {
            // File deleted successfully
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });
        setPosts(newArr)
    }


    // For handling post length (Read More / Read Less)
    const handleToggle = (postId) => {
        setExpandedPosts((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));
    };


    return (
        <main>
            {/* profile section */}
            <div className="container-fluid">
                <div className="row ">
                    <div className="d-flex justify-content-between align-items-center ">
                        <div className="profile-box flex-sm-row flex-column">
                            <img className='profile-img' src={profileImg} alt="" />
                            <div className="bio-box ms-3">
                                <h1 className="userName">
                                    {user.username}
                                </h1>
                                <p className="bio-description fw-medium  fs-6">
                                    {user.bio}
                                </p>
                            </div>
                        </div>
                        <div className="profile-btn-container d-flex flex-column align-items-center">
                            <button className="logoutBtn mb-4" onClick={handleLogout}>
                                <div className="sign">
                                    <svg viewBox="0 0 512 512">
                                        <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                                    </svg>
                                </div>
                                <div className="text">Logout</div>
                            </button>
                            <Link to={"/dashboard/setting"} style={{ "textDecoration": "none" }}>
                                <button className="setting-button">
                                    <svg
                                        className="svg-icon"
                                        fill="none"
                                        height={20}
                                        viewBox="0 0 20 20"
                                        width={20}
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g stroke="white" strokeLinecap="round" strokeWidth="1.5">
                                            <circle cx={10} cy={10} r="2.5" />
                                            <path
                                                clipRule="evenodd"
                                                d="m8.39079 2.80235c.53842-1.51424 2.67991-1.51424 3.21831-.00001.3392.95358 1.4284 1.40477 2.3425.97027 1.4514-.68995 2.9657.82427 2.2758 2.27575-.4345.91407.0166 2.00334.9702 2.34248 1.5143.53842 1.5143 2.67996 0 3.21836-.9536.3391-1.4047 1.4284-.9702 2.3425.6899 1.4514-.8244 2.9656-2.2758 2.2757-.9141-.4345-2.0033.0167-2.3425.9703-.5384 1.5142-2.67989 1.5142-3.21831 0-.33914-.9536-1.4284-1.4048-2.34247-.9703-1.45148.6899-2.96571-.8243-2.27575-2.2757.43449-.9141-.01669-2.0034-.97028-2.3425-1.51422-.5384-1.51422-2.67994.00001-3.21836.95358-.33914 1.40476-1.42841.97027-2.34248-.68996-1.45148.82427-2.9657 2.27575-2.27575.91407.4345 2.00333-.01669 2.34247-.97026z"
                                                fillRule="evenodd"
                                            />
                                        </g>
                                    </svg>
                                    <span className="lable">Account</span>
                                </button>
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
            {/* Posts section */}
            <div className="container-fluid">
                <hr />
                <h1 className="profile-post-heading text-center my-3 fw-bold ">
                    My Post
                </h1>
                {
                    isProccessing
                        ?
                        <Loader />
                        :
                        <>
                            {
                                posts.length > 0
                                    ?

                                    <div className="container">
                                        <div className="row">
                                            {
                                                posts.map((post, index) => {
                                                    const isExpanded = expandedPosts[post.Postid];
                                                    const textLimit = 100;
                                                    const isLongPost = post.text.length > textLimit; // Check if post is long
                                                    const text = post.text.substring(0, textLimit) + "...";
                                                    const fullText = post.text;
                                                    // For handling comment section
                                                    return (
                                                        <>
                                                            <div className="col-md-4 col-sm-6 col-12" >
                                                                <div className="homePostCard" key={index}>
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="post-profile">
                                                                            <img className='profileImg' src={post.createrProfile ? post.createrProfile : profileImg} alt="" />
                                                                            <b className='ms-2'>
                                                                                {post.createrUsername}
                                                                            </b>
                                                                        </div>
                                                                        <label className="popup">
                                                                            <input type="checkbox" />
                                                                            <div
                                                                                className="burger"
                                                                                tabIndex="0"
                                                                            >
                                                                                <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM128,72a12,12,0,1,0-12-12A12,12,0,0,0,128,72Zm0,112a12,12,0,1,0,12,12A12,12,0,0,0,128,184Z"></path></svg>
                                                                            </div>
                                                                            <nav className="popup-window">
                                                                                <ul>
                                                                                    <li>
                                                                                        <button data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setEditPost(post) }}>
                                                                                            <span>
                                                                                                Edit
                                                                                            </span>
                                                                                        </button>
                                                                                    </li>
                                                                                    <li>
                                                                                        <button onClick={() => { handleDelete(post) }}>
                                                                                            <span>
                                                                                                Delete
                                                                                            </span>
                                                                                        </button>
                                                                                    </li>
                                                                                </ul>
                                                                            </nav>
                                                                        </label>

                                                                    </div>
                                                                    <p>
                                                                        {/* Conditional rendering for full or short text */}
                                                                        {/* For controlling length of the post */}
                                                                        <ReactQuill
                                                                            value={isExpanded ? fullText : post.text.substring(0, 100) + '...'}
                                                                            readOnly={true} // Set to read-only mode since it's for display
                                                                            theme="bubble" // You can also use 'snow' or 'bubble' themes
                                                                        />
                                                                        {
                                                                            isLongPost && (
                                                                                <Link
                                                                                    onClick={() => handleToggle(post.Postid)} // Use Postid for toggling
                                                                                    style={{ marginLeft: '5px', cursor: 'pointer' }}
                                                                                >
                                                                                    {!isExpanded ? "Read More" : "Read Less"}
                                                                                </Link>
                                                                            )
                                                                        }
                                                                    </p>
                                                                    {
                                                                        post.imageUrl ?
                                                                            <div className="img-container">
                                                                                <img src={post.imageUrl} alt="" style={{ "height": "inherit", "width": "-webkit-fill-available" }} />
                                                                            </div>
                                                                            : null
                                                                    }
                                                                    <b className='my-2'>
                                                                        {
                                                                            Math.floor((newDate - new Date(post.dateCreated)) / (1000 * 60 * 60 * 24 * 7)) <= 1
                                                                                ?
                                                                                Math.floor((newDate - new Date(post.dateCreated)) / (1000 * 60 * 60 * 24)) <= 1
                                                                                    ?
                                                                                    "Today"
                                                                                    :
                                                                                    Math.floor((newDate - new Date(post.dateCreated)) / (1000 * 60 * 60 * 24)) + " Days"
                                                                                :
                                                                                Math.floor((newDate - new Date(post.dateCreated)) / (1000 * 60 * 60 * 24 * 7)) + " Weeks"
                                                                        }
                                                                    </b>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>

                                    :
                                    <h1 className="text-center my-5 fw-bolder">
                                        No Posts Yet
                                    </h1>
                            }
                        </>
                }
            </div>
            {/* Modal  */}

            <div
                key="1"
                aria-hidden="true"
                aria-labelledby="exampleModalLabel"
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1
                                className="modal-title fs-5"
                                id="exampleModalLabel"
                            >
                                Edit Your Post
                            </h1>
                            <button
                                aria-label="Close"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                type="button"
                            />
                        </div>
                        <div className="modal-body">



                            {/* Description */}

                            <label className='my-3' htmlFor="description" id='editDescription' >
                                Description
                            </label>
                            <textarea name="description" className='edit_post' defaultValue={editPost.text} onChange={(e) => { editPost.text = e.target.value }} id=""></textarea>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                type="button"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleEdit}
                                className="btn btn-primary"
                                type="button"
                            >
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </main >
    )
}
