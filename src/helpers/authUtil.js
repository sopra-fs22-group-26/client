import {api} from 'helpers/api';

export class AuthUtil {

    // request a new token by using the refresh token. if the request is successful, returns true, if not returns false
    static async refreshToken(refreshToken) {
        try {
            const requestBody = JSON.stringify({refreshToken});
            const response = await api.post("/auth/refreshtoken", requestBody)
            localStorage.setItem("token", response.data.token)
            return true
        } catch (err) {
            return false
        }
    }

}
