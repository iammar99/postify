import React, { useEffect, useCallback, useState } from 'react' // React Components
import { Link } from 'react-router-dom'; // For commponents
// For DB
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { fireStore } from 'Config/firebase';
import Loader from 'Components/DataLoader/Loader' // Loader
import profileImg from "../../Assets/user.png" // For Alternative profile image
import { Space, Input, Button, message } from 'antd'; // For comment input 
import Heart from 'Components/OtherComponents/Heart';
import EditPencil from 'Components/OtherComponents/EditPencil';
import DelBin from 'Components/OtherComponents/DelBin';
import ReactQuill from 'react-quill';
import AddBtn from 'Components/OtherComponents/AddBtn';

export default function Home() {

    const [isLoading, setIsLoading] = useState(false) // For Handling Loading
    const [posts, setPosts] = useState([])  // For Handling Post
    const [expandedPosts, setExpandedPosts] = useState({}); // For Handling length of description
    const [commentingPosts, setCommentingPosts] = useState({}); // For Handling Display of comment
    const [comment, setComment] = useState(null); // For Handling  comment
    const [isEditing, setIsEditing] = useState(false); // For editing  comment
    const [currentUser, setCurrentUser] = useState(null); // For Handling current user
    let newDate = new Date()

    //   Fetching Data from DB

    const fetchData = useCallback(async () => {
        let array = []
        setIsLoading(true)
        const querySnapshot = await getDocs(collection(fireStore, "Posts"));
        querySnapshot.forEach((doc) => {
            let data = doc.data()
            array.push(data)
            setIsLoading(false)
        });
        setPosts(array)
    }, [])

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem("user")))
        fetchData()
    }, [fetchData])


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
    const handleLengthToggle = (postId) => {
        setExpandedPosts((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));
    };

    // For handling comment ID

    function generateRandomString() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < 7; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }

        return result;
    }


    // For handling Post Comments (specific to each post)


    const handleCommentsToggle = (postId) => {
        if(!currentUser){
            message.warning("Log In to comment")
            return
        }
        setCommentingPosts((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));
        setComment({
            commmentID: generateRandomString(),
            commenterId: currentUser.userId,
            commenterProfile: currentUser.imageUrl || null,
            commenterName: currentUser.username,
            commentDate: new Date().toISOString(),
        })
    };

    const handleComments = async (post) => {

        let postId = post.Postid
        // For adding new comment 
        if (!isEditing) {
            if (Object.keys(currentUser).length === 0) {
                message.warning("Log In to comment")
                console.log(currentUser)
                return
            }
            if (!comment.comment) {
                message.warning("Comment can't be empty")
                return
            }
            setCommentingPosts((prevState) => ({
                ...prevState,
                [postId]: false,
            }));
            if (post.comments) {
                post.comments.push(comment)
            }
            else {
                post.comments = [comment]
            }
        }
        // For editing
        else {
            let index = post.comments.findIndex((cmnt) => cmnt.commmentID === comment.commmentID);
            post.comments[index] = comment;
            let newArr = posts.map((doc) => {
                if (doc.Postid === postId) {
                    return post
                } else {
                    return doc
                }
            })
            setPosts(newArr)
            setComment({})
            setIsEditing(false)
        }
        console.log(post)
        await setDoc(doc(fireStore, "Posts", postId), {
            ...post,
        });
    };

    const handleCommentChange = (e) => {
        setComment(s => ({ ...s, [e.target.name]: e.target.value }))
    }

    //  For handling Comment likes

    const handleCommentLike = async (post, id) => {
        let postId = post.Postid
        let index = post.comments.findIndex((cmnt) => cmnt.commmentID === id);

        if (index !== -1) {
            let cmnt = post.comments[index];

            if (cmnt.likes) {
                cmnt.likes += 1;
            } else {
                cmnt.likes = 1;
            }

            post.comments[index] = cmnt;
        }
        let newArr = posts.map((doc) => {
            if (doc.Postid === postId) {
                return post
            } else {
                return doc
            }
        })
        setPosts(newArr)
        await setDoc(doc(fireStore, "Posts", postId), {
            ...post,
        });
        console.log(post.comments)
    }

    //  For handling Comment Edit

    const handleCommentEdit = (post, id, e) => {
        setIsEditing(true)
        let postId = post.Postid
        let cmnt = post.comments.find((cmnt) => {
            return id === cmnt.commmentID
        })
        setComment(cmnt)
    }


    //  For handling Comment del

    const handleCommentDel = async (post, id) => {
        let postId = post.Postid
        let newcmnts = post.comments.filter((cmnt) => {
            return id !== cmnt.commmentID
        })
        post.comments = newcmnts
        let newArr = posts.map((doc) => {
            if (doc.Postid === postId) {
                return post
            } else {
                return doc
            }
        })
        setPosts(newArr)
        await setDoc(doc(fireStore, "Posts", postId), {
            ...post,
        });
    }


    // function to close comment section on scroll

    // const handleScroll = () => {
    //     setCommentingPosts({})
    // }


    // useEffect(() => {
    //     document.addEventListener('click', handleScroll);
    // }, [])

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
                                // For handling length of description
                                const isExpanded = expandedPosts[post.Postid];
                                // const text = post.text.substring(0, 100) + "...";
                                // const fullText = post.text;
                                const textLimit = 100;
                                const isLongPost = post.text.length > textLimit; // Check if post is long
                                const text = post.text.substring(0, textLimit) + "...";
                                const fullText = post.text;
                                // For handling comment section 
                                const isCommenting = commentingPosts[post.Postid];

                                return (
                                    <div key={i}>
                                        <div className='post-card'>
                                            <div className="post-profile">
                                                <img className='post-profileImg' src={post.createrProfile ? post.createrProfile : profileImg} alt="" />
                                                <b className='ms-2'>
                                                    {post.createrUsername}
                                                </b>
                                            </div>
                                            <p style={{"height":"fit-content"}}>
                                                {/* For controlling length of the post */}
                                                <ReactQuill
                                                    value={isExpanded ? fullText : post.text.substring(0, 100) + '...'}
                                                    readOnly={true} 
                                                    theme="bubble" 
                                                />
                                                {/* {!isExpanded ? text : fullText} */}
                                                {isLongPost && (
                                                    <Link onClick={() => handleLengthToggle(post.Postid)}>
                                                        {!isExpanded ? "Read More" : "Read Less"}
                                                    </Link>
                                                )}
                                            </p>
                                            {
                                                post.imageUrl &&
                                                <div className="img-container">
                                                    <img src={post.imageUrl} alt="" style={{ height: "inherit", margin: "auto", display: "block" }} />
                                                </div>
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
                                            {/* Functions */}
                                            <div className="d-flex justify-content-start function-container">
                                                {/* For like */}
                                                <button className="LikeBtn" onClick={() => handleLikes(post)}>
                                                    <span className="leftContainer">
                                                        <svg fill="white" height="1em" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                                                        </svg>
                                                        <span className="like">
                                                            Like
                                                        </span>
                                                    </span>
                                                    <span className="likeCount">
                                                        {post.likes}
                                                    </span>
                                                </button>
                                                {/* For comment */}
                                                <div className="CommentBtn">
                                                    <button className="bookmarkBtn"  onClick={() => handleCommentsToggle(post.Postid)}>
                                                        <span className="IconContainer">
                                                            <svg fill="white" height="1em" viewBox="0 0 512 512">
                                                                <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" />
                                                            </svg>
                                                        </span>
                                                        <p className="comment-text m-0">
                                                            {
                                                                post.comments == undefined
                                                                    ?
                                                                    "0"
                                                                    :
                                                                    post.comments.length
                                                            }
                                                        </p>
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Comment Input Box */}
                                            {isCommenting && (
                                                <div className="comment-section mt-4">
                                                    {/* Comment input  */}
                                                    <div>
                                                        {/* Input from  Antd  */}
                                                        <Space.Compact
                                                            style={{
                                                                width: '100%',
                                                            }}
                                                        >
                                                            <Input name="comment" placeholder='Comment your thoughts' onChange={handleCommentChange} value={comment.comment} />
                                                            <Button type="primary" onClick={() => handleComments(post)} >{isEditing ? "Confirm" : "Comment"}</Button>
                                                        </Space.Compact>
                                                        <div className="comment-text m-0">
                                                            {
                                                                post.comments == undefined
                                                                    ?
                                                                    null
                                                                    :
                                                                    <>
                                                                        {
                                                                            post.comments.map((comment, i) => {
                                                                                const timePassed = (dateCreated) => {
                                                                                    const currentDate = new Date();
                                                                                    const postDate = new Date(dateCreated);
                                                                                    const diffInMs = currentDate - postDate;

                                                                                    // Convert to various time units
                                                                                    const seconds = Math.floor(diffInMs / 1000);
                                                                                    const minutes = Math.floor(diffInMs / (1000 * 60));
                                                                                    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
                                                                                    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
                                                                                    const weeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));

                                                                                    // Determine the time passed based on the conditions
                                                                                    if (seconds < 60) {
                                                                                        return `${seconds}s `;
                                                                                    } else if (minutes < 60) {
                                                                                        return `${minutes}m `;
                                                                                    } else if (hours < 24) {
                                                                                        return `${hours}h `;
                                                                                    } else if (days < 7) {
                                                                                        return `${days}d `;
                                                                                    } else {
                                                                                        return `${weeks}w `;
                                                                                    }
                                                                                };

                                                                                return (
                                                                                    <div className="comment-box my-3" key={i}>
                                                                                        <div className="d-flex justify-content-between">
                                                                                            <div className="d-flex align-items-center">
                                                                                                <img src={comment.commenterProfile || profileImg} className='commenter-profile' alt="" />
                                                                                                <div className="d-flex flex-column ms-3">
                                                                                                    <div className="d-flex align-items-center">
                                                                                                        <b>{comment.commenterName}</b>
                                                                                                        <div className="date ms-3" style={{ "color": "#9ca4ab", "fontSize": "16px" }}>
                                                                                                            {timePassed(comment.commentDate)}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className='m-0'>{comment.comment}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='d-flex align-items-center'>
                                                                                                {
                                                                                                    currentUser.userId != comment.commenterId
                                                                                                        ?
                                                                                                        <></>
                                                                                                        :
                                                                                                        <>
                                                                                                            <DelBin onClick={() => { handleCommentDel(post, comment.commmentID) }} marginRight="10px" />
                                                                                                            <EditPencil onClick={() => { handleCommentEdit(post, comment.commmentID) }} />
                                                                                                        </>
                                                                                                }
                                                                                                <Heart onClick={() => handleCommentLike(post, comment.commmentID)} />
                                                                                                {comment.likes == undefined ? 0 : comment.likes}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }
                                                                    </>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </>
            }
            <AddBtn/>
        </main>
    )
}
