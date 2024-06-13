import { useEffect, useState } from "react";
import { MenuItem } from "../model/Menu";
import { useMutation } from "@tanstack/react-query";
import { OrderCart } from "../model/OrderCart";
import { Alert, Button, CircularProgress, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, List, ListItem, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import currencyFormatter from "./CurrencyFormatter";
import { Add } from "@mui/icons-material";

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

type CreateOrderRequest = {
    menuItemId: string,
    optionSelected: string,
    addOnsSelected: Record<string, string>,
    quantity: number,
}

type UserOrderResponse = {
    data: OrderCart;
    orderKey: string;
    itemKey: string;
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

    // Create order
    const { mutate: createOrder, isError: isCreateOrderError } = useMutation({
        mutationKey: ['order', restaurantId],
        mutationFn: (newOrderData: CreateOrderRequest): Promise<UserOrderResponse> => {
            return fetch(`http://localhost:3000/restaurants/${restaurantId}/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrderData)
            }).then(res => res.json());
        },
        onSuccess: (data) => {
            setOrder(data.data);
            close();
        }
    });

    const { isPending: isAddItemPending, isError: isAddItemError, mutate: addItem } = useMutation({
        mutationKey: ['order', order?.id, restaurantId],
        mutationFn: (newOrderData: CreateOrderRequest): Promise<UserOrderResponse> => {
            return fetch(`http://localhost:3000/restaurants/${restaurantId}/order/${order!.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrderData)
            }).then(res => res.json());
        },
        onSuccess: (data) => {
            setOrder(data.data);
            close();
        }
    });

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

    return (
        <>
            <DialogTitle>
                <Typography variant='h4'>{data?.name}</Typography>
            </DialogTitle>

            <DialogContent>
                {/* add image here */}
                <img style={{ width: '50%', borderRadius: 15 }} src='/menu/shawarma/ChickenShawarmaPlate.webp' alt={data?.name} />
                <Stack spacing={2}>
                <Typography>{data?.description}</Typography>

                <Divider />

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
                        <TextField inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
                    </FormControl>

                    <Divider />

                    <Typography>Price</Typography>
                    <p>{currencyFormatter.format(price)}</p>
                    <Stack direction='row' justifyContent="space-between">
                        <Button disabled={isAddItemPending} variant='contained' color='success' onClick={onAddSubmit} startIcon={!isAddItemPending ? <Add /> : <CircularProgress/>}>Add To Order</Button>
                        <Button disabled={isAddItemPending} onClick={close} color='error'>Cancel</Button>
                    </Stack>

                    { isCreateOrderError && <Alert severity='error'>Encountered an error while creating your order. Please try again.</Alert> }
                    { isAddItemError && <Alert severity='error'>Encountered an error while adding this item. Please try again.</Alert> }
                </Stack>
            </DialogContent>
        </>
    )
}

export default MenuAdd;