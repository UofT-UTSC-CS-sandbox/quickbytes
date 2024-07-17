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
 * All API functions related to retrieving and updating map tracking information
 * such as map coordinates, wayfinding and estimated time of arrival.
 */
export default {
        /**
     * Update the users notification settings for the given role.
     * 
     * @param userId The ID of the user to update the status for.
     * @param role The role of the user to update the status for.
     * @param enabled The new status to set for the user.
     * @returns Success message.
     */
        updateNotification: (userId: string, onSuccess: (data: UpdateNotificationResponse) => void) =>
            usePostEndpoint<UpdateNotificationResponse, Error, UpdateNotificationRequest>(
                {
                    inputUrl: `user/${userId}/updateNotification`,
                    useAuth: false
                },
                {
                    mutationKey: ['updateNotification', userId],
                    onSuccess
                }
            ),
       /**
     * Update the user role for the given role.
     * 
     * @param userId The ID of the user to update the status for.
     * @param role The role of the user to update the status for.
     * @param enabled The new status to set for the user.
     * @returns Success message.
     */
       updateRole: (userId: string, onSuccess: (data: UpdateRoleResponse) => void) =>
        usePostEndpoint<UpdateRoleResponse, Error, UpdateRoleRequest>(
            {
                inputUrl: `user/${userId}/updateRole`,
                useAuth: false
            },
            {
                mutationKey: ['updateNotification', userId],
                onSuccess
            }
        ),
    /**
     * Function to fetch the current notification settings of a user.
     * Use as a check to see if user should receive notifications.
     * 
     * @param userId The ID of the user whose location is to be fetched.
     * @returns An object containing the notification settings for customer and courier.
     */
    getNotificationSettings: (userId: string | undefined) =>
        useGetEndpoint<GetNotificationSettingsResponse>(
            {
                inputUrl: `user/${userId}/getNotificationSettings`,
                useAuth: false,
            },
            {
                queryKey: ['getNotificationSettings', userId],
                enabled: !!userId,
            }),
    /**
     * Function to fetch the current roles of a user.
     * Use as a check to see if user should have access things from different roles.
     * 
     * @param userId The ID of the user whose location is to be fetched.
     * @returns An object containing a the role settings for customer and courier.
     */
    getRoleSettings: (userId: string | undefined) =>
        useGetEndpoint<GetRoleSettingsResponse>(
            {
                inputUrl: `user/${userId}/getRoleSettings`,
                useAuth: false,
            },
            {
                queryKey: ['getRoleSettings', userId],
                enabled: !!userId,
            }),
}