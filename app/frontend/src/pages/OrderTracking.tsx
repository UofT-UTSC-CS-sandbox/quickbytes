import DirectionsMap2 from '../components/DirectionsMap'
import NavBar from '../components/Navbar';

interface OrderTrackingProps {
    id: string;
    getOrders: (userId: string) => Promise<string[]>;
  }
  
const OrderTracking: React.FC<OrderTrackingProps> = ({ id, getOrders}) =>{
    return (
        <div>
            <NavBar />
            <DirectionsMap id={id} getOrders={getOrders}/>
        </div>
    );
}

export default OrderTracking;