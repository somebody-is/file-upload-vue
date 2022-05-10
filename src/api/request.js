import axios from 'axios';

const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: '/api',
    timeout: 5000
});



export default service;