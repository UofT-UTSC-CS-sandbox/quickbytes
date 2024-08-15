import { Grid, Container, CircularProgress, Typography, Stack, InputAdornment, FormControl, OutlinedInput, Autocomplete, TextField } from "@mui/material";
import NavBar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import RestaurantItem, { RestaurantInfo } from "../components/RestaurantItem";
import restaurantService from "../services/restaurantService";
import { SearchRounded } from "@mui/icons-material";
import { AppBar, CssBaseline, Box } from '@mui/material';
import { useEffect, useMemo, useState } from "react";
import PageHead from "../components/PageHead";

const AllRestaurants = () => {

    const { data, isLoading, isError, isSuccess } = restaurantService.getAllRestaurants().useQuery();
    const nav = useNavigate();

    const [search, setSearch] = useState("");
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    useEffect(() => {
        if (!isSuccess || !data) {
            return;
        }
        const permissibleLocations = data.data.map((restaurant) => restaurant.address);
        setSelectedLocations(selectedLocations.filter((location) => permissibleLocations.includes(location)));
    }, [data, isSuccess]);

    const allLocations = useMemo(() => {
        if (!data || !isSuccess) return new Set([]);
        return new Set(data.data.map((restaurant) => restaurant.address))
    }, [data, isSuccess]);

    const results: RestaurantInfo[] = useMemo(() => {
        if (!isSuccess) {
            return []
        }
        return data.data.filter((restaurant) => {
            const searchFilter = !search || restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
                restaurant.address.toLowerCase().includes(search.toLowerCase()) ||
                restaurant.description.toLowerCase().includes(search.toLowerCase());
            const locationFilter = !selectedLocations.length || selectedLocations.includes(restaurant.address);
            return searchFilter && locationFilter;
        });
    }, [data, search, selectedLocations, isSuccess]);

    const wrapContent = (content: JSX.Element) => {
        return <>
            <PageHead title="Restaurants" description="View all on-campus restaurants available to order from" />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <NavBar />
                </AppBar>
                <Container sx={{ padding: '70px' }}>
                    <h1 style={{ textAlign: 'left' }}>All Restaurants</h1>
                    {content}
                </Container>
            </Box>
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
        <Stack>
            <Grid container spacing={1}>
                <Grid item xs={12} md={6} >
                    <FormControl variant="outlined" sx={{ width: '100%' }}>
                        <OutlinedInput
                            id="input-with-icon-adornment"
                            startAdornment={
                                <InputAdornment position="start">
                                    <SearchRounded />
                                </InputAdornment>
                            }
                            placeholder="Search restaurants"
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6} >
                    <FormControl sx={{ width: '100%' }}>
                        <Autocomplete
                            multiple
                            limitTags={2}
                            options={[...allLocations]}
                            renderInput={(params) => (
                                <TextField {...params} label="Filter by Location" placeholder="Campus Locations" />
                            )}
                            onChange={(event, value) => setSelectedLocations(value)}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={2} padding={4}>
                {
                    results.map((restaurant, index) =>
                        <RestaurantItem restaurant={restaurant} key={index} onClick={() => nav(`/restaurant/${restaurant.id}`)} />
                    )
                }
            </Grid>
        </Stack>
    )
};

export default AllRestaurants;