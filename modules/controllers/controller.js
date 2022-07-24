const releasesV = process.env.RELEASES_V;


export class Controller {
  showValidationErrors(req, res) {
    const errors = req.validationErrors();
    if (errors) {
      res.status(422).json({
        messages: errors.map((error) => ({
          field: error.param,
          message: error.msg,
        })),
        success: false,
        status: 422,
        v: releasesV,
      });
      return true;
    }
    return false;
  }

  ok(res, logcode, message, messageStatus = 100, status = 200) {
    return res.status(status).json({
      message: {
        message: message,
        field: null,
        logcode: logcode,
        status: messageStatus,
      },
      status: 200,
      success: true,
      v: releasesV,
    });
  }

  abort(res, status, logcode, message = null, messageStatus = null, field = null) {
    switch (status) {
      case 400:
        res.status(400).json({
          message: {
            message: message || "!درخواست  وارد شده اشتباه است",
            field: field || null,
            logcode: logcode,
            status: messageStatus,
          },
          status: 400,
          success: false,
          v: releasesV,
        });
        break;
      case 401:
        res.status(401).json({
          message: {
            message: message || "احراز هویت شما با خطا مواجه شده است",
            field: field || null,
            logcode: logcode,
            status: messageStatus,
          },
          status: 401,
          success: false,
          v: releasesV,
        });
        break;
      case 403:
        res.status(403).json({
          message: {
            message:
              message || " ! دسترسی به روتی که شما در تلاش برای رسیدن به آن هستید به دلایل مختلفی امکان ‌پذیر نیست",
            field: field || null,
            logcode: logcode,
            status: messageStatus,
          },
          status: 403,
          success: false,
          v: releasesV,
        });
        break;
      case 404:
        res.status(404).json({
          message: {
            message: message || "!برای اطلاعات وارد شده دیتایی یافت نشد",
            field: field || null,
            logcode: logcode,
            status: messageStatus,
          },
          status: 404,
          success: false,
          v: releasesV,
        });
        break;
      case 422:
        res.status(422).json({
          message: {
            message: message || "!اطلاعات وارد شده صحیح نیست",
            field: field || null,
            logcode: logcode,
            status: messageStatus,
          },
          status: 422,
          success: false,
          v: releasesV,
        });
        break;
      case 500:
        res.status(500).json({
          message: {
            message: message || "!خطای سرور",
            field: field || null,
            logcode: logcode,
            status: messageStatus,
          },
          status: 500,
          success: false,
          v: releasesV,
        });
        break;
      default:
        break;
    }
    return "";
  }
};
