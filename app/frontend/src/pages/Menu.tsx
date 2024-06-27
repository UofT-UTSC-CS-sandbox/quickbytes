import { useParams } from "react-router-dom";
import MenuItemCard from "../components/MenuItemCard";
import { useEffect, useState } from "react";
import styles from './Menu.module.css'
import { MenuCategory, MenuItem } from "../model/Menu";
import MenuAdd from "../components/MenuAdd";
import { OrderCart } from "../model/OrderCart";
import { ListItem, Dialog, Stack, Tab, Tabs, Typography, Divider, CircularProgress, Snackbar, Alert } from "@mui/material";
import CheckoutCart from "../components/CheckoutCart";
import { Place } from "@mui/icons-material";
import MenuCategoryDrawer from "../components/MenuCategoryDrawer";
import NavBar from "../components/Navbar";
import orderService from "../services/orderService";
import restaurantService from "../services/restaurantService";

type RestaurantMenuParams = {
    id: string
}

const RestaurantMenu = () => {
    const { id } = useParams<RestaurantMenuParams>();
    const { data, isLoading, isError: isMenuError, error: menuError } = restaurantService.getMenu(id).useQuery();
    const [displayError, setDisplayError] = useState<string | null>(null);
    const [category, setCategory] = useState<MenuCategory | null>(null);
    const [item, setItem] = useState<MenuItem | null>(null);
    const [order, setOrder] = useState<OrderCart | null>(null);

    // Fetch the any in-progress orders that the user has with the restaurant
    // that haven't been placed yet.
    const { data: activeOrder, isError: isActiveOrderError, error: activeOrderError } = orderService.getClientActiveOrder(id).useQuery();
    useEffect(() => {
        if (activeOrder?.data && !isActiveOrderError && id) {
            setOrder({
                ...activeOrder.data,
                restaurantId: id,
                items: activeOrder.data.items ?? {},
                price: activeOrder.data.price ?? 0,
            });
        } else {
            setOrder(null);
        }
    }, [activeOrder, isActiveOrderError])

    useEffect(() => {
        if (data && data.data.categories.length > 0) {
            setCategory(data.data.categories[0]);
        } else {
            setCategory(null);
        }
    }, [data])

    useEffect(() => {
        if (isActiveOrderError) setDisplayError(activeOrderError.message);
        else if (isMenuError) setDisplayError(menuError.message);
        else setDisplayError(null);
    }, [isActiveOrderError, isMenuError])

    const renderRequestSnackbar = displayError ?
        <Snackbar open={isActiveOrderError} onClose={() => setDisplayError(null)} autoHideDuration={3000}>
            <Alert severity="error">{displayError}</Alert>
        </Snackbar> : null;

    if (isLoading) {
        return <div>
            <NavBar />
            <CircularProgress/> <Typography>Loading ...</Typography>
            {renderRequestSnackbar}
        </div>
    }

    if (isMenuError || !data) {
        return <div>
            <NavBar />
            <Typography>Sorry, we could not find the menu for this restaurant. Please try again later.</Typography>
            {renderRequestSnackbar}
        </div>
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
            <NavBar/>
            <Stack spacing={1} padding={2}>
                <Typography variant='h2' align="left">{name}</Typography>
                <Typography align="left">{description}</Typography>
                <Typography align="left"><Place/> {address}</Typography>
            </Stack>
            <Divider />
            <Stack direction={{ xs: 'column', sm: 'row' }} className={styles.menuLayout} padding={2}>
                <MenuCategoryDrawer category={category} categories={categories}>
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
                </MenuCategoryDrawer>
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
            {renderRequestSnackbar}
        </div>
    )
}

export default RestaurantMenu;

