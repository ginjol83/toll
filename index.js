import { login } from "./src/services/loginService.js";
import { config } from "./src/config/config.js";

const log = login(config.url, config.user, config.pass);

log.then((data) => {    
    console.log(data)
}).catch((err) => {
    console.log(err)
})
