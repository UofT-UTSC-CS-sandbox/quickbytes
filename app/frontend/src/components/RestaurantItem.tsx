import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";

interface RestaurantItemProps {
    restaurant: {
        name: string,
        description: string
        address: string,
        coordinateX: number,
        coordinateY: number,
        id: string
    },
    onClick: () => void
}

const RestaurantItem = ({ restaurant, onClick }: RestaurantItemProps) => {
    return <Grid item xs={12} sm={6} md={3}>
        <Card >
            <CardActionArea onClick={onClick}>
                <CardMedia sx={{ height: 200 }} image='/salad.jpg' title={`${restaurant.name} photo`}>

                </CardMedia>
                <CardContent sx={{ textAlign: 'left', alignSelf: 'flex-end', height: 150 }}>
                    <Typography variant="h5">{restaurant.name}</Typography>
                    <Typography variant="body1">{restaurant.address}</Typography>
                    <Typography variant="body1" sx={{ margin: '20px 0'}}>{restaurant.description}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    </Grid>
};

export default RestaurantItem;
