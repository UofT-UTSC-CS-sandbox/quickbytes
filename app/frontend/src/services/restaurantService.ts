import { User } from "firebase/auth"
import { MenuCategory } from "../model/Menu"
import { useQueryEndpoint, createGet } from "./base"

/**
 * Response body for getMenu request
 */
type RestaurantMenuResponse = {
    data: {
        name: string,
        description: string
        address: string,
        categories: MenuCategory[]
    }
}

/**
 * All API endpoints related to retrieving and updating information related
 * to restaurants and their menus.
 */
export default {
    /**
     * Get the basic details of a restaurant including the entire menu.
     * @param restaurantId The ID of the restaurant to get the menu for.
     * @param currentUser The current firebase user that is signed in.
     * @returns Service endpoint to get restaurant information and its menu.
     */
    getMenu: (restaurantId: string | undefined, currentUser: User | null) => 
        useQueryEndpoint<RestaurantMenuResponse>(
            {
                queryKey: ['getMenu', restaurantId],
                queryFn: createGet({
                    inputUrl: `restaurants/${restaurantId}`, 
                    useAuth: false,
                    currentUser: currentUser
                }),
            }
        ),
}