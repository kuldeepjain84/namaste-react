
import { useParams } from "react-router";
import useMenuCard from "../utils/useMenuCard";
import Shimmer from "./Shimmer";

const MenuCard = () => {
    const resId = useParams();
    const menuItem = useMenuCard(resId);
    // Run initial fetch on component mount
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