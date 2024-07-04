import DirectionsMap2 from '../components/Directions/DirectionsMap2'
import DirectionsMap3 from '../components/Directions/DirectionsMap3'
import DirectionsMap from '../components/Directions/DirectionsMap'
//import DirectionsMap2 from '../components/Directions/DirectionsMap4'
//import DirectionsMap2 from '../components/Directions/DirectionsMap6'
import { getUserOrders } from '../middleware';
import { getRestaurantOrders } from '../middleware';


import NavBar from '../components/Navbar';

interface OrderTrackingProps {
    id: string;
    getOrders: (userId: string) => Promise<string[]>;
  }
  
const OrderTracking: React.FC<OrderTrackingProps> = ({ id, getOrders}) =>{
    return (
        <div>
            <NavBar />
            <DirectionsMap2 id={id} getOrders={getOrders}/>
        </div>
    );
}

export default OrderTracking;