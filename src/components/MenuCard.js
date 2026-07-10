import { MENU_URL } from "../utils/constants";
import { useState, useEffect } from "react";
import Shimmer from "./Shimmer";

const MenuCard = () => {
    const [menuItem, setMenuItem] = useState(null);
    // Run initial fetch on component mount
    useEffect(() => {
        fetchMenu();
    }, []);

    // const fetchMenu = async () => {
    //         console.log("called")
    //         const data = await fetch(
    //             "https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=23.02760&lng=72.58710&restaurantId=505182&catalog_qa=undefined&submitAction=ENTER"
    //         );
    //          console.log('innnnn');
    //         const json = await data.json();
    //         console.log('innnnn1');
    //         //const menu = json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants;
    //         console.log(json);
    //         setMenuItem(json);
        
    // };
    const fetchMenu = async () => {
    try {
        const targetUrl = "https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=23.02760&lng=72.58710&restaurantId=505182&catalog_qa=undefined&submitAction=ENTER";
        
        const response = await fetch(targetUrl, {
            headers: {
                // Mimics a real browser to prevent Swiggy from blocking the proxy request
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });

        // If the server returns an error code (403, 404, 500, etc.)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const textData = await response.text(); // 1. Read raw text first
        
        if (!textData) {
            throw new Error("Received an empty response from the proxy server.");
        }

        const json = JSON.parse(textData); // 2. Safe parse
        console.log("Swiggy Data Loaded:", json);
        setMenuItem(json);

    } catch (error) {
        console.log("Fetch Menu Error:", error.message);
        // Handle error state gracefully here (e.g., set an error flag to show a UI message)
    }
};

    if(!menuItem) return <Shimmer />;

    const {name, cuisines}  = menuItem?.cards[0].card?.card?.info;

    return (
        <div className="menu-page">
            <h1>{name}</h1>
            <h2>{cuisines.join(", ")}</h2>
            <ul>
                <li>Lemon rice</li>
                <li>Pizza</li>
                <li>Pasta</li>
            </ul>
        </div>
    )
}

export default MenuCard;