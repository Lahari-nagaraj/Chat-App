import React, { useContext } from "react";
import "./LeftSidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore"; // ✅ Import 'where'
import { db } from "../../config/firebase";
import { AppContext } from "../../context/AppContext"; // ✅ Import AppContext

function LeftSidebar() {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext); // ✅ Correct useContext usage

  const inputHandler = async (e) => {
    try {
      const input = e.target.value.trim(); // ✅ Trim whitespace
      if (input === "") return; // ✅ Prevent unnecessary queries

      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", input)); // ✅ Use exact case if Firestore data isn't lowercase
      const querySnap = await getDocs(q);

      if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
        querySnap.docs.forEach((doc) => console.log(doc.data())); // ✅ Log all matching users
      } else {
        console.log("No user found!");
      }
    } catch (error) {
      console.error("Error fetching user:", error); // ✅ Log errors
    }
  };

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
        {Array(12)
          .fill("")
          .map((item, index) => (
            <div key={index} className="friends">
              <img src={assets.profile_img} alt="" />
              <div>
                <p>Richard Sanford</p>
                <span>Hello, How are you?</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default LeftSidebar;



























