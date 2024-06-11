export type CartItem = {
    menuItemId: string
    optionSelected: string
    addOnsSelected: Record<string, string>
    quantity: number
}

export type OrderCart = {
    id: number,
    restaurant: string,
    items: Record<string, CartItem>,
}