exports.response = async (res, msg, logcode, status, data = null, msgStatus = 100, field = null) => {
    let success = false;
    if (status === 200 || status === 201) success = true;
    return res.status(status).json({
      message: {
        field: field,
        message: msg,
        logcode: logcode,
        status: msgStatus,
      },
      status,
      success,
      data: data || null,
      v: releasesV,
    });
  };