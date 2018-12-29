import axios from 'axios';
import authHeader from '../helpers/authHeader';

export default class ChannelService {
    get = (id) => {
        const config = { headers: authHeader() };
        return axios.get(`/api/channels/${id || ''}`, config);
    }

    add = (channel) => { 
        const config = { headers: authHeader() };
        return axios.post('/api/channels', channel, config);
    }

    update = (id, channel) => {
        const config = { headers: authHeader() };
        return axios.put(`/api/channels/${id}`, channel, config);
    }

    addParticipant = (channelId, participantId) => {
        const config = { headers: authHeader() };
        return axios.post(`/api/channels/${channelId}/participants/${participantId}`, null, config);
    }

    removeParticipant = (channelId, participantId) => {
        const config = { headers: authHeader() };
        return axios.delete(`/api/channels/${channelId}/participants/${participantId}`, null, config);
    }
}