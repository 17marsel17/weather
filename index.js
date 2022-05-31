
import * as http from 'http';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const argv = yargs(hideBin(process.argv)).argv;

const APIKey = process.env.ACCESS_KEY;
const city = argv._;
const url = `http://api.weatherstack.com/current?access_key=${APIKey}&query=${city}`;

http.get(url, (res) => {
    const { statusCode } = res;
    if (statusCode !== 200) {
        console.log(`statusCode: ${statusCode}`);
        return;
    }

    let rowData = ''
    res.on('data', (chunk) => {
        rowData += chunk;
    })
    res.on('end', () => {
        let data = JSON.parse(rowData);

        if (data.success != undefined && data.success == false) {
            console.error(`Error code: ${data.error.code} (${data.error.type})`);
            return;
        }
        console.log(`Current temperature in ${data.location.name} is ${data.current.temperature}`);
    })
}).on('error', (err) => {
    console.error(err);
});
