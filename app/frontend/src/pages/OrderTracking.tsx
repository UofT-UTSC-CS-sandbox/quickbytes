import DirectionsMap2 from '../components/DirectionsMap2'
import NavBar from '../components/Navbar';

function OrderTracking= ({ orderid }) =>{
    return (
        <div>
            <NavBar />
            <DirectionsMap2 orderId={orderid}/>
        </div>
    );
}

export default OrderTracking;