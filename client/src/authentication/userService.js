import axios from 'axios';
import authHeader from '../helpers/authHeader';
import { TOKEN_KEY } from '../constants';

const config = { headers: authHeader() };

export default class UserService {
    login = (loginDetails) => 
        axios.post('/api/users/login', loginDetails);
    
    register = (userDetails) => 
        axios.post('/api/users/register', userDetails);

    logoff = () => {
        localStorage.removeItem(TOKEN_KEY);
        return axios.post('/api/users/logout', null, config);
    }

    getCurrentUser = () => 
        axios.get('/api/users/authenticated/current', config);
}