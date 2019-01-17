import axios from 'axios';
import authHeader from '../helpers/authHeader';
import { TOKEN_KEY } from '../constants';

export default class UserService {
    login = (loginDetails) => 
        axios.post('/api/users/login', loginDetails);
    
    register = (userDetails) => 
        axios.post('/api/users/register', userDetails);

    logoff = () => {
        const config = { headers: authHeader() };
        localStorage.removeItem(TOKEN_KEY);
        return axios.post('/api/users/logout', null, config);
    }

    getCurrentUser = () => { 
        const config = { headers: authHeader() };
        return axios.get('/api/users/authenticated/current', config);
    }

    getUser = (userId) => {
        const config = { headers: authHeader() };
        return axios.get(`/api/users/${userId}`, config);
    }

    update = (userId, details) => {
        const config = { headers: authHeader() };
        return axios.put(`/api/users/${userId}`, details, config);
    }

    getByName = (name) => {
        const config = { headers: authHeader() };
        return axios.get(`/api/users?name=${name}`, config);
    }

    newDirectMessage = (userId) => {
        const config = { headers: authHeader() };
        return axios.put(`/api/users/directMessage/${userId}`, null, config);
    }

    searchUsers = (username) => {
        const config = { headers: authHeader() };
        return axios.get(`/api/users/search/${username}`, config);
    }
}