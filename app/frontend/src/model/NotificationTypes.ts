export enum RoleType {
    COURIER_ROLE = 'courierRole',
    CUSTOMER_ROLE = 'customerRole'
}

/**
 * The different notification types that the user can have different settings
 * for.
 * 
 * @example To iterate over all values:
 * (Object.values(NotificationType) as NotificationType[])
 */
export enum NotificationType {
    COURIER_NOTIFICATIONS = 'courierNotifications',
    CUSTOMER_NOTIFICATIONS = 'customerNotifications'
}

/**
 * The text labels associated with each notification type on the Settings page.
 */
export const NOTIFICATION_LABELS: Record<NotificationType, string> = {
    [NotificationType.CUSTOMER_NOTIFICATIONS]: 'Show customer notifications',
    [NotificationType.COURIER_NOTIFICATIONS]: 'Show courier notifications'
}

// Loop over
export const NOTIFICATION_TYPES = Object.values(NotificationType)