require('dotenv').config(),
require('colors');
const config = require('config');
let mysql = require('mysql2/promise');
const yaml = require('js-yaml');
const fs   = require('fs');
let env_variables = [];
const serviceName = config.get('service-name');

(async ()=>{
    try {
        const PlanloaderConfigDbHost = process.env.PlanloaderConfigDbHost;
        const PlanloaderConfigDbUsername = process.env.PlanloaderConfigDbUsername;
        const PlanloaderConfigDbPassword = process.env.PlanloaderConfigDbPassword;
        const PlanloaderConfigDbDatabase = process.env.PlanloaderConfigDbDatabase;

        if(!PlanloaderConfigDbHost || !PlanloaderConfigDbPassword){
            throw 'Planloader secret db credentials not found form envirenment variables'
        }
        let connection = await mysql.createConnection({
            host: PlanloaderConfigDbHost,
            user: PlanloaderConfigDbUsername,
            password: PlanloaderConfigDbPassword,
            database: PlanloaderConfigDbDatabase
        });

        if(!connection) { throw 'Failed to connect to PlanloaderConfigDb'}

        getCustomEnvVariablesArray();
        const [rows] = await connection.execute(`SELECT * FROM config WHERE config.key in (${env_variables.join(',')})`);
        let envContent = '';
        rows.forEach(e=>{
            if(process.env.PlanloaderConfigEnv == 'development'){
                envContent+=`${e.key}=${e.development}\n`
            }
            else if(process.env.PlanloaderConfigEnv == 'test'){
                envContent+=`${e.key}=${e.test}\n`
            }
            else{
                envContent+=`${e.key}=${e.production}\n`
            }
        });
        fs.writeFileSync('.env',envContent);
        console.log('.ENV file updated now restarting server'.green);
        console.log(`Stopping/Deleting running instances of ${serviceName}`.yellow);
        console.log('Running restart-pm2.sh'.blue)
        process.exit(1);
    } catch (err) {
        console.log(err.toString().red);
        process.exit(1);
    }
})();

function extractValuesFromObject(obj){
        for(let prop in obj){
            if(obj[prop].constructor === String){
                env_variables.push(`'${obj[prop]}'`)
            }
            else {
                extractValuesFromObject(obj[prop])
            }
        }
}

function getCustomEnvVariablesArray (){
    const doc = yaml.load(fs.readFileSync('config/custom-environment-variables.yml', 'utf8'));
    extractValuesFromObject(doc)
}

