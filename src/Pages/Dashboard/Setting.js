import React, { useEffect, useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject } from "firebase/storage";
import { fireStore, storage } from 'Config/firebase';
import { doc, setDoc, updateDoc, collection } from "firebase/firestore";
import Spinner from 'Components/Spinner/Spinner';
import { message } from 'antd';



export default function Setting() {

  let user = JSON.parse(localStorage.getItem("user"))



  const [bio, setBio] = useState("")
  const [username, setUsername] = useState("")
  const [file, setFile] = useState(null)
  const [image, setImage] = useState(null)
  const [isProccessing, setIsProccessing] = useState(false)
  // let defaultBio
  let imageUrl
  let userToUpdate = {}
  let userToStore = {}

  console.log(image)

  // useEffect(() => {
  //   document.getElementById("username").value = user.username
  //   if (user.bio) {
  //     document.getElementById("bio").value = user.bio
  //     defaultBio = user.bio;
  //   }
  //   else {
  //     defaultBio = " "
  //     document.getElementById("bio").ariaPlaceholder = "Enter Your Bio"
  //   }
  // }, [])



  const uploadFile = async () => {

    try {
      const desertRef = ref(storage, 'profileImages/profilePic');

      // Delete the file
      deleteObject(desertRef).then(() => {
        // File deleted successfully
      }).catch((error) => {
        // Uh-oh, an error occurred!
      });
    } catch (error) {
      console.log(error)
    }

    const storageRef = ref(storage, 'profileImages/' + "profilePic");

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
            userToUpdate = {
              username: `${username ? username.username : user.username}`,
              bio: `${bio ? bio.bio : user.bio}`,
              imageUrl
            }
            userToStore = {
              ...user,
              ...userToUpdate
            }
            if (imageUrl) {
              setIsProccessing(false)
              message.success("Updated")
            }
            localStorage.setItem("user", JSON.stringify(userToStore))
            const UserRef = doc(fireStore, "Users", user.userId);
            updateDoc(UserRef, userToUpdate);
          } catch (error) {
            localStorage.setItem("user", JSON.stringify(user))
            console.log(error)
          }
        });
      }
    );



  }


  const handleChange = (e) => {
    setFile(e.target.files[0])
    setImage(URL.createObjectURL(e.target.files[0]))
  }

  const handleUsername = (e) => {
    setUsername(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  const handleBio = (e) => {
    setBio(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (file) {
      setIsProccessing(true)
      uploadFile()
    } else {
      try {
        setIsProccessing(true)
        userToUpdate = {
          username: `${username ? username.username : user.username}`,
          bio: `${bio ? bio.bio : user.bio}`,
        }
        userToStore = {
          ...user,
          ...userToUpdate
        }
        localStorage.setItem("user", JSON.stringify(userToStore))
        const UserRef = doc(fireStore, "Users", user.userId);
        updateDoc(UserRef, userToUpdate);
        setIsProccessing(false)
        message.success("Profile Updated")
      } catch (error) {
        localStorage.setItem("user", JSON.stringify(user))
        console.log(error)
      }
    }


  }

  return (
    <main>
      <h1 className="text-center my-5 fw-bold">
        Setting
      </h1>
      <div className="container">
        <div className="row">
          <form className="profile-form">

            {/* Profile Img */}

            <div className="d-flex w-75 justify-content-between align-items-center">
              <div className="d-flex flex-column">
                <label className='my-3' htmlFor="profileImg " style={{ "fontSize": "20px", "fontWeight": "600" }}>
                  Profile Img
                </label>
                <input type="file" id='profileImg' name='profileImg' onChange={handleChange} />
              </div>
              <div className="profile-img-container">
                <img src={image?image:user.imageUrl} style={{ "width": "-webkit-fill-available", "borderRadius": "50%", "height": "130px" }} alt="" />
              </div>
            </div>

            {/* UserName */}

            <label className='my-3' htmlFor="username">
              UserName
            </label>
            <input type="text" className='form-control w-50' onChange={handleUsername} defaultValue={user.username} id='username' name='username' />

            {/* Bio */}

            <label className='my-3' htmlFor="bio">
              Description
            </label>
            <input type="text" className='form-control w-50' onChange={handleBio} defaultValue={user.bio?user.bio:"Enter Your Bio"} id='bio' name='bio' />
            {/* Submit btn */}
            <button className={`submit-button my-5 bg-${isProccessing ? "secondary" : "light"}`} onClick={handleSubmit}>
              <div className="submit m-0 d-flex justify-content-center">
                {
                  isProccessing ?
                    <Spinner /> :
                    "Update"
                }
              </div>
            </button> 
          </form>
        </div>
      </div>
    </main>
  )
}
