import { useEffect, useState } from "react";
import { MenuItem } from "../model/Menu";
import { OrderCart } from "../model/OrderCart";
import { Alert, Button, CircularProgress, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, List, ListItem, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import currencyFormatter from "./CurrencyFormatter";
import { Add } from "@mui/icons-material";
import orderService from "../services/orderService";

type MenuAddProps = {
    data: MenuItem,
    close: () => void,
    setOrder: React.Dispatch<React.SetStateAction<OrderCart | null>>,
    order: OrderCart | null,
    restaurantId: string
}

type AddOnState = {
    addOnName: string,
    selectedName: string,
}

// A popup modal for adding a new menu item and specify options 
const MenuAdd = ({ data, close, setOrder, order, restaurantId }: MenuAddProps) => {

    const { name } = data;
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [selectedAddOns, setSelectedAddOns] = useState<AddOnState[]>([]);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (data?.options) {
            setSelectedOption(data.options[0]!.name);
            if (data.addOns) {
                setSelectedAddOns(data.addOns.map(({ name, addOns }) => {
                    return {
                        addOnName: name,
                        selectedName: addOns[0]!.name,
                    }
                }))
            } else {
                setSelectedAddOns([]);
            }
        }
    }, [data.name]);

    const onOptionSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption((event.target as HTMLInputElement).value);
    }

    const onAddOnSelect = (event: React.ChangeEvent<HTMLInputElement>, addOnName: string) => {
        const newAddOns = selectedAddOns.map((addOn) => {
            if (addOn.addOnName === addOnName) {
                return { addOnName, selectedName: event.target.value };
            } else {
                return addOn;
            }
        });
        setSelectedAddOns(newAddOns)
    }

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(event.target.value);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            setQuantity(newQuantity);
        } else {
            setQuantity(0);
        }
    }

    const renderOptions = (data: MenuItem) => {
        return (
            <FormControl>
                <Typography><FormLabel>Options</FormLabel></Typography>
                <RadioGroup value={selectedOption} onChange={onOptionSelect} row>
                    {
                        data.options.map((option) =>
                            <FormControlLabel value={option.name} label={`${option.name} ${currencyFormatter.format(option.price)}`} control={<Radio />} key={option.name} />
                        )
                    }
                </RadioGroup>
            </FormControl>
        )
    }

    const { mutate: createOrder, isError: isCreateOrderError } = orderService.useCreateOrder(
        restaurantId, 
        (data) => {
            setOrder(data.data);
            close();
        }
    ).useMutation();

    const { isPending: isAddItemPending, isError: isAddItemError, mutate: addItem } = orderService.useAddItem(
        restaurantId,
        order?.id || undefined,
        (data) => {
            setOrder(data.data);
            close();
        }
    ).useMutation();

    const onAddSubmit = () => {
        const addOnsObject: Record<string, string> = selectedAddOns.reduce((agg, val) => {
            return { ...agg, [val.addOnName]: val.selectedName };
        }, {});

        // If order is null, create a new order thru a request.
        if (!order || !order.id) {
            createOrder({
                menuItemId: name,
                optionSelected: selectedOption,
                addOnsSelected: addOnsObject,
                quantity
            });
        } else {
            // Else simply update the current order with a new item
            addItem({
                menuItemId: name,
                optionSelected: selectedOption,
                addOnsSelected: addOnsObject,
                quantity
            });
        }
    }

    // Calculate the total price
    const optionBasePrice = data?.options?.find((option) => option.name === selectedOption)?.price || 0;
    let addOnPrices = 0;
    if (data.addOns) {
        addOnPrices = data?.addOns.reduce((acc, addOn) => {
            // Find what add option the user has selected
            const selectedOption = selectedAddOns.find(addOn => addOn.addOnName === addOn.addOnName)?.selectedName;
            // Find the price of the selected add on option
            const addedPrice = addOn.addOns.find(a => a.name === selectedOption)?.additionalPrice || 0;
            return acc + addedPrice;
        }, 0) || 0;
    }
    const price = optionBasePrice + addOnPrices;

    const isQuantityValid = !isNaN(quantity) && quantity > 0 ;

    return (
        <>
            <DialogTitle>
                <Typography style={{fontSize: '24px'}}>{data?.name}</Typography>
            </DialogTitle>

            <DialogContent>
                {/* add image here */}
                <img style={{ width: '50%', borderRadius: 15 }} src='/shawarma2.jpg' alt={data?.name} />
                <Stack spacing={2}>
                <Typography>{data?.description}</Typography>

                {data.options.length > 1 && renderOptions(data)}
                    <Divider />

                    {data.addOns &&
                        <>
                            <Typography>Add Ons</Typography>
                            <List>
                                {
                                    data.addOns.map(({ name, addOns }) => {
                                        return (
                                            <ListItem key={name}>
                                                <FormControl>
                                                    <FormLabel>{name}</FormLabel>
                                                    <RadioGroup
                                                        name={name}
                                                        value={selectedAddOns.find(addOn => addOn.addOnName === name)?.selectedName || null}
                                                        onChange={(e) => onAddOnSelect(e, name)}
                                                        row>
                                                        {
                                                            addOns.map(({ name: addOnOptionName, additionalPrice }) =>
                                                                <FormControlLabel value={addOnOptionName} label={`${addOnOptionName} ${currencyFormatter.format(additionalPrice)}`} control={<Radio />} key={addOnOptionName} />
                                                            )
                                                        }
                                                    </RadioGroup>
                                                </FormControl>
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                            <Divider />
                        </>
                    }

                    <FormControl>
                        <FormLabel>Order Quantity</FormLabel>
                        <TextField required inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} value={isQuantityValid ? quantity : ""} onChange={handleQuantityChange} error={!isQuantityValid} helperText={!isQuantityValid ? 'Please enter a valid quantity' : ''} />
                    </FormControl>

                    <Divider />

                    <Typography>Price</Typography>
                    <p>{currencyFormatter.format(price)}</p>
                    
                    <Stack justifyContent="space-between">
                    { 
                        (isNaN(quantity) || quantity < 1) ?
                        <>
                            <Alert severity="warning">Please enter a valid quantity</Alert>
                        </>
                        :
                        (!order || order.restaurant.restaurantId === restaurantId) ?
                            <Button disabled={isAddItemPending} variant='contained' color='success' onClick={onAddSubmit} startIcon={!isAddItemPending ? <Add /> : <CircularProgress/>}>Add To Order</Button>
                        :
                        <Alert severity="warning">You currently have an order in-progress for {order?.restaurant.restaurantName}. You cannot order from more than 1 restaurant or have more than one order pending delivery at the same time.</Alert>
                    }
                    <Button disabled={isAddItemPending} onClick={close} color='error' sx={{marginTop: '10px'}}>Cancel</Button>
                    </Stack>

                    { isCreateOrderError && <Alert severity='error'>Encountered an error while creating your order. Please try again.</Alert> }
                    { isAddItemError && <Alert severity='error'>Encountered an error while adding this item. Please try again.</Alert> }
                </Stack>
            </DialogContent>
        </>
    )
}

export default MenuAdd;