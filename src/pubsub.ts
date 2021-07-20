import { PostgresPubSub } from 'graphql-postgres-subscriptions';
import { Client } from 'pg';

export let pubsub: PostgresPubSub;

export async function createPubSub() {
  const client = new Client({
    connectionString: 'postgres://postgres:password@db:5432/postgres',
  });

  console.log('start connecting to postgres!!!');

  await client.connect();

  console.log('connected to postgres!!!');

  pubsub = new PostgresPubSub({ client });
}
