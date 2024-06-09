import { login } from "./src/services/loginService.js";
import { config } from "./src/config/config.js";
import { dataScrapp } from "./src/services/dataService.js";

const jsonLogged = login(config.url, config.user, config.pass);

jsonLogged.then((data) => {
    dataScrapp(JSON.parse(data), config);
  

});