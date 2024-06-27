import { MenuCategory } from "../model/Menu"
import { useGetEndpoint } from "./base"

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
    getMenu: (restaurantId: string | undefined) => 
        useGetEndpoint<RestaurantMenuResponse>(
            {
                inputUrl: `restaurants/${restaurantId}`, 
                useAuth: false,
            },
            {
                queryKey: ['getMenu', restaurantId],
            }
        ),
}