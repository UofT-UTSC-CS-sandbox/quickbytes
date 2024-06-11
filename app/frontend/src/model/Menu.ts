export type MenuCategory = {
    name: string,
    options: MenuItem[]
}

// The option for a menu item that decides the base price.
// E.g. Large, Medium or Small Pizza
// If only one option is provided, it will be used as the base price
export type MenuItemOption = {
    name: string;
    price: number;
}

// Option to add special instructions or add-ons for a menu item.
// E.g. Extra topping on pizza
export type MenuItemAddOn = {
    name: string;
    additionalPrice: number;
}

export type MenuItemAddOnSet = {
    name: string;
    addOns: MenuItemAddOn[]
}

export type MenuItem = {
    name: string;
    options: MenuItemOption[];
    addOns: MenuItemAddOnSet[];
    price?: number;
    description?: string;
}