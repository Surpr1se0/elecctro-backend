import Joi from 'joi';

// POST -- /todos
export const createTodoSchema = Joi.object({
  description: Joi.string().min(1).required()
});


// GET /todos?filter=<STATE>&orderBy=<FIELD>
export const listTodosQuerySchema = Joi.object({
  filter: Joi.string().valid('ALL', 'COMPLETE', 'INCOMPLETE').default('ALL'),
  orderBy: Joi.string().valid('DESCRIPTION', 'CREATED_AT', 'COMPLETED_AT').default('CREATED_AT')
});


// DELETE -- /todo/{id}
export const todoIdParamsSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});