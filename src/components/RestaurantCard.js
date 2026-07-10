import { CDN_URL } from "../utils/constants";

const CardContainer = ({resData}) => {
    const {name, locality, avgRating, sla, cloudinaryImageId} = resData;

    return (
        <div className="res-card" style={{ backgroundColor: "#f0f0f0" }}>
            <img className="res-logo" alt="dominoz" src={ CDN_URL + cloudinaryImageId} />
            <h3>{name}</h3>
            <h4>{locality}</h4>
            <h4>{avgRating} stars</h4>
            <h4>{sla?.deliveryTime} minutes</h4>
        </div>
    );
}

export default CardContainer;