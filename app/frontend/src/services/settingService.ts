import { NotificationType } from "../model/NotificationTypes"
import { usePostEndpoint, useGetEndpoint } from "./base"

type UpdateNotificationResponse = {
    message: string
}

type UpdateNotificationRequest = {
    role: string, 
    enabled: boolean
}

type UpdateRoleResponse = UpdateNotificationResponse
type UpdateRoleRequest = UpdateNotificationRequest

interface GetNotificationSettingsResponse {
    notification_settings: Record<NotificationType, boolean>
}

interface GetRoleSettingsResponse {       
    role_settings: {
        courierRole: boolean,
        customerRole: boolean
    }
}

/**
 * All API functions related to user settings.
 */
export default {
        /**
     * Update the users notification settings for the given role.
     * 
     * @param role The role of the user to update the status for.
     * @param enabled The new status to set for the user.
     * @returns Success message.
     */
        updateNotification: (onSuccess: (data: UpdateNotificationResponse) => void) =>
            usePostEndpoint<UpdateNotificationResponse, Error, UpdateNotificationRequest>(
                {
                    inputUrl: `user/updateNotification`,
                    useAuth: true
                },
                {
                    mutationKey: ['updateNotification'],
                    onSuccess
                }
            ),
       /**
     * Update the user role for the given role.
     * 
     * @param role The role of the user to update the status for.
     * @param enabled The new status to set for the user.
     * @returns Success message.
     */
       updateRole: (onSuccess: (data: UpdateRoleResponse) => void) =>
        usePostEndpoint<UpdateRoleResponse, Error, UpdateRoleRequest>(
            {
                inputUrl: `user/updateRole`,
                useAuth: true
            },
            {
                mutationKey: ['updateNotification'],
                onSuccess
            }
        ),
    /**
     * Function to fetch the current notification settings of a user.
     * Use as a check to see if user should receive notifications.
     * 
     * @returns An object containing the notification settings for customer and courier.
     */
    getNotificationSettings: () =>
        useGetEndpoint<GetNotificationSettingsResponse>(
            {
                inputUrl: `user/getNotificationSettings`,
                useAuth: true,
            },
            {
                queryKey: ['getNotificationSettings'],
            }),
    /**
     * Function to fetch the current roles of a user.
     * Use as a check to see if user should have access things from different roles.
     * 
     * @returns An object containing a the role settings for customer and courier.
     */
    getRoleSettings: () =>
        useGetEndpoint<GetRoleSettingsResponse>(
            {
                inputUrl: `user/getRoleSettings`,
                useAuth: true,
            },
            {
                queryKey: ['getRoleSettings'],
            }),
}