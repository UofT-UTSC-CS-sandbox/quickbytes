import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import MenuItemCard from "../components/MenuItemCard";
import { useEffect, useState } from "react";
import styles from './Menu.module.css'
import { MenuCategory, MenuItem } from "../model/Menu";
import MenuAdd from "../components/MenuAdd";
import { OrderCart } from "../model/OrderCart";
import { ListItem, Dialog, Stack, Tab, Tabs, Typography, Divider, Paper } from "@mui/material";
import CheckoutCart from "../components/CheckoutCart";
import { Place } from "@mui/icons-material";
import { apiUrl } from "../components/APIUrl";

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
        queryFn: () => fetch(`${apiUrl}/restaurants/${id}`).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                Promise.reject(res);
            }
        }),
    });
    const [category, setCategory] = useState<MenuCategory | null>(null);
    const [item, setItem] = useState<MenuItem | null>(null);
    const [order, setOrder] = useState<OrderCart | null>(null);
    useEffect(() => {
        // On first load, check if the user has any existing order in-progress
        fetch(`${apiUrl}/restaurants/${id}/order`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    Promise.reject(res);
                }
            })
            .then((data) => {
                if (data.data) {
                    const order = {
                        ...data.data,
                        items: data.data.items ?? {},
                        price: data.data.price ?? 0,
                    };
                    setOrder(order);
                } else {
                    setOrder(null);
                }
            })
    }, [])

    useEffect(() => {
        if (data && data.data.categories.length > 0) {
            setCategory(data.data.categories[0]);
        } else {
            setCategory(null);
        }
    }, [data])

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
            <Stack spacing={1} padding={2}>
                <Typography variant='h2' align="left">{name}</Typography>
                <Typography align="left">{description}</Typography>
                <Typography align="left"><Place/> {address}</Typography>
            </Stack>
            <Divider />
            <Stack direction='row' className={styles.menuLayout} padding={2}>
                <Paper sx={{ height: 'min-content' }}>
                    <Tabs value={category?.name || categories[0].name} onChange={handleChange} orientation="vertical">
                        {
                            categories.map((data) =>
                                <Tab
                                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                    label={data.name}
                                    key={data.name}
                                    value={data.name} />
                            )
                        }
                    </Tabs>
                </Paper>
                <Stack className={styles.itemList} padding={0}>
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
                <CheckoutCart order={order} setOrder={setOrder}/>
            </Stack>
            {(item && id) &&
                <Dialog open={!!item} onClose={() => setItem(null)} fullWidth maxWidth="sm">
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

