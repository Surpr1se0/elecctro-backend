import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import HapiSwagger from "hapi-swagger";

import { setupRoutes } from "./routes/routes.js"

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  // Setup swagger 
  const swaggerOptions = {
    info: {
      title: 'Test API documentation',
      version: '1.0.0',
    },
    documentationPath: '/docs' 
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger, 
      options: swaggerOptions
    }
  ]);

  // Register API routes 
  setupRoutes(server);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
