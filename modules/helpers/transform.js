const expiresInUser = process.env.EXPIRESIN_USER_HOUR;
const expiresInSuperAdmin = process.env.EXPIRESIN_SUPER_ADMIN_HOUR;
const config = require("../config");
const { generateToken } = require(`${config.path.helper}/generateToken`);
const TokenModel = require(`${config.path.model}/token`);
module.exports.transform = async (result, item, withPaginate = false, type = null, ip = null, deviceName = null) => {
  if (withPaginate) {
    let items = [];
    if (result.docs.length != 0) {
      for (let index = 0; index < result.docs.length; index++) {
        const element = result.docs[index];
        items.push(itemTransform(element, item));
        if (index === result.docs.length - 1) {
          return { items, ...paginateItem(result) };
        }
      }
    } else {
      return { items: null, ...paginateItem(result) };
    }
  } else {
    if (type !== null) {
      const token = await Token(result, type, ip, deviceName);
      return { ...itemTransform(result, item), ...token };
    } else {
      return itemTransform(result, item);
    }
  }
  function itemTransform(result, item) {
    let items = {};
    for (let index = 0; index < item.length; index++) {
      const element = item[index];
      items = { ...items, [element.substring(1)] : eval("result" + element) };
      if (index === item.length - 1) {
        return items;
      }
    }
  }
  async function Token(result, type, ip, deviceName) {
    try {
      let liveTime = new Date();
      const token = await generateToken();
      let values = { userId: result._id, lastIp: ip, deviceName, token };
      if (type === "user") liveTime.setHours(liveTime.getHours() + Number(expiresInUser));
      if (type === "superAdmin") liveTime.setHours(liveTime.getHours() + Number(expiresInSuperAdmin));
      values = { ...values, liveTime };
      await TokenModel.create(values);
      return { token };
    } catch (error) {
      console.log(error);
      return { token: null };
    }
  }

  function paginateItem(result) {
    return {
      total: result.totalDocs,
      limit: result.limit,
      totalPages: result.totalPages,
      page: result.page,
      pagingCounter: result.pagingCounter,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
    };
  }
};
