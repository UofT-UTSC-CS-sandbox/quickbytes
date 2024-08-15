import { DefaultError, MutationKey, QueryKey, UndefinedInitialDataOptions, UseMutationOptions, UseMutationResult, UseQueryResult, useMutation, useQuery } from "@tanstack/react-query"
import { apiUrl } from "../components/APIUrl";
import { User } from "firebase/auth";
import { useAuth as useAuthContext } from '../AuthContext';
import { useLocation, useNavigate } from "react-router-dom";

/**
 * The common set of parameters required to create a request using the
 * provided helper functions in this file for frontend services.
 * 
 * See usage in createPost, createGet, createDelete for how each
 * argument is used to construct the response.
 */
interface CreateRequestParams<Req> {
    inputUrl: string | ((body: Req) => string);
    useAuth: boolean;
    additionalOptions?: RequestInit;
}

/**
 * The allowed HTTP methods that can be used with fetchWithAuth.
 */
type AllowedFetchMethods = 'GET' | 'POST' | 'DELETE';

/**
 * Create a promise which makes a fetch request to the backend which will
 * resolve with the parsed response JSON of the response status is OK. If the
 * response status is not OK, then an error is thrown.
 * 
 * This function should NOT BE USED DIRECTLY. Instead, use createPost, createDelete,
 * and createGet which are wrappers around this function for their respective
 * HTTP methods.
 * 
 * The fetch can only be used to the backend, specified as the apiUrl.
 * 
 * @param url The relative url on the backend server to fetch.
 * @param method The HTTP method of the request.
 * @param useAuth If True, currentUser will be used to add firebase auth token to the request in the header.
 * @param currentUser The firebase user whose token will be attached to the request if useAuth is True.
 * @param onAuthError A function that will be called if useAuth is True but the user could not be authenticated.
 * @param body Request body.
 * @param options Any additional options to give to the fetch request.
 * @returns A promise that will resolve with the response JSON.
 */
async function fetchWithAuth<Req, Res>(fetchUrl: string | ((body: Req) => string), method: AllowedFetchMethods, useAuth: boolean, currentUser?: User | null, onAuthError?: () => void, body?: Req, options?: RequestInit): Promise<Res> {

    const finalUrl: string = (typeof fetchUrl === 'string') ? fetchUrl : fetchUrl(body as Req);

    if (finalUrl.startsWith('http')) {
        throw new Error("URL already contains a HTTP(s) protocol. Did you accidentally pass in the entire URL instead of a URL relative to the server backend?")
    }

    const token = useAuth ? await currentUser?.getIdToken() : undefined;

    if (!token && useAuth) {
        console.warn('Could not authenticate for ', finalUrl);
        if (onAuthError) onAuthError(); 
        else throw new Error('User is not authenticated and no fallback function was provided');
        return Promise.reject({});
    }

    // If caller added more header options, add them to the request
    const { headers: headerOptions, ...fetchOptions } = { ...options }
    const headers: HeadersInit = {
        ...(headerOptions ?? {}),
        'Content-Type': 'application/json',
        ...(useAuth && { 'Authorization': `Bearer ${token}` }),
    };

    // Construct the fetch request
    const response = await fetch(`${apiUrl}/${finalUrl}`, {
        ...fetchOptions,
        // only add the body if it isn't undefined (i.e. for requests other than GET)
        ...(typeof body !== 'undefined' && { body: JSON.stringify(body) }),
        method,
        headers,
    });

    if (!response.ok) {
        console.log(`Response is not Ok (Received ${response.status}: ${response.statusText})`);
        throw new Error(`Response not OK. (Received ${response.status}: ${response.statusText})`);
    }

    return response.json();
}

/**
 * The type returned by usePostEndpoint() and useDeleteEndpoint()
 */
export type UseMutationEndpointResult<TData, TError, TVariables, TContext> = { key: MutationKey | undefined, useMutation: () => UseMutationResult<TData, TError, TVariables, TContext> };

/**
 * Constructor for a single POST endpoint that can be declared under a service,
 * representing a way to mutate / update data using a POST request to the backend.
 * 
 * The first parameter (fetchOptions with inputUrl and useAuth) will be used
 * to construct the fetch promise that sends the request. The second parameter
 * provides the other arguments used by useMutation() from react-query
 * 
 * @example
 * const myService = { 
 *  postRestaurant: (id: string) => usePostEndpoint(
 *      { inputUrl: `restaurants/${id}`,  useAuth: false, },
 *      { mutationKey: ['postRestaurant'] })
 *  )
 * }
 * 
 * const MyComponent = () => {
 *      const { mutate } = myService.postRestaurant().useMutation()
 *      mutate({ name: "My new Restaurant" })
 * }
 * 
 * @param fetchOptions.inputUrl The url to send request to
 * @param fetchOptions.useAuth Whether to attach current user credentials to request.
 * @param fetchOptions.additionalOptions Additional options to add to the fetch() setup
 * @param options The options for useMutation functionality from react-query, excluding mutationFn.
 * @returns Returns a function that will create a useMutation using the options provided.
 */
export function usePostEndpoint<
    TData = unknown, // Response body
    TError = DefaultError,
    TVariables = void, // Request body
    TContext = unknown
>({ inputUrl, useAuth, additionalOptions = {} }: CreateRequestParams<TVariables>, options: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>):
    UseMutationEndpointResult<TData, TError, TVariables, TContext> {

    const { currentUser } = useAuth ? useAuthContext() : { currentUser: undefined }
    const navigate = useNavigate();
    const location = useLocation();    
    const badAuth = () => { 
        navigate('/login', { state: { from: location, showSessionExpiredToast: true } });
    }

    return {
        key: options.mutationKey,
        useMutation: () => useMutation({
            ...options,
            mutationFn: (body: TVariables): Promise<TData> => {
                return fetchWithAuth<TVariables, TData>(inputUrl, 'POST', useAuth, currentUser, badAuth, body, additionalOptions);
            }
        })
    }
};

/**
 * Constructor for a single DELETE endpoint that can be declared under a service,
 * representing a way to mutate / update data using a DELETE request to the backend.
 * 
 * The first parameter (fetchOptions with inputUrl and useAuth) will be used
 * to construct the fetch promise that sends the request. The second parameter
 * provides the other arguments used by useMutation() from react-query
 * 
 * @example
 * const myService = { 
 *  deleteRestaurant: (id: string) => useDeleteEndpoint(
 *      { inputUrl: ({id}) => `restaurants/${id}`,  useAuth: false, },
 *      { mutationKey: ['deleteRestaurant'] })
 *  )
 * }
 * 
 * const MyComponent = () => {
 *      const { mutate } = myService.deleteRestaurant().useMutation()
 *      mutate({ id: 'idToDeleteFromDb' })
 * }
 * 
 * @param fetchOptions.inputUrl The url to send request to
 * @param fetchOptions.useAuth Whether to attach current user credentials to request.
 * @param fetchOptions.additionalOptions Additional options to add to the fetch() setup
 * @param options The options for useMutation functionality from react-query, excluding mutationFn.
 * @returns Returns a function that will create a useMutation using the options provided.
 */
export function useDeleteEndpoint<
    TData = unknown, // Response body
    TError = DefaultError,
    TVariables = void, // Request body
    TContext = unknown
>({ inputUrl, useAuth, additionalOptions }: CreateRequestParams<TVariables>, options: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>):
    UseMutationEndpointResult<TData, TError, TVariables, TContext> {

    const { currentUser } = useAuth ? useAuthContext() : { currentUser: undefined }
    const navigate = useNavigate();
    const location = useLocation();    
    const badAuth = () => { 
        navigate('/login', { state: { from: location, showSessionExpiredToast: true } });
    }

    return {
        key: options.mutationKey,
        useMutation: () => useMutation({
            ...options,
            mutationFn: (body: TVariables): Promise<TData> => {
                return fetchWithAuth<TVariables, TData>(inputUrl, 'DELETE', useAuth, currentUser, badAuth, body, additionalOptions);
            }
        })
    }
};

/**
 * The type returned by useQueryEndpoint()
 */
export type UseQueryEndpointResult<TData, TError> = { key: QueryKey | undefined, useQuery: () => UseQueryResult<TData, TError> };

/**
 * Constructor for a single endpoint that can be declared under a service,
 * representing a way to retrieve data using a GET request to the backend.
 * 
 * The first parameter (fetchOptions with inputUrl and useAuth) will be used
 * to construct the fetch promise that sends the request. The second parameter
 * provides the other arguments used by useQuery() from react-query
 * 
 * @example
 * const myService = { 
 *  getRestaurant: () => useGetEndpoint(
 *      { inputUrl: `restaurants/${restaurantId}`, useAuth: false },     
 *      { queryKey: ['getRestaurant'] }
 *  })
 * }
 * 
 * const MyComponent = () => {
 *      const { data, isSuccess } = myService.getRestaurant().useQuery()
 *      if (isSuccess) {
 *          console.log("Found restaurant name", data.name);
 *      }
 * }
 * 
 * @param fetchOptions.inputUrl The url to send request to
 * @param fetchOptions.useAuth Whether to attach current user credentials to request.
 * @param fetchOptions.additionalOptions Additional options to add to the fetch() setup
 * @param options The options for useQuery functionality from react-query, excluding queryFn.
 * @returns Returns a function that will create a useQuery using the options provided.
 */
export function useGetEndpoint<
    TQueryFnData = unknown, // Response body
    TError = DefaultError, 
    TData = TQueryFnData  
>({ inputUrl, useAuth, additionalOptions = {} }: CreateRequestParams<void>, options: Omit<UndefinedInitialDataOptions<TQueryFnData, TError, TData, QueryKey>, 'queryFn'>):
    UseQueryEndpointResult<TData, TError> {

    const { currentUser } = useAuth ? useAuthContext() : { currentUser: undefined }
    const navigate = useNavigate();
    const location = useLocation();    
    const badAuth = () => { 
        navigate('/login', { state: { from: location, showSessionExpiredToast: true } });
    }

    return {
        key: options.queryKey,
        useQuery: () => useQuery({
            ...options,
            queryFn: () => {
                return fetchWithAuth<void, TQueryFnData>(inputUrl, 'GET', useAuth, currentUser, badAuth, undefined, additionalOptions)
            },
        })
    }
};