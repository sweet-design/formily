import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import showStatus from './httpErrorHandler';
import qs from 'querystring';

const service: any = axios.create({
  baseURL: 'http://192.168.1.211:9099',
  headers: {
    get: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    post: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  },
  method: 'post',
  withCredentials: false,
  timeout: 30000,
  transformRequest: [
    data => {
      data = JSON.stringify(data);
      return data;
    },
  ],
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true;
  },
  transformResponse: [
    data => {
      if (typeof data === 'string' && data.startsWith('{')) {
        data = JSON.parse(data);
      }
      return data;
    },
  ],
});

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.headers['Content-Type'] == 'multipart/form-data') {
      config.transformRequest = [];
    }

    if (config.headers['Content-Type'] == 'application/x-www-form-urlencoded') {
      config.transformRequest = [
        data => {
          data = qs.stringify(data);
          return data;
        },
      ];
    }

    config.headers.Authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyTW9kZWwiOiJ7XCJVc2VySWRcIjo0NjkyMzk4NjA3OTc0MTc4NTMyLFwiQWNjb3VudElkXCI6NTA1NjkwNjgwNjE3NzE1MjA1NSxcIkxvZ2luTmFtZVwiOlwiU1dDMDA1NTBcIixcIlRlbmFudElkXCI6MCxcIlVzZXJUeXBlXCI6MCxcIkNvbXBJZFwiOjEwMDAwLFwiT3JnSWRcIjo1MzEyOTkxMzQyMTA0NjM1MjcwLFwiUG9zdElkXCI6MCxcIlJhbmtDb2RlXCI6XCJTTVwiLFwiTGFuZ1wiOm51bGx9IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlNXQzAwNTUwIiwianRpIjoiNDY5MjM5ODYwNzk3NDE3ODUzMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjIwMjEvOS8xOCAxNTowMjo1NyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlNNIiwibmJmIjoxNjMxOTQxMzc3LCJleHAiOjE2MzE5NDg1NzcsImlzcyI6IkNPSE8iLCJhdWQiOiJQZXJtaXNzaW9uIn0.9mKOt6GnU0VVHYo7KqeJjWB58qkkZePyX8jQf3UR790';

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const status = response.status; // 服务器状态码
    if (status < 200 || status >= 300) {
      showStatus(status);
    }

    return response.data;
  },
  (error: any) => {
    showStatus(error.status);

    return Promise.reject(error);
  },
);

export default service;
