import request from './request';

export const mergeFile = (chunk)=>{
    return request({
        url: '/uploader/mergeFile',
        method:'post',
        data: chunk
    })
}