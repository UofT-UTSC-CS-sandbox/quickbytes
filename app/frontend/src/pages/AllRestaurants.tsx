import { Grid, Container, CircularProgress, Typography } from "@mui/material";
import NavBar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import RestaurantItem from "../components/RestaurantItem";
import restaurantService from "../services/restaurantService";

const AllRestaurants = () => {
    
    const { data, isLoading, isError } = restaurantService.getAllRestaurants().useQuery();
    const nav = useNavigate();

    const wrapContent = (content: JSX.Element) => {
        return <>
            <NavBar />
            <Container>
                <h1 style={{ textAlign: 'left' }}>All Restaurants</h1>
                {content}
            </Container>
        </>
    }

    if (isLoading) {
        return wrapContent(
            <Typography><CircularProgress /> Loading ... </Typography>
        )
    }

    if (isError || !data) {
        return wrapContent(
            <Typography>Encountered error getting restaurants. Please try again.</Typography>
        )
    }
    
    return wrapContent(
        <Grid container spacing={2} padding={4}>
            { 
            data.data.map((restaurant, index) => <RestaurantItem restaurant={restaurant} key={index} onClick={() => nav(`/restaurant/${restaurant.id}`)}/>) }
        </Grid>
    )
};

export default AllRestaurants;