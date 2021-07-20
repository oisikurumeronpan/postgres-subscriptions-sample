import fs from 'fs';
import { join } from 'path';

import { gql } from 'apollo-server';
import { resolvers } from './resolvers';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import cors from 'cors';
import { createPubSub } from './pubsub';

const typeDefs = gql(fs.readFileSync(join(__dirname, '../schema.graphql'), 'utf8'));

(async function () {
  const app = express();

  app.use(
    cors({
      origin: 'https://studio.apollographql.com',
      optionsSuccessStatus: 200,
    })
  );

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  await createPubSub();

  const server = new ApolloServer({ schema });
  await server.start();
  server.applyMiddleware({ app });

  SubscriptionServer.create({ schema, execute, subscribe }, { server: httpServer, path: server.graphqlPath });

  const PORT = 4000;
  httpServer.listen(PORT, () => console.log(`🚀Server is now running on http://localhost:${PORT}/graphql`));
})();
