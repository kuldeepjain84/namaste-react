import React from "react";
import ReactDOM  from "react-dom/client";
/**
 * Heder
 *  - logo
 *  - Nav item
 * Body
 *  - Search
 *  - Restrocontainer
 *      - Restro card
 * Footer
 *  - Copyright
 *  - Links
 *  - Address
 *  - Contact
 */
const Header = () => {
    return (
        <div className="header">
            <div className="logo-container">
                <img className="logo" src="https://www.logodesign.net/logo/car-in-gear-shape-garage-2227ld.png"/>
            </div>
            <div className="nav-items">
                <ul>
                    <li>Home</li>
                    <li>About</li>
                    <li>Contact</li>
                    <li>Cart</li>
                </ul>
            </div>
        </div>
    );
}

const CardContainer = ({resName, cuisine, delivery}) => {
    return (
        <div className="res-card" style={{ backgroundColor: "#f0f0f0" }}>
            <img className="res-logo" alt="dominoz" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/RX_THUMBNAIL/IMAGES/VENDOR/2026/6/15/710864cb-4973-494d-bca3-a14868019568_505182.JPG" />
            <h3>{resName}</h3>
            <h4>{cuisine}</h4>
            <h4>4.5 stars</h4>
            <h4>{delivery} minutes</h4>
        </div>
    );
}

const Body = () => {
    return (
        <div className="body">
            <div className="search">Search
            </div>
            <div className="res-container">
                <CardContainer resName="Domino" cuisine="Cheezy pizza, italian, indian" delivery="30"/>
                <CardContainer resName="Roti wala" cuisine="wheat, makai, pizza bread, india, chinese" delivery="35"/>
            </div>
        </div>
    );
}

const AppLayout = () => {
    return (
        <div id="app">
            <Header />
            <Body />
        </div>
    );
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppLayout />);