import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import MenuItemCard from "../components/MenuItemCard";
import { useState } from "react";
import styles from './Menu.module.css'
import { MenuCategory, MenuItem } from "../model/Menu";
import MenuAdd from "../components/MenuAdd";
import { OrderCart } from "../model/OrderCart";
import { Box, ListItem, Dialog, Stack, Tab, Tabs, Typography } from "@mui/material";

type RestaurantMenuParams = {
    id: string
}

type RestaurantMenuResponse = {
    data: {
        name: string,
        description: string
        address: string,
        categories: MenuCategory[]
    }
}

const RestaurantMenu = () => {
    const { id } = useParams<RestaurantMenuParams>();
    const { data, isLoading, isError } = useQuery<RestaurantMenuResponse>({
        queryKey: ['menu', id],
        queryFn: () => fetch(`http://localhost:3000/restaurants/${id}`).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                Promise.reject(res);
            }
        })
    });
    const [category, setCategory] = useState<MenuCategory | null>(null);
    const [item, setItem] = useState<MenuItem | null>(null);
    const [order, setOrder] = useState<OrderCart | null>(null);

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError || !data) {
        return <div>Sorry, we could not find the menu for this restaurant. Please try again later.</div>
    }

    const { data: { name, categories, description, address } } = data;

    const handleChange = (event: React.SyntheticEvent, newCategory: string) => {
        const newCategoryObj = categories.find(data => data.name === newCategory);
        setCategory(newCategoryObj || (categories.length > 0 ? categories[0] : null));
    };

    const onClickItem = (itemName: string) => {
        setItem(category?.options.find(data => data.name === itemName) || null);
    }

    return (
        <div className={styles.menuContainer}>
            <Typography variant='h2'>{name}</Typography>
            <Typography>{description}</Typography>
            <Typography>{address}</Typography>
            <div className={styles.menuLayout}>
                <Box>
                    <Tabs value={category?.name || categories[0].name} onChange={handleChange} orientation="vertical">
                        {
                            categories.map((data) => <Tab label={data.name} key={data.name} value={data.name} />)
                        }
                    </Tabs>
                </Box>
                <Stack className={styles.itemList}>
                    {
                        category ?
                            category.options.map((menuItem) =>
                                <ListItem key={menuItem.name}>
                                    <MenuItemCard onClick={onClickItem} data={menuItem} />
                                </ListItem>)
                            :
                            <Typography>Choose a menu category to start browsing.</Typography>
                    }
                </Stack>
                {/* {
                    order &&
                    <div>
                        {
                            Object.entries(order.items).map(([key, value]) => <CheckoutItem data={value} key={key} />)
                        }
                    </div>
                } */}

            </div>
            {(item && id) &&
                <Dialog open={!!item} onClose={() => setOrder(null)}>
                    <MenuAdd data={item}
                        close={() => setItem(null)}
                        order={order}
                        setOrder={setOrder}
                        restaurantId={id}
                    />
                </Dialog>
            }
        </div>
    )
}

export default RestaurantMenu;

