import pkg from 'pg';
const { Client } = pkg;
const pgClient = new Client({
    host: 'postgres',
    port: 5432,
    user: 'user',
    password: 'password',
    database: 'microservice',
});
export const initPostgres = async () => {
    try {
        await pgClient.connect();
        console.log('Successfully connected to PostgreSQL');
    }
    catch (err) {
        console.error('Error connecting to PostgreSQL:', err);
        process.exit(1);
    }
};
export default pgClient;
