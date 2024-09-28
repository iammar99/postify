import React, { useEffect, useCallback, useState } from 'react'
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { fireStore } from 'Config/firebase';
import Loader from 'Components/DataLoader/Loader'
import profileImg from "../../Assets/user.png"


export default function Home() {

    const [isLoading, setIsLoading] = useState(false)
    const [posts, setPosts] = useState([])
    const [postLike, setPostLike] = useState({})
    const [fullPara, setFullPara] = useState(false)
    const [expandedPosts, setExpandedPosts] = useState({});
    let newDate = new Date()

    const fetchData = useCallback(async () => {
        let array = []
        setIsLoading(true)
        const querySnapshot = await getDocs(collection(fireStore, "Posts"));
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            let data = doc.data()
            array.push(data)
            setIsLoading(false)
        });
        setPosts(array)
    })

    useEffect(() => {
        fetchData()
    }, [])

    // For handling Likes

    const handleLikes = async (post) => {
        let updatedPost = { ...post }
        updatedPost.likes += 1
        let newArr = posts.map((doc) => {
            if (doc.Postid === post.Postid) {
                return updatedPost
            } else {
                return doc
            }
        })
        setPosts(newArr)
        await setDoc(doc(fireStore, "Posts", post.Postid), {
            ...updatedPost,
        });
    }

    // For handling Post length

    const handleToggle = (postId) => {
        setExpandedPosts((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));
    };

    // For handling Post Comments 

    const handleComments = (post) => {
        console.log(post)
    };

    return (
        <main>
            {
                isLoading
                    ?
                    <Loader />
                    :
                    <>
                        {
                            posts.map((post, i) => {
                                const isExpanded = expandedPosts[post.Postid];
                                const text = post.text.substring(0, 100) + "...";
                                const fullText = post.text;
                                return (
                                    <>
                                        <div key={i}>
                                            <div className='post-card'>
                                                <div className="post-profile">
                                                    <img className='post-profileImg' src={post.createrProfile ? post.createrProfile : profileImg} alt="" />
                                                    <b className='ms-2'>
                                                        {post.createrUsername}
                                                    </b>
                                                </div>
                                                <p>
                                                    {/* For controlling length of the post */}
                                                    {!isExpanded ? text : fullText}
                                                    <Link onClick={() => handleToggle(post.Postid)}>
                                                        {!isExpanded ? "Read More" : "Read Less"}
                                                    </Link>
                                                </p>
                                                {
                                                    post.imageUrl ?
                                                        <div className="img-container">
                                                            <img src={post.imageUrl} alt="" style={{ "height": "inherit", "margin": "auto", "display": "block" }} />
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
                                                {/* Funstions */}
                                                <div className="d-flex justify-content-start">
                                                    {/* For like  */}
                                                    <button className="LikeBtn" onClick={(e) => { handleLikes(post) }}>
                                                        <span className="leftContainer">
                                                            <svg
                                                                fill="white"
                                                                height="1em"
                                                                viewBox="0 0 512 512"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                                                            </svg>
                                                            <span className="like">
                                                                Like
                                                            </span>
                                                        </span>
                                                        <span className="likeCount">
                                                            {
                                                                post.likes
                                                            }

                                                        </span>
                                                    </button>
                                                    {/* For comment  */}
                                                    <button className="bookmarkBtn" onClick={()=>{handleComments(post)}}>
                                                        <span className="IconContainer">
                                                            <svg
                                                                fill="white"
                                                                height="1em"
                                                                viewBox="0 0 512 512"
                                                            >
                                                                <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" />
                                                            </svg>
                                                        </span>
                                                        <p className="text">
                                                            Comment
                                                        </p>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )
                            })
                        }
                        <h1 className="text-center fw-bolder my-4">
                            You have watched all posts ✅
                        </h1>
                    </>
            }
        </main>
    )
}
