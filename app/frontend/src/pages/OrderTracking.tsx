import DirectionsMap2 from '../components/Directions/DirectionsMap2'
import DirectionsMap3 from '../components/Directions/DirectionsMap3'
import DirectionsMap from '../components/Directions/DirectionsMap'
import DirectionsMap5 from '../components/Directions/DirectionsMap5'
//import DirectionsMap2 from '../components/Directions/DirectionsMap6'


import NavBar from '../components/Navbar';

interface OrderTrackingProps {
    userId: string;
  }
  
const OrderTracking: React.FC<OrderTrackingProps> = ({ userId }) =>{
    return (
        <div>
            <NavBar />
            <DirectionsMap2 userId={userId}/>
        </div>
    );
}

//<DirectionsMap2 orderId={orderid}/>

export default OrderTracking;