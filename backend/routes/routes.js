import { db } from '../db/db.js';
import { 
  createTodoSchema,
  listTodosQuerySchema, 
  patchTodoSchema, 
  todoIdParamsSchema 
} from './validation.js';

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
  // POST -- /todos
  server.route({
    method: 'POST',
    path: '/todos',
    options: {
      description: 'Create a new todo item',
      notes: 'Creates a todo with state INCOMPLETE and returns the created item',
      tags: ['api'],
      auth: 'my_jwt_strategy',
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
      const {userId} = request.auth.credentials;

      const [inserted] = await db('todos')
        .insert({
          description, 
          state: 'INCOMPLETE',
          user_id: userId
        })
        .returning(['id', 'state', 'description', 'created_at', 'completed_at']);
      return h.response(mapTodoRow(inserted)).code(201);
    }
  });


  // GET /todos?filter=<STATE>&orderBy=<FIELD>
  server.route({
    method: 'GET',
    path: '/todos',
    options: {
      description: 'List the todo items',
      notes: 'List the todo items considering the conditions imposed by the query parameters',
      tags: ['api'],
      auth: 'my_jwt_strategy',
      validate: {
        query: listTodosQuerySchema,
        failAction: (request, h, err) => 
          h
          .response({error: 'Invalid query parameters', details: err.details})
          .code(400)
          .takeover()
      }
    },
    handler: async(request, h) => {
      const {filter, orderby} = request.query;
      const {userId} = request.auth.credentials;

      let q = db('todos').where({user_id: userId});

      if (filter === 'COMPLETE') {
        q = q.where('state', 'COMPLETE'); 
      } else if (filter === 'INCOMPLETE') {
        q = q.where('state', 'INCOMPLETE');
      }

      const orderMap = {
        DESCRIPTION: 'description',
        CREATED_AT: 'created_at',
        COMPLETED_AT: 'completed_at'
      };

      const orderColumn = orderMap[orderby] || 'created_at';

      q = q.orderBy(orderColumn, 'asc', 'last');

      const rows = await q.select(
        'id', 
        'state',
        'description',
        'created_at',
        'completed_at'
      );
      return h.response(rows.map(mapTodoRow)).code(200);
    }
  });


  // PATCH /todo/{id}
  server.route({
    method: 'PATCH',
    path: '/todo/{id}',
    options: {
      description: 'Edit an item on the todo list',
      notes: 'Edit an item, referenced by the id using the URL parameter {id}', 
      tags: ['api'],
      auth: 'my_jwt_strategy',
      validate: {
        params: todoIdParamsSchema,
        payload: patchTodoSchema,
        failAction: (request, h, err) => 
          h
            .response({error: 'Invalid request', details: err.details})
            .code(400)
            .takeover()
      }
    },
    handler: async(request, h) => {
      const {id} = request.params;
      const {state, description} = request.payload; 
      const {userId} = request.auth.credentials;

      const existing = await db('todos')
        .where({id, user_id: userId})
        .first();

      if (!existing){
        return h.response({error: 'Item is not found'}).code(400);
      }

      if (description !== undefined && existing.state === 'COMPLETE') {
        return h
        .response({error: 'Cannot change description of a COMPLETE item'})
        .code(400);
      }

      const updateData = {};

      if(description !== undefined){
        updateData.description = description;
      } 

      if (state !== undefined){
        updateData.state = state;

        if(state === 'COMPLETE'){
          updateData.completed_at = db.fn.now();
        } else if (state === 'INCOMPLETE'){
          updateData.completed_at = null;
        }
      }

      const [updated] = await db('todos')
        .where({id})
        .update(updateData)
        .returning(['id', 'state', 'description', 'created_at', 'completed_at']);

      return h.response(mapTodoRow(updated)).code(200);
    }
  })


  // DELETE -- /todo/{id}
  server.route({
    method: 'DELETE',
    path: '/todo/{id}',
    options: {
      description: 'Remove an item from the todo list',
      notes: 'Removes an item from the todo, referenced by the id using the URL parameter {id}',
      tags: ['api'],
      auth: 'my_jwt_strategy',
      validate: {
        params: todoIdParamsSchema,
        failAction: (request, h, err) => 
          h
            .response({error: 'Invalid id parameter', details: err.details})
            .code(400)
            .takeover()
      }
    },
    handler: async(request, h) => {
      const {id} = request.params; 
      const {userId} = request.auth.credentials;

      const deletedCount = await db('todos')
        .where({id, user_id: userId})
        .delete();

      if (deletedCount === 0){
        return h.response({error: 'Item not found'}).code(404);
      }

      return h.response().code(204);
    }
  });
}