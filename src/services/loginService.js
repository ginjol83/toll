import puppeteer from 'puppeteer'
import cheerio   from 'cheerio'

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
    const cookies = await page.cookies();
    await page.goto(url+'tomas.php')
    
    // Obteniendo todo el HTML de la página
    const html = await page. content();
    
   

    const $ = cheerio.load(html);
    const table = $('table#example');
    const rows = [];

    await table.find('tbody tr').each((i, row) => {
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

    const tableJson = JSON.stringify(rows, null, 2)

    const jsonObj = JSON.parse(tableJson)
   
    await browser.close();

    let array = [] 

    await jsonObj.forEach(async (element) => {
        const data = await getPage(url+element.Turnos, cookies)
        element.Turnos = data

        array.push(element)

       // console.log(array)
    });

    return array
}

const getPage = async (url, cookies) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setCookie(...cookies);
    await page.goto(url);
    const html = await page. content();
    await browser.close();

    return tableToJson(html);
}


function tableToJson(html) {
    const $ = cheerio.load(html);
    const table = $('table#example');
    const headers = [];
    const data = [];

    // Get the table headers
    table.find('thead tr th').each((i, th) => {
        headers.push($(th).text().trim());
    });

    // Get the table data
    table.find('tbody tr').each((i, row) => {
        const row_data = {};
        $(row).find('td').each((j, cell) => {
            const key = headers[j];
            row_data[key] = $(cell).text().trim();
        });
        data.push(row_data);
    });

    return data;
}

export { login }