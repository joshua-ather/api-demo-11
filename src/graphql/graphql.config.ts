import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { join } from 'path';

export const graphqlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
  playground: true,
  sortSchema: true,
  persistedQueries: {
    cache: new InMemoryLRUCache(),
  },
  context: ({ req }) => ({ req }),
};
