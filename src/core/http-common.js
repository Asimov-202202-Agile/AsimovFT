import axios from "axios";
import authHeader from '@/services/auth-header'

export default axios.create({
    baseURL: 'https://app-service-asimov-202202-agile.azurewebsites.net/api/v1',
    headers: authHeader()
})