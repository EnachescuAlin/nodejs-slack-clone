import { TOKEN_KEY } from '../constants';

export default function authHeader() {
    let token = JSON.parse(localStorage.getItem(TOKEN_KEY));

    if (token) {
        return { 'Authorization': 'Bearer ' + token };
    } else {
        return {};
    }
}