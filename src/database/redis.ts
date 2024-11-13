import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://redis:6379',
});

export const initRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Conexão com Redis bem-sucedida');
  } catch (err) {
    console.error('Erro ao conectar ao Redis:', err);
    process.exit(1); // Encerra o processo se a conexão falhar
  }
};

export default redisClient;
