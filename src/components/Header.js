import { useState } from "react";
import { LOGO_URL } from "../utils/constants";
import { Link } from "react-router";
import useOnline from "../utils/useOnline";

const Header = () => {
    const [btnName, setBtnName] = useState("Login");
    const onlineStatus = useOnline();
    console.log(onlineStatus);
    return (
        <div className="header">
            <div className="logo-container">
                <img className="logo" src={LOGO_URL}/>
            </div>
            <div className="nav-items">
                <ul>
                    <li>Online status: {onlineStatus ? "✅" : "👅" }</li>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="about">About</Link></li>
                    <li><Link to="contact">Contact</Link></li>
                    <li><Link to="grocery">Grocery</Link></li>
                    <li>Cart</li>
                    <li><button className="login-btn" onClick={() =>{
                        btnName === 'Login' ? setBtnName("Logout") : setBtnName("Login") 
                    }}>{btnName}</button></li>
                </ul>
            </div>
        </div>
    );
}

export default Header;