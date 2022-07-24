const path = require('path')

export default  {
  path: {
    controllersApi: {
      api: {
        public: path.resolve("./modules/controllers/api/publicController"),
      },
    },
    helper: path.resolve('./modules/helpers'),
    model: path.resolve('./modules/models'),
    middleware: path.resolve('./modules/routes/middleware'),
    controller: path.resolve('./modules/controllers'),
  }
}
