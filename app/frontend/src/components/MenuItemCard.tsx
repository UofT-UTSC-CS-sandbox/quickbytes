
import styles from './MenuItemCard.module.css'

export type MenuItemOption = {
    name: string,
    price: number
}

export type MenuItem = {
    name: string
    options?: MenuItemOption[]
    price?: number
    description?: string
}

const MenuItemCard = ({ data }: { data: MenuItem }) => {
    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>{data.name}</h3>
            <p className={styles.cardDescription}>{data.description}</p>
            {
                typeof data.price !== 'undefined' &&
                <p>${data.price}</p>
            }
            {
                (typeof data.price === 'undefined' && data.options) &&
                <ul className={styles.optionsList}>
                    {
                        data.options.map((option) => {
                            return (
                                <li className={styles.optionsListElement}>
                                    <h4 className={styles.optionsListElementName}>{option.name}</h4>
                                    <p className={styles.optionsListElementPrice}>${option.price}</p>
                                </li>
                            )
                        })
                    }
                </ul>
            }
        </div>
    )
}

export default MenuItemCard;