// import CardContainer from "./RestaurantCard";
// import { useState, useEffect } from "react";
// import Shimmer from "./Shimmer";

// const Body = () => {

//     const [listOfRestaurants, setListOfRestaurants] = useState([]);
//     const [filteredRestro, setFilteredRestro] = useState([]);
//     const [searchTxt, setSearchTxt] = useState("");
//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {
//         const data = await fetch("https://www.swiggy.com/dapi/restaurants/list/v5?lat=23.02760&lng=72.58710&collection=83633&tags=layout_CCS_NorthIndian&sortBy=&filters=&type=rcv2&offset=0&page_type=null");

//         const json = await data.json();
       
//         const restaurants = json.data.cards
//         .filter(item => item?.card?.card?.info)
//         .map(item => item.card.card.info);
//         //console.log(restaurants);
//         setListOfRestaurants(restaurants);
//         setFilteredRestro(restaurants);
//     }
//     if(listOfRestaurants.length === 0){
//         // run shimmer for fake cards for better ux
//         return <Shimmer />;
//     }
//     return (
//         <div className="body">
//             <div className="search-container">
//                 <input type="text" className="search" value={searchTxt} onChange={(e) => {
//                     setSearchTxt(e.target.value);
//                 }}/>
//                 <button className="search-btn" onClick={() => {
//                     const filteredRestroRes = listOfRestaurants.filter((res) => (
//                         res.name.toLowerCase().includes(searchTxt.toLocaleLowerCase())
//                     ))
//                     setFilteredRestro(filteredRestroRes);
//                 }}>search</button>
//             </div>
//             <div className="filter">
//                 <button className="filter-btn">Top Rated Restaurants</button>
//             </div>
//             <div className="res-container">
//                 {
//                     filteredRestro.map((restaurant) => (
//                         <CardContainer key={restaurant.id} resData={restaurant}/>
//                 ))}
                

//             </div>
//         </div>
//     );
// }

// export default Body;

import CardContainer from "./RestaurantCard";
import { useState, useEffect, useRef, useCallback } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router";
import useOnline from "../utils/useOnline";

const Body = () => {
    const [listOfRestaurants, setListOfRestaurants] = useState([]);
    const [filteredRestro, setFilteredRestro] = useState([]);
    const [searchTxt, setSearchTxt] = useState("");
    
    // Tracks Swiggy's variable encoded string offset cursor
    const [nextOffsetToken, setNextOffsetToken] = useState(""); 
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const observerRef = useRef();

    // Run initial fetch on component mount
    useEffect(() => {
        fetchInitialData();
    }, []);

    const onlineStatus = useOnline();
    
    const fetchInitialData = async () => {
        try {
            const response = await fetch(
                "https://corsproxy.io/https://www.swiggy.com/dapi/restaurants/list/v5?lat=23.02760&lng=72.58710&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
            );
            const json = await response.json();
           
            // const restaurants = json?.data?.cards
            //     ?.filter(item => item?.card?.card?.gridElements?.infoWithStyle?.restaurants)
            //     ?.map(item => item.card.card.gridElements.infoWithStyle.restaurants) || [];
            const restaurants = json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants;

            // Extract Swiggy's generated initial offset string token
            const initialToken = json?.data?.pageOffset?.nextOffset || "";
            

            console.log(json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
            setListOfRestaurants(restaurants);
            setFilteredRestro(restaurants);
            setNextOffsetToken(initialToken);
            
            if (!initialToken) setHasMore(false);
        } catch (error) {
            console.error("Initial load extraction error:", error);
        }
    };

    // The function that calls Swiggy's POST update endpoint on scroll
    const fetchMoreRestaurants = useCallback(async (currentToken) => {
        if (loadingMore || !hasMore || !currentToken) return;

        setLoadingMore(true);
        console.log("%c -> FETCHING NEXT PAGE WITH TOKEN: " + currentToken, "background: #222; color: #bada55; font-size: 14px;");

        try {
            const response = await fetch("https://corsproxy.io/https://www.swiggy.com/dapi/restaurants/list/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({"lat":"23.02760","lng":"72.58710","nextOffset":"CJhlELQ4KIC4u/ew0q6WHTCnEzgC","widgetOffset":{"NewListingView_category_bar_chicletranking_TwoRows":"","NewListingView_category_bar_chicletranking_TwoRows_Rendition":"","Restaurant_Group_WebView_SEO_PB_Theme":"","collectionV5RestaurantListWidget_SimRestoRelevance_food_seo":"9","inlineFacetFilter":"","restaurantCountWidget":""},"filters":{},"seoParams":{"seoUrl":"https://www.swiggy.com/restaurants","pageType":"FOOD_HOMEPAGE","apiName":"FoodHomePage","businessLine":"FOOD"},"page_type":"DESKTOP_WEB_LISTING","_csrf":"pHHcopZz5GAh-Um6oJVQJ51LyKKXHPNuE5vJNUgk"}),
            });

            if (response.status === 202 || !response.ok) {
                console.warn(`Server status returned ${response.status}. Continuous scroll suspended.`);
                setHasMore(false);
                return;
            }

            const responseText = await response.text();
            if (!responseText || responseText.trim() === "") {
                setHasMore(false);
                return;
            }

            const json = JSON.parse(responseText);
            
            // Extract updated array rows inside Swiggy's payload nested structure
            const newRestaurants = json?.data?.cards
                ?.filter(item => item?.card?.card?.info)
                ?.map(item => item.card.card.info) || [];

            // Grab the next sequential loop identifier string token
            const fallbackNextToken = json?.data?.nextOffset || "";

            if (newRestaurants.length > 0) {
                setListOfRestaurants((prev) => [...prev, ...newRestaurants]);
                setFilteredRestro((prev) => [...prev, ...newRestaurants]);
                setNextOffsetToken(fallbackNextToken); // Save new token for the next scroll action
                setHasMore(!!fallbackNextToken);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Scroll update tracking fault:", error);
            setHasMore(false);
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore, hasMore]);

    // Intersection observer effect to track page bottom threshold crossing events
    useEffect(() => {
        // Guard checking if data hasn't loaded yet
        if (listOfRestaurants.length === 0) return;

        const target = observerRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && nextOffsetToken) {
                    fetchMoreRestaurants(nextOffsetToken);
                }
            },
            { threshold: 0, rootMargin: "100px" } // Pre-fetches 100px before user reaches the exact screen edge
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [fetchMoreRestaurants, nextOffsetToken, hasMore, loadingMore, listOfRestaurants.length]);

    // Handle client/global lookups via search button
    const handleGlobalSearch = () => {
        if (!searchTxt.trim()) {
            setFilteredRestro(listOfRestaurants);
            return;
        }
        const locallyFiltered = listOfRestaurants.filter((res) =>
            res.info.name.toLowerCase().includes(searchTxt.toLowerCase())
        );
        setFilteredRestro(locallyFiltered);
    };
    if(onlineStatus === false) return <h1>No internet connection, please check your internet connection</h1>;
    return (
        <div className="body">
            <div className="search-container">
                <input 
                    type="text" 
                    className="search" 
                    value={searchTxt} 
                    onChange={(e) => setSearchTxt(e.target.value)}
                    placeholder="Search visible restaurants..."
                />
                <button className="search-btn" onClick={handleGlobalSearch}>search</button>
            </div>
            
            <div className="filter">
                <button className="filter-btn">Top Rated Restaurants</button>
            </div>
            
            {/* Show initial Shimmer inside the list box frame directly to preserve DOM stability */}
            {listOfRestaurants.length === 0 ? (
                <Shimmer />
            ) : (
                <div className="res-container">
                    {filteredRestro.map((restaurant) => (
                        <Link to={"/restaurant/"+restaurant.info.id} key={restaurant.info.id}><CardContainer resData={restaurant.info}/></Link>
                    ))}
                </div>
            )}

            {/* Permanent tracker div element layout placeholder */}
            <div ref={observerRef} style={{ height: "60px", margin: "20px 0", clear: "both" }}>
                {loadingMore && <p style={{ textAlign: "center" }}>Loading more restaurants from Swiggy stream...</p>}
                {!hasMore && listOfRestaurants.length > 0 && <p style={{ textAlign: "center" }}>All records downloaded.</p>}
            </div>
        </div>
    );
};

export default Body;