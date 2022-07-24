const path = require('path')

export const config =   {
  path: {
    controllersApi: {
      v1: {
        public: path.resolve("./modules/controllers/api/v1/publicController"),
      },
    },
    helper: path.resolve('./modules/helpers'),
    model: path.resolve('./modules/models'),
    middleware: path.resolve('./modules/routes/middlewares'),
    controller: path.resolve('./modules/controllers'),
    api: path.resolve('./modules/routes/api/public'),
  }
}
