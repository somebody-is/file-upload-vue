module.exports = {
    devServer:{
        Proxy:{
            '/api':{
                target: 'http://local:8090',
                pathRewrite:{'^/api':"/"}
            }
        }
    }
}