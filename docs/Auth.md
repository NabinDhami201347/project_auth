```ts
/**
 * Wrap the interceptor in a function, so that i can be re-instantiated
 */
function createAxiosResponseInterceptor() {
  const interceptor = axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Reject promise if usual error
      if (error.response.status !== 401) {
        return Promise.reject(error);
      }

      /*
       * When response code is 401, try to refresh the token.
       * Eject the interceptor so it doesn't loop in case
       * token refresh causes the 401 response.
       *
       * Must be re-attached later on or the token refresh will only happen once
       */
      axios.interceptors.response.eject(interceptor);

      return axios
        .post("/api/refresh_token", {
          refresh_token: this._getToken("refresh_token"),
        })
        .then((response) => {
          saveToken();
          error.response.config.headers["Authorization"] = "Bearer " + response.data.access_token;
          // Retry the initial call, but with the updated token in the headers.
          // Resolves the promise if successful
          return axios(error.response.config);
        })
        .catch((error2) => {
          // Retry failed, clean up and reject the promise
          destroyToken();
          this.router.push("/login");
          return Promise.reject(error2);
        })
        .finally(createAxiosResponseInterceptor); // Re-attach the interceptor by running the method
    }
  );
}
createAxiosResponseInterceptor(); // Execute the method once during start
```

```ts
import axios from 'axios'

const baseURL = process.env.NODE_ENV === 'production' ? '/api' : http://localhost:5000/api`

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000
})

axiosInstance.interceptors.response.use(response => response, error => {
  const { response, config } = error

  if (response.status !== 401) {
    return Promise.reject(error)
  }

  // Use a 'clean' instance of axios without the interceptor to refresh the token. No more infinite refresh loop.
  return axios.get('/auth/refresh', {
    baseURL,
    timeout: 30000
  })
    .then(() => {
      // If you are using localStorage, update the token and Authorization header here
      return axiosInstance(config)
    })
    .catch(() => {
      return Promise.reject(error)
    })
})

export default axiosInstance
```
