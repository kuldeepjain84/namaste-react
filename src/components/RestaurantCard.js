import { CDN_URL } from "../utils/constants";

const CardContainer = ({resData}) => {
    
    return (
        <div className="res-card" style={{ backgroundColor: "#f0f0f0" }}>
            <img className="res-logo" alt="dominoz" src={ CDN_URL + resData?.cloudinaryImageId} />
            <h3>{resData?.name}</h3>
            <h4>{resData?.locality}</h4>
            <h4>{resData?.avgRating} stars</h4>
            <h4>{resData?.sla?.deliveryTime} minutes</h4>
        </div>
    );
}

export default CardContainer;