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
    console.log('Conexão com PostgreSQL bem-sucedida');
  } catch (err) {
    console.error('Erro ao conectar ao PostgreSQL:', err);
    process.exit(1); // Encerra o processo se a conexão falhar
  }
};

export default pgClient;
