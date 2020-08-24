import http from './http'

const routers = [ 
    'login', 
    'register', 
    'resetPass', 
]

const getMethodArr = []

const ApiService = {}
routers.map(item => {
   ApiService[item]  = function(data, success, fail, complete) {
        return http.post('/'+item, data, success, fail, complete)
    }
})

module.exports = ApiService

