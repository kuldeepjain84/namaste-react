import { MENU_URL } from "../utils/constants";
import { useState, useEffect } from "react";

const useMenuCard = (resId) => {
    const [menuItem, setMenuItem] = useState(null);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        const targetUrl = MENU_URL + resId;
        const response = await fetch(targetUrl);
        const json = response.json();
        setMenuItem(json?.data);
    }
}

export default useMenuCard;