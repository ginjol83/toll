import { getTollosData } from "./src/services/tollosService.js";
import { config } from "./src/config/config.js";

const app = getTollosData(config.url, config.user, config.pass);

app.then((data) => {    
    console.log(data)
}).catch((err) => {
    console.log(err)
})
