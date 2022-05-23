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
            if (err.response.status === 401) {
                const requestBody = JSON.stringify({username});
                await api.post('/auth/logout', requestBody);

                // Clear local cache and navigate to login page
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('id');
                localStorage.removeItem('name');
                localStorage.removeItem('username');
                history.push('/login');
            }
            return false
        }
    }

}
