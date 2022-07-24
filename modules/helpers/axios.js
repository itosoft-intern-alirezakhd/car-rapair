const axios = require('axios');
import qs from 'qs'

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


export default axios