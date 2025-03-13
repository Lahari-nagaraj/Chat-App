import React, { useEffect, useState } from 'react'
import "./ProfileUpdate.css"
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth';
import { doc ,getDoc} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

const ProfileUpdate = () => {

  const navigate = useNavigate(); 
  const [image,setImage] = useState(false);
  const [name,setName] = useState("");
  const [bio, setBio] = useState("");
  const [ui,setUid] = useState("");
  const [prevImage,setPrevImage] = useState("");

  useEffect(() =>{
    onAuthStateChanged(auth,async (user)=>{
      if(user){
        setUid(user.uid)
        const docRef = doc(db,"users",user.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.data().name){
          setName(docSnap.data().name);
        }
         if(docSnap.data().bio){
          setName(docSnap.data().bio);
      }
       if(docSnap.data().avatar){
          setPrevImage(docSnap.data().avatar)
  }
  else{
    navigate('/')
  }
  }})
  },[])


  return (
    <div className='profile'>
      <div className="profile-container">
        <form action="">
          <h3>Profile details</h3>
          <label htmlFor="avatar">
            <input onChange={(e)=>setImage(e.target.files[0])}type="file" id="avatar" accept='.png, .jpg, .jpeg' hidden/>
            <img src={image? URL.createObjectURL(image): assets.avatar_icon} alt="" />
            upload profile image
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Your Name' required />
          <textarea onChange={(e) => setBio(e.target.bio)} value={bio} placeholder='Write profile bio' required></textarea>
          <button type="submit">Save</button>
        </form>
        <img  className='profile-pic' src={image? URL.createObjectURL(image) : assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate