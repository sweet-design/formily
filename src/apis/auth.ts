import xhr from '@/service/xhr';
import config from '@/config/default.config';

/**
 * 获取token信息
 * @param body 获取token时所需要的参数
 */
export const getTokenInfo = (body: any) =>
  xhr({
    url: '/Auth/Login/RequestToken',
    body,
    host: config.authConfig.authority,
    json: true,
    headers: {
      tenant: 'BQ',
    },
  });
