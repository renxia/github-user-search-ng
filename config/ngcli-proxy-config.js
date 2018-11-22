const anyParse = require('co-body');
const apiMock = require('@lzwme/simple-mock');
const chalk = require('chalk');
const apiProxyList = {
  '/users/**': 'https://api.github.com/',
};

/**
 * 详细配置参考：https://www.npmjs.com/package/http-proxy-middleware
 */
const proxyCfg = Object.keys(apiProxyList).reduce((pCfg, key) => {
  const  proxyTarget = apiProxyList[key];

  pCfg[key] = {
    target: proxyTarget,
    changeOrigin: true,
    onProxyRes(proxyRes, req, res) {
      apiMock.saveApi(req, res, proxyRes.headers['content-encoding']);
    },
    async onProxyReq(proxyReq, req, res) {
      // 尝试解码 post 请求参数至 req.body
      if (!req.body && proxyReq.getHeader('content-type')) {
        try {
          req.body = await anyParse({req});
        } catch(err) {
          // console.log(err);
        }
      }

      apiMock.render(req, res).then(isMocked => {
        if (!isMocked) {
          console.log(chalk.cyan('[apiProxy]'), req._parsedUrl.pathname, '\t', chalk.yellow(proxyTarget));
        }
      });
    },

    // pathRewrite?: { [regexp: string]: string } | ((path: string, req: http.IncomingMessage) => string);
    // router?: { [hostOrPath: string]: string } | ((req: http.IncomingMessage) => string);
    // logLevel?: // 'debug' | 'info' | 'warn' | 'error' | 'silent';
    // logProvider?(provider: LogProvider): LogProvider;

    // onError?(err: Error, req: http.IncomingMessage, res: http.ServerResponse): void;
    // onProxyRes?(proxyRes: http.IncomingMessage, req: http.IncomingMessage, res: http.ServerResponse): void;
    // onProxyReq?(proxyReq: http.ClientRequest, req: http.IncomingMessage, res: http.ServerResponse): void;
    // onProxyReqWs?(proxyReq: http.ClientRequest, req: http.IncomingMessage, socket: net.Socket, options: httpProxy.ServerOptions, head: any): void;
    // onOpen?(proxySocket: net.Socket): void;
    // onClose?(res: http.IncomingMessage, socket: net.Socket, head: any): void;

    // target?: string;
    // forward?: string;
    // agent?: http.Agent;
    // ssl?: tls.TlsOptions;
    // ws?: boolean;
    // xfwd?: boolean;
    // secure?: boolean;
    // toProxy?: boolean;
    // prependPath?: boolean;
    // ignorePath?: boolean;
    // localAddress?: string;
    // changeOrigin?: boolean;
    // auth?: string;
    // hostRewrite?: string;
    // autoRewrite?: boolean;
    // protocolRewrite?: string;
    // cookieDomainRewrite?: false | string | { [domain: string]: string };
    // headers?: { [header: string]: string };
    // proxyTimeout?: number;
  };
  return pCfg;
}, {});

// console.log(proxyCfg);
module.exports = proxyCfg;
