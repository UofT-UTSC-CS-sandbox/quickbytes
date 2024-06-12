
import { Card, CardActionArea, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { MenuItem } from '../model/Menu';
import styles from './MenuItemCard.module.css'
import currencyFormatter from './CurrencyFormatter';

const MenuItemCard = ({ data, onClick }: { data: MenuItem, onClick: (itemName: string) => void }) => {
    return (
        <Card className={styles.card} sx={{ boxShadow: 3, borderRadius: 3 }}>
            <CardActionArea onClick={() => onClick(data.name)}>
                <CardContent>
                    <Stack justifyContent='space-between' alignContent='flex-start' direction='row'>
                        <Stack>
                            <h3 className={styles.cardTitle}>{data.name}</h3>
                            <p className={styles.cardDescription}>{data.description}</p>
                        </Stack>
                        <CardMedia 
                        component='img' 
                        image='/menu/shawarma/ChickenShawarmaPlate.webp'
                        sx={{ width: 150, borderRadius: 4, height: 100 }}
                        alt={`${data.name} photo`}/>
                    </Stack>
                    {
                        (data.options.length === 1) &&
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem' }} color="success.main">{currencyFormatter.format(data.options[0].price)}</Typography>
                    }
                    {
                        (data.options.length > 1) &&
                        <ul className={styles.optionsList}>
                            {
                                data.options.map((option) => {
                                    return (
                                        <li className={styles.optionsListElement} key={`${data.name}-${option.name}`}>
                                            <h4 className={styles.optionsListElementName}>{option.name}</h4>
                                            <p className={styles.optionsListElementPrice}>${option.price}</p>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    }
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default MenuItemCard;