import { ApolloServer } from "@apollo/server";
import { resolvers } from "../../../graphql/resolvers";
import { typeDefs } from "../../../graphql/schema";
import { contextFactory } from "@/lib/context";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

const server = new ApolloServer({
  resolvers,
  typeDefs,
  csrfPrevention: true,
  cache: "bounded",

  //   plugins: [ApolloServerPluginLandingPageDisabled()],
});

export default startServerAndCreateNextHandler(server, {
  context: async (req) => contextFactory(req),
});
