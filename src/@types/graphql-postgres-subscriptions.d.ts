declare module 'graphql-postgres-subscriptions' {
  import { PubSub, PubSubOptions } from 'graphql-subscriptions';
  import { Client } from 'pg';

  class PostgresPubSub extends PubSub {
    constructor(options?: PubSubOptions & { client?: Client });
  }
}
