import constant from './constants'
module.exports = {
    setToken(token) { 
        localStorage.setItem(constant.TOKEN, 'Bearer ' + token)
    },
    getToken() { 
        return localStorage.getItem(constant.TOKEN)
    },
    rmToken() { 
        localStorage.removeItem(constant.TOKEN)
    }
}