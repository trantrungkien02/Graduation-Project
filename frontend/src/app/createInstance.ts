import axios from 'axios';
import jwt_decode from 'jwt-decode';

interface DecodedToken {
    exp: number;
    // other fields if available
}
const refreshToken = async () => {
    try {
        const res = await axios.post(
            'http://localhost:8000/v1/auth/refresh',
            {},
            {
                withCredentials: true,
            },
        );
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const createAxios = (user: any, dispatch: any, stateSuccess: any) => {
    const newInstance = axios.create();
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwt_decode<DecodedToken>(user?.accessToken);
            console.log(decodedToken.exp, date.getTime() / 1000);
            if (decodedToken.exp < date.getTime() / 1000) {
                const data = await refreshToken();
                const refreshUser = {
                    ...user,
                    accessToken: data.accessToken,
                };
                dispatch(stateSuccess(refreshUser));
                config.headers = config.headers || {}; // Ensure headers are defined
                config.headers['token'] = 'Bearer ' + data.accessToken;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        },
    );
    return newInstance;
};
