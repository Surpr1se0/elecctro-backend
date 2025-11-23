import { db } from '../db/db.js';
import { createTodoSchema } from './validation.js';

// map from snake case to camelcase
function mapTodoRow(row) {
  return {
    id: row.id,
    state: row.state,
    description: row.description,
    createdAt: row.created_at,
    completedAt: row.completed_at
  };
}


export function setupRoutes(server) {
  // GET (test) - /
  server.route({
    method: "GET",
    path: "/",
    handler: (request, response) => {
      return "Hello World!";
    },
  });

  // POST -- /todos
  server.route({
    method: 'POST',
    path: '/todos',
    options: {
      description: 'Create a new todo item',
      notes: 'Creates a todo with state INCOMPLETE and returns the created item',
      tags: ['api'],
      validate: {
        payload: createTodoSchema,
        failAction: (request, h, err) => 
          h
          .response ({error: 'Invalid Payload', details: err.details})
          .code(400)
          .takeover()
      }
    },
    handler: async (request, h) => {
      const {description} = request.payload;

      const [inserted] = await db('todos')
        .insert({
          description, 
          state: 'INCOMPLETE'
        })
        .returning(['id', 'state', 'description', 'created_at', 'completed_at']);
      return h.response(mapTodoRow(inserted)).code(201);
    }
  });


}