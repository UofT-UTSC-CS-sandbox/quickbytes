import { useState, useEffect } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { getUserOrders } from '../../middleware';

interface OrderMenuProps {
  userId: string;
  setOrderId: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

/* Generates and renders drop-down menu for orders */
function OrderMenu({ userId, setOrderId, setLoading }: OrderMenuProps) {
  //console.log("reloaded")

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [orders, setOrders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getUserOrders(userId)
      .then(data => {
        setOrders(data);
        //For now it defaults to selecting the order at index 1
        setOrderId(data[1]);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId, setLoading]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (orderId: string) => {
    setOrderId(orderId);
    handleClose();
  };

  if (error) return <p>Error loading orders: {error}</p>;

  return (
    <>
      <Button
        id="order-button"
        aria-controls={open ? 'order-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ color: 'black', backgroundColor: 'white', '&:hover': { backgroundColor: 'lightgray' } }}
      >
        Select Order
      </Button>
      <Menu
        id="order-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'order-button',
        }}
      >
        {orders.map((orderId, index) => (
          <MenuItem key={index} onClick={() => handleMenuItemClick(orderId)}>
            <p>Order {orderId}</p>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default OrderMenu;
