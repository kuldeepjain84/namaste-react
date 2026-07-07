import CardContainer from "./RestaurantCard";
import { useState, useEffect } from "react";
import Shimmer from "./Shimmer";

const Body = () => {

    const [listOfRestaurants, setListOfRestaurants] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const data = await fetch("https://www.swiggy.com/dapi/restaurants/list/v5?lat=23.02760&lng=72.58710&collection=83633&tags=layout_CCS_NorthIndian&sortBy=&filters=&type=rcv2&offset=0&page_type=null");

        const json = await data.json();
       
        const restaurants = json.data.cards
        .filter(item => item?.card?.card?.info)
        .map(item => item.card.card.info);
        //console.log(restaurants);
        setListOfRestaurants(restaurants);
    }
    if(listOfRestaurants.length === 0){
        // run shimmer for fake cards for better ux
        return <Shimmer />;
    }
    return (
        <div className="body">
            <div className="filter">
                <button className="filter-btn">Top Rated Restaurants</button>
            </div>
            <div className="res-container">
                {
                    listOfRestaurants.map((restaurant) => (
                        <CardContainer key={restaurant.id} resData={restaurant}/>
                ))}
                

            </div>
        </div>
    );
}

export default Body;