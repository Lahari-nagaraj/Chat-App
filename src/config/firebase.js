
import { initializeApp } from "firebase/app";
import {createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {getFirestore, setDoc, doc, getDocs,collection, query, where} from "firebase/firestore";
import { ToastContainer,toast } from "react-toastify";


const firebaseConfig = {
  apiKey: "AIzaSyCq0DE9iOgJyVb7WGYLXy_488wnpxVdckI",
  authDomain: "chat-app-23b42.firebaseapp.com",
  projectId: "chat-app-23b42",
  storageBucket: "chat-app-23b42.firebasestorage.app",
  messagingSenderId: "749445895428",
  appId: "1:749445895428:web:63f3ea801cf064a05b6c51"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username,email,password) => {
    try{
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey, There i am using Chat app",
            lastSeen:Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatsData:[]
        })
    }catch(error){
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "))
    }
}

const login = async (email,password) => {
    try{
        await signInWithEmailAndPassword(auth,email,password);

    }catch(error){
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async () => {
    try{
        await signOut(auth)
    }catch(error){
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const resetPass = async(email)=>{
    if(!email){
        toast.error("Enter your email");
        return null;
    }
    try{
        const userRef = collection(db,"users");
        const q = query(userRef,where("email","==",email));
        const querySnap = await getDocs(q);
        if(!querySnap.empty){
            await sendPasswordResetEmail(auth,email);
            toast.success("Reset Email Sent");
        }else{
            toast.error("Email doesnt exists")
        }
    }catch(error){
        console.error(error);
        toast.error(error.message)
    }
}

export {signup, login, logout, auth, db,resetPass}