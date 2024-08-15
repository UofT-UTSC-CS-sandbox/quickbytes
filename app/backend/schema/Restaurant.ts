export type MenuItemOption = {
    name: string;
    price: number;
}

export type MenuItem = {
    name: string;
    options: MenuItemOption[];
    addOns: AddOn[];
};

export type AddOn = {
    name: string,
    addOns: AddOnOption[]
}

export type AddOnOption = {
    name: string;
    additionalPrice: number;
}

export type Category = {
    name: string;
    options: MenuItem[];
};

export type Restaurant = {
    activeOrders: false | Record<string, true>;
    historicalOrders: false | Record<string, true>;
    information: {
        name: string;
        description: string;
        address: string;
        coordinateX: number;
        coordinateY: number;
        categories: Category[];
        location: any;
    };
}