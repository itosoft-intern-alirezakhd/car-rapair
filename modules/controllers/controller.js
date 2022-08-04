const releasesV = process.env.RELEASES_V;


export class Controller {
  showValidationErrors(res , errors) {
    if (errors.array().length > 0) {
      return res.status(422).json({
        messages: errors.array().map((error) => ({
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
      message: message,
      status: 200,
      success: true,
      v: releasesV,
    });
  }

  abort(res, status, logcode, message = null) {
    switch (status) {
      case 400:
        res.status(400).json({
          message:  message || "!درخواست  وارد شده اشتباه است",
          status: 400,
          success: false,
          v: releasesV,
        });
        break;
      case 401:
        res.status(401).json({
          message: message || "احراز هویت شما با خطا مواجه شده است",
          status: 401,
          success: false,
          v: releasesV,
        });
        break;
      case 403:
        res.status(403).json({
          message: message || " ! دسترسی به روتی که شما در تلاش برای رسیدن به آن هستید به دلایل مختلفی امکان ‌پذیر نیست",
          status: 403,
          success: false,
          v: releasesV,
        });
        break;
      case 404:
        res.status(404).json({
          message:  message || "!برای اطلاعات وارد شده دیتایی یافت نشد",
          status: 404,
          success: false,
          v: releasesV,
        });
        break;
      case 422:
        res.status(422).json({
          message: message || "!اطلاعات وارد شده صحیح نیست",
          status: 422,
          success: false,
          v: releasesV,
        });
        break;
      case 500:
        res.status(500).json({
          message: message || "!خطای سرور",
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
