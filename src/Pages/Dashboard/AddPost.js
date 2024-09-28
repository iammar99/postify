import React, { useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject } from "firebase/storage";
import { fireStore, storage } from 'Config/firebase';
import { doc, setDoc, updateDoc, collection } from "firebase/firestore";
import { message } from 'antd';
import Spinner from 'Components/Spinner/Spinner';


export default function AddPost() {

  const user = JSON.parse(localStorage.getItem("user"))


  const [text, setText] = useState("")
  const [image, setImage] = useState(null)
  const [file, setFile] = useState(null)
  const [isProccessing, setIsProccessing] = useState(false)

  let post = {}
  let imageUrl

  // Date

  let month = new Date().getMonth()
  let day = new Date().getDate()
  let year = new Date().getFullYear()
  switch (month) {
    case 0:
      month = "January"
      break
    case 1:
      month = "February"
      break
    case 2:
      month = "March"
      break
    case 3:
      month = "April"
      break
    case 4:
      month = "May"
      break
    case 5:
      month = "June"
      break
    case 6:
      month = "July"
      break
    case 7:
      month = "August"
      break
    case 8:
      month = "September"
      break
    case 9:
      month = "October"
      break
    case 10:
      month = "November"
      break
    case 11:
      month = "Decenber"
      break
  }
  let today = `${day} ${month} ${year}`

  // Id
  let Postid = Math.random().toString()
  Postid = Postid.slice(2)

  const handleChange = (e) => { setText(s => ({ ...s, [e.target.name]: e.target.value })) }

  const handleFile = (e) => {
    setFile(e.target.files[0])
    setImage(URL.createObjectURL(e.target.files[0]))
  }


  const uploadFile = async () => {


    const storageRef = ref(storage, 'postImages/' + file.name);

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            // console.log('Upload is paused');
            break;
          case 'running':
            // console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          imageUrl = downloadURL
          try {
            post = {
              createrID: user.userId,
              createrUsername: user.username,
              createrProfile: user.imageUrl,
              dateCreated: today,
              text: text.post,
              imageUrl,
              Postid,
              likes: 0
            }
            if (imageUrl) {
              setIsProccessing(false)
              message.success("Posted")
            }
            setDoc(doc(fireStore, "Posts", Postid), post);
          } catch (error) {
            console.log(error)
          }
        });
      }
    );



  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text) {
      message.warning("Empty Post!!!!")
    }
    else {
      if (file) {
        setIsProccessing(true)
        uploadFile()
      }
      else {
        setIsProccessing(true)
        post = {
          createrID: user.userId,
          createrUsername: user.username,
          createrProfile: user.imageUrl,
          dateCreated: today,
          text: text.post,
          Postid,
          likes: 0
        }
        await setDoc(doc(fireStore, "Posts", Postid), post);
        setIsProccessing(false)
        message.success("Posted")
      }
    }
  }

  const handleFocus = () => {
    document.getElementById("postTextarea").style.outline = "black"
  }

  return (
    <main>
      <h1 className="text-center my-5 fw-bolder">
        Convert Your Thoughts in to Post
      </h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col  my-5 d-flex justify-content-between flex-column align-items-center">
            <textarea name="post" onFocus={handleFocus} onChange={handleChange} id="postTextarea" style={{ "resize": "none" }} className='post-box' placeholder='Enter Your Thoughts'>
            </textarea>

            {/* uiVerse file input template */}
            <div className="filecontainer d-flex flex-column  align-items-center justify-content-evenly align-items-sm-end  flex-sm-row " style={{ "width": "38%" }}>
              <label htmlFor="file" className="custum-file-upload mt-5">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" fill=""></path> </g></svg>
                </div>
                <p className=' text-white' style={{ "fontSize": "11px" }}>Click here to Upload Image</p>
                <input id="file" type="file" onChange={handleFile} />
              </label>
              {image
                ?
                <img src={image} alt="" className='w-100' style={{ "height": "200px" }} />
                :
                <video src=""></video>
              }
            </div>
            {/* Submit btn */}
            <button className={`submit-button my-5 bg-${isProccessing ? "secondary" : "light"}`} onClick={handleSubmit}>
              <div className="submit m-0 d-flex justify-content-center">
                {
                  isProccessing ?
                    <Spinner /> :
                    "Posts"
                }
              </div>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
