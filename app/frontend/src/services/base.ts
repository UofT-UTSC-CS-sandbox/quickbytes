import { DefaultError, MutationKey, QueryKey, UndefinedInitialDataOptions, UseMutationOptions, UseMutationResult, UseQueryResult, useMutation, useQuery } from "@tanstack/react-query"
import { apiUrl } from "../components/APIUrl";
import { User } from "firebase/auth";

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
    currentUser?: User | null;
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
 * @param body Any additional arguments to give to the fetch request.
 * @returns A promise that will resolve with the response JSON.
 */
async function fetchWithAuth<Req, Res>(fetchUrl: string | ((body: Req) => string), method: AllowedFetchMethods, useAuth: boolean, currentUser?: User | null, body?: Req, options?: RequestInit): Promise<Res> {

    const finalUrl: string = (typeof fetchUrl === 'string') ? fetchUrl : fetchUrl(body as Req);

    if (finalUrl.startsWith('http')) {
        throw new Error("URL already contains a HTTP(s) protocol. Did you accidentally pass in the entire URL instead of a URL relative to the server backend?")
    }

    const token = useAuth ? await currentUser!.getIdToken() : undefined;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(useAuth && { 'Authorization': `Bearer ${token}` }),
    };

    const response = await fetch(`${apiUrl}/${finalUrl}`, {
        ...options,
        ...(body && { body: JSON.stringify(body) }),
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
 * Create a promise that completes POST request and resolves with the response
 * JSON if the status code is ok. Else, an error is thrown.
 * @param { Object } params The parameters used to create the fetch request.
 * @param { string } params.inputUrl The url to send the request to, or a function which takes the request body and returns the url.
 * @param { boolean } params.useAuth If True, also attach the credentials for the current user to the request.
 * @param { Object } params.currentUser The firebase auth user whose credentials will be sent with the request.
 * @returns { function(Req): Promise(Res) } A function that when called with the request body will complete a POST request to the backend using a Promise.
 */
export function createPost<Req, Res>({ inputUrl, useAuth = false, currentUser }: CreateRequestParams<Req>): (body: Req) => Promise<Res> {
    return (body: Req): Promise<Res> => {
        return fetchWithAuth<Req, Res>(inputUrl, 'POST', useAuth, currentUser, body, {});
    };
}

/**
 * Create a promise that completes GET request and resolves with the response
 * JSON if the status code is ok. Else, an error is thrown.
 * @param { Object } params The parameters used to create the fetch request.
 * @param { string } params.inputUrl The url to send the request to, or a function that returns the url.
 * @param { boolean } params.useAuth If True, also attach the credentials for the current user to the request.
 * @param { Object } params.currentUser The firebase auth user whose credentials will be sent with the request.
 * @returns { function(Req): Promise(Res) } A function that when called completes a GET request to the backend.
 */
export function createGet<Req, Res>({ inputUrl, useAuth = false, currentUser }: CreateRequestParams<Req>): () => Promise<Res> {
    return (): Promise<Res> => {
        return fetchWithAuth<Req, Res>(inputUrl, 'GET', useAuth, currentUser, undefined, {});
    };
}

/**
 * Create a promise that completes DELETE request and resolves with the response
 * JSON if the status code is ok. Else, an error is thrown.
 * @param { Object } params The parameters used to create the fetch request.
 * @param { string } params.inputUrl The url to send the request to, or a function which takes the request body and returns the url.
 * @param { boolean } params.useAuth If True, also attach the credentials for the current user to the request.
 * @param { Object } params.currentUser The firebase auth user whose credentials will be sent with the request.
 * @returns { function(Req): Promise(Res) } A function that when called with the request body will complete a DELETE request to the backend using a Promise.
 */
export function createDelete<Req, Res>({ inputUrl, useAuth = false, currentUser }: CreateRequestParams<Req>): (body: Req) => Promise<Res> {
    return (body: Req): Promise<Res> => {
        return fetchWithAuth<Req, Res>(inputUrl, 'DELETE', useAuth, currentUser, body, {});
    };
}

export type UseMutationEndpointResult<TData, TError, TVariables, TContext> = { key: MutationKey | undefined, useMutation: () => UseMutationResult<TData, TError, TVariables, TContext> };

/**
 * Constructor for a single endpoint that can be declared under a service,
 * representing a way to mutate / update data using a request to the backend.
 * 
 * @example
 * const myService = { postRestaurant: (id: string) => useMutationEndpoint({
 *      mutationKey: ['postRestaurant'],
 *      mutationFn: createPost({
 *          inputUrl: `restaurants/${id}`, 
            useAuth: false,
 *      })
 *  })
 * }
 * 
 * const MyComponent = () => {
 *      const { mutate } = myService.postRestaurant().useMutation()
 *      mutate({ name: "My new Restaurant" })
 * }
 * 
 * @param options The options for setting up the useMutation functionality from react-query.
 * @returns Returns a function that will create a useMutation using the options provided.
 */
export function useMutationEndpoint<
    TData = unknown, // Response body
    TError = DefaultError,
    TVariables = void, // Request body
    TContext = unknown
>(options: UseMutationOptions<TData, TError, TVariables, TContext>):
    UseMutationEndpointResult<TData, TError, TVariables, TContext> {
    return {
        key: options.mutationKey,
        useMutation: () => useMutation(options)
    }
};

export type UseQueryEndpointResult<TData, TError> = { key: QueryKey | undefined, useQuery: () => UseQueryResult<TData, TError> };

/**
 * Constructor for a single endpoint that can be declared under a service,
 * representing a way to retrieve data using a request to the backend.
 * 
 * @example
 * const myService = { getRestaurant: () => useQueryEndpoint({
 *      queryKey: ['getRestaurant'],
 *      queryFn: createGet({
 *          inputUrl: `restaurants/${restaurantId}`, 
            useAuth: false,
 *      })
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
 * @param options The options for setting up the useQuery functionality from react-query.
 * @returns Returns a function that will create a useQuery using the options provided.
 */
export function useQueryEndpoint<
    TQueryFnData = unknown, // Response body
    TError = DefaultError, 
    TData = TQueryFnData  
>(options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, QueryKey>):
    UseQueryEndpointResult<TData, TError> {
    return {
        key: options.queryKey,
        useQuery: () => useQuery<TQueryFnData, TError, TData, QueryKey>(options)
    }
};