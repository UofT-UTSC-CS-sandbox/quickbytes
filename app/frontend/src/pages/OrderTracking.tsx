import DirectionsMap2 from '../components/DirectionsMap2'
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