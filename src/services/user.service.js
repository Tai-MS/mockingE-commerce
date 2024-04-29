import userData from '../persistence/usersData.js'

async function createUser(newUserInfo) {
    return userData.createUser(newUserInfo)
}


async function login(userCredentials, userSession) {
    return userData.login(userCredentials, userSession)
}

async function changePassword(userCredentials, userSession){
    return userData.changePassword(userCredentials, userSession)
}

export default {
    createUser,
    login,
    changePassword
}