import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import MenuItemCard, { MenuItem } from "../components/MenuItemCard";
import { useState } from "react";
import styles from './Menu.module.css'

type RestaurantMenuParams = {
    id: string
}

type MenuCategory = {
    name: string,
    options: MenuItem[]
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

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError || !data) {
        return <div>Sorry, we could not find the menu for this restaurant. Please try again later.</div>
    }

    const { data: { name, categories, description } } = data;

    const onSelectCategory = (category: string) => {
        const newCategory = categories.find(data => data.name === category);
        setCategory(newCategory ? newCategory : (categories.length > 0 ? categories[0] : null));
    }

    return (
        <div className={styles.menuContainer}>
            <h1>{name}</h1>
            <p>{description}</p>
            <div className={styles.menuLayout}>
                <div className={styles.categoryList}>
                    {
                        categories.map((data) => {
                            return (
                                <div className={styles.categoryOption}>
                                    <button onClick={() => onSelectCategory(data.name)} key={data.name} disabled={data.name === category?.name}>{data.name}</button>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.itemList}>
                    {
                        category ?
                            category.options.map((menuItem) => <MenuItemCard data={menuItem} />)
                            :
                            <div>Choose a menu category to start browsing.</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default RestaurantMenu;

