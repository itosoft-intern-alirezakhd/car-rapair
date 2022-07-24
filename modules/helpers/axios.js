const axios = require('axios');
const qs = require('qs');

const axios = async (method ,  url , header , data) =>{
    try {
        const Data = qs.stringify(data);
        const axiosConfig = {
          method: method,
          url: url,
          headers: header,
          data: Data,
        };
        const response = await axios(axiosConfig);
        return response;
      } catch (err) {
        console.log(err);
        return false;
      }


}


module.exports = axios