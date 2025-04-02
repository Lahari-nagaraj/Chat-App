import React, { useContext, useState } from "react";
import "./LeftSidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"; // ✅ Import 'where'
import { db } from "../../config/firebase";
import { AppContext } from "../../context/AppContext"; // ✅ Import AppContext
import { toast } from "react-toastify";

function LeftSidebar() {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext); // ✅ Correct useContext usage
  const [user,setUser] = useState(null);
  const [showSearch,setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value.trim(); // ✅ Trim whitespace
      if (input){
        setShowSearch(true);
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", input)); // ✅ Use exact case if Firestore data isn't lowercase
      const querySnap = await getDocs(q);

      if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
        setUser(querySnap.docs[0].data());
      }else{
        setUser(null);
      }
     }else{
        setShowSearch(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error); // ✅ Log errors
    }
  };

  const addChat = async () => {
    const messageRef = collection(db,"messages");
    const chatsRef = collection(db,"chats");
    try{
      const newMessageRef = doc(messageRef);
      await setDoc(newMessageRef,{
        createAt:serverTimestamp(),
        messages:[]
      })
      await updateDoc(doc(chatsRef,userData.id)),{
        chatsData:arrayUnion({
          messageId: newMessageRef.id,
          lastMessage:"",
          rId:user.id,
          updatedAt:Date.now(),
          messageSeen:true
        })
      }
    }catch(error){
      toast.error(error.message);
      console.log(error) 
    }
  }

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="" className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here..."
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-user">
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
          </div>
        ) : (
          Array(12)
            .fill("")
            .map((item, index) => (
              <div key={index} className="friends">
                <img src={assets.profile_img} alt="" />
                <div>
                  <p>Richard Sanford</p>
                  <span>Hello, How are you?</span>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default LeftSidebar;



























