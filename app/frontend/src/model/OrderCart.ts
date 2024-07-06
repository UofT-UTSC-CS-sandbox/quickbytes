import OrderStatus from "./OrderStatus"

export type CartItem = {
    // The identifier of the item within the database, which is actually just the name of the item for now
    menuItemId: string
    // The option selected for the item. Just the value of the option
    optionSelected: string
    // The addons selected for the item. The key is the addon name and the value is the selected option for that addon.
    addOnsSelected: Record<string, string>
    // The quantity of the item
    quantity: number
    // The price of the item, including the option selected and the addons
    price: number
}

export type OrderCart = {
    // The identifier of the order within the database
    id: string,
    // The restaurant ID that the order is for
    restaurantId: string,
    // Items in the order, each indexed by their unique key in the database
    items: Record<string, CartItem>,
    // Total price for the order
    price: number,
    // Current status of the order
    status: OrderStatus,
}