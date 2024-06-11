
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { MenuItem } from '../model/Menu';
import styles from './MenuItemCard.module.css'
import currencyFormatter from './CurrencyFormatter';

const MenuItemCard = ({ data, onClick }: { data: MenuItem, onClick: (itemName: string) => void }) => {
    return (
        <Card className={styles.card} >
            <CardActionArea onClick={() => onClick(data.name)}>
                <CardContent>
                    <h3 className={styles.cardTitle}>{data.name}</h3>
                    <p className={styles.cardDescription}>{data.description}</p>
                    {
                        (data.options.length === 1) &&
                        <Typography>{currencyFormatter.format(data.options[0].price)}</Typography>
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