/**
 * Screen for staff workers to view all activeOrders
 */

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { apiUrl } from "../components/APIUrl";
import { Alert, CircularProgress, List, Typography } from "@mui/material";
import StaffOrderItem, { ActiveOrderItem } from "../components/StaffOrderItem";
import NavBar from "../components/Navbar";

type ActiveOrderResponse = { 
    data: ActiveOrderItem[]
}

const StaffOrders = () => {

    const { restaurantId } = useParams();

    const { data, isLoading, isError, isSuccess } = useQuery<ActiveOrderResponse>({
        queryKey: ['orders'],
        queryFn: () => fetch(`${apiUrl}/staff/${restaurantId}/orders`).then((res) => res.json())
    })

    const renderList = () => {
        if (isLoading) {
            return <> 
             <CircularProgress/> <Typography>Loading ...</Typography>
            </>
        } else if (isError) {
            return <Alert severity="error">Error fetching orders</Alert>
        } else if (isSuccess) {
            return <List>
                {data.data.map((order: ActiveOrderItem) => <StaffOrderItem key={order.orderId} order={order}/>)}
            </List>
        }
    }

    return <>
        <NavBar />
        <div style={{ width: '100%' }}>
            <Typography sx={{ textAlign: 'left' }} variant="h1" gutterBottom>
                Active Orders for Your Restaurant
            </Typography>
            {renderList()}
        </div>
    </>
}

export default StaffOrders;
