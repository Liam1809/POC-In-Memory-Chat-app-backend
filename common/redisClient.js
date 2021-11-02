import Redis from 'redis';
import util from 'util';

// create Redis client
const client = Redis.createClient();

// bind built-in Redis methods with created client
export const set = util.promisify(client.set).bind(client);
export const setex = util.promisify(client.setex).bind(client);
export const get = util.promisify(client.get).bind(client);
export const mget = util.promisify(client.mget).bind(client);
export const del = util.promisify(client.del).bind(client);

const scan = util.promisify(client.scan).bind(client);

// Custom scan func to retrieve all keys
export const scanAll = async pattern => {
  const found = [];
  let cursor = '0';

  do {
    const reply = await scan(cursor, 'MATCH', pattern);

    cursor = reply[0];
    found.push(...reply[1]);
  } while (cursor !== '0');

  return found;
};
