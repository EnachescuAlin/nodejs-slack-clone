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

    update = (userId, details) => {
        const config = { headers: authHeader() };
        return axios.put(`/api/users/${userId}`, details, config);
    }
}