import axios from "axios";
import { AxiosConstants } from "../constaints/axiosContaint";
import { routeNames } from "../constaints/routeName";
import Cookies from "js-cookie";



const axiosInstance = axios.create({
    baseURL: AxiosConstants.AXIOS_BASEURL,
    timeout: AxiosConstants.AXIOS_TIMEOUT,
    headers: AxiosConstants.AXIOS_HEADER
});

axiosInstance.interceptors.request.use(
    (config) => {
        let token = Cookies.get('authToken');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            token = Cookies.get('authToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }

        if (process.env.NODE_ENV === 'development') {
            const method = config.method?.toUpperCase() ?? 'GET';
            const urlWithParams = method.concat(` ${config.url}`, (config.params ? `?${new URLSearchParams(config.params).toString()}` : ''));
            console.log('Request URL:', urlWithParams);
        }

        return config;
    },
    (error) => {
        return Promise.reject(new Error(error.message));
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        console.error("Error :", error);

        if (!error.response) {
            console.error('Unauthorized, redirecting to index...');
            Cookies.remove('authToken');  // Remove the authentication token
            window.location.href = routeNames.index;  // Redirect to index
            return Promise.reject(new Error('Network error, unable to connect to API'));
        }

        return Promise.reject(error);
    }
)

export default axiosInstance;