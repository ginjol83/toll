const puppeteer = require('puppeteer');
const fs = require('fs');
const cheerio = require('cheerio');

const login = async (url, username, password) => {
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
    
    await browser.close();


    const $ = cheerio.load(html);
    const table = $('table#example');
    const rows = [];

    table.find('tbody tr').each((i, row) => {
        const cells = [];
        $(row).find('td').each((j, cell) => {
            if (j === 4 || j === 5 || j === 6 || j === 7 ) { // Si es la celda "Turnos"
                const link = $(cell).find('a').attr('href');
                cells.push(link);
            } else {
                cells.push($(cell).text().trim());
            }
        });
                rows.push({
            'Cod.Contador': cells[0],
            'Parcela': cells[1],
            'Superficie (Hg)': cells[2],
            'Cultivo': cells[3],
            'Turnos': cells[4],
            'Inf.Caudal': cells[5],
            'Estado': cells[6],
            'Localización': cells[7]
        });
    });



console.log(JSON.stringify(rows, null, 2));




}





