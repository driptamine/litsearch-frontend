/**
 *
 * @param {username, password} creds
 */
export const login = creds => {
    //return axios.post(loginURl, creds).
      // then((response: any) => {
      //   return response.data;
      // })
      // .catch(function(error: any) {
      //   return error;
      // });
    return new Promise((resolve, reject) => {
        const { username, password } = creds

        if (username === 'admin' && password === 'admin') {
            const user = {
                username,
                token: '123abcd1234'
            }
            localStorage.setItem('user', JSON.stringify(user))
            resolve(user)
        } else {
            reject({
                msg: 'Invalid Creds'
            })
        }
    })
}

export const logout = () => {
    localStorage.removeItem('user')
}

export const checkUser = () => {
    return JSON.parse(localStorage.getItem('user'))
}
