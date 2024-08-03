import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";

export type RestaurantInfo = {
    name: string;
    description: string;
    address: string;
    coordinateX: number;
    coordinateY: number;
    id: string;
    image: string;
};

interface RestaurantItemProps {
    restaurant: RestaurantInfo,
    onClick: () => void
}

const RestaurantItem = ({ restaurant, onClick }: RestaurantItemProps) => {

    const { name, description, address, image } = restaurant;

    return <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card>
            <CardActionArea onClick={onClick}>
                <CardMedia sx={{ height: 200 }} image={image} title={`${name} photo`}>

                </CardMedia>
                <CardContent sx={{ textAlign: 'left', alignSelf: 'flex-end', height: 200 }}>
                    <Typography variant="h5">{name}</Typography>
                    <Typography variant="body1">{address}</Typography>
                    <Typography variant="body1" sx={{ margin: '20px 0' }}>{description}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    </Grid>
};

export default RestaurantItem;