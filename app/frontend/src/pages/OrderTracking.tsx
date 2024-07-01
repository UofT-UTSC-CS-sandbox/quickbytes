import DirectionsMap2 from '../components/DirectionsMap2'
import DirectionsMap3 from '../components/DirectionsMap3'
import DirectionsMap from '../components/DirectionsMap'

import NavBar from '../components/Navbar';

interface OrderTrackingProps {
    orderId: string;
  }
  
const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId }) =>{
    return (
        <div>
            <NavBar />
            <DirectionsMap3 orderId={orderId}/>
        </div>
    );
}

//<DirectionsMap2 orderId={orderid}/>

export default OrderTracking;