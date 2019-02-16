import {AsyncStorage} from "react-native";
export default {
    API_URL:"http://gomarket.ourgts.com/public/api/",
    Image_URL:"http://gomarket.ourgts.com/public/",
    USER_TOKEN: AsyncStorage.getItem('userToken_S'),
};
  