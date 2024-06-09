import { login } from "./src/services/loginService.js";
import { config } from "./src/config/config.js";

const jsonLogged = login(config.url, config.user, config.pass);

jsonLogged.then((data) => {
    console.log(data);
});