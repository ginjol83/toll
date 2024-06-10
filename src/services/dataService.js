import puppeteer from 'puppeteer'
import axios from 'axios';

const dataScrapp = async (jsonData, config) => {

    const { url, username, password } = config;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Usando los selectores correctos para los campos de entrada
    await page.type('#usuario', username);
    await page.type('#pass', password);

    // Usando el selector correcto para el botón de inicio de sesión
    await Promise.all([
        page.waitForNavigation(),
        page.click('.submitLink'),
    ]);

    await page.goto(url+'tomas.php')
    

    // Obteniendo todo el HTML de la página
    const html = await page. content();


    //TODO obtener los datos de cada sección y montar el JSON de respuesta
    console.log('jsonData', jsonData);
    /*
    jsonData.map(result => {
        console.log(result.Estado);
    })
    */


    await browser.close();    


}

export { dataScrapp }





