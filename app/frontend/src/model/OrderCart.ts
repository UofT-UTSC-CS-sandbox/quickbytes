export type CartItem = {
    menuItemId: string
    optionSelected: string
    addOnsSelected: Record<string, string>
    quantity: number
    price: number
}

export type OrderCart = {
    id: number,
    restaurantId: string,
    items: Record<string, CartItem>,
    price: number,
    status: string,
}