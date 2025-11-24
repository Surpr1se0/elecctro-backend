import bcrypt from "bcrypt";
import Jwt from "@hapi/jwt";
import { db } from '../db/db.js';
import { registerSchema, loginSchema, updateUserSchema } from "./authValidation.js";

const SALT_ROUNDS = 10;

export function registerAuthRoutes(server) {
  // POST /users
  server.route({
    method: "POST",
    path: "/users",
    options: {
      description: "Register a new user",
      notes:
        "Receives the user details and creates a new account, returning a JWT token",
      tags: ["api"],
      validate: {
        payload: registerSchema,
        failAction: (request, h, err) => {
          h.response({ error: "invalid user payload", details: err.details })
            .code(400)
            .takeover();
        },
      },
      handler: async (request, h) => {
        const { email, password, name } = request.payload;

        // check if it exists
        const existing = await db("users").where({ email }).first();
        if (existing) {
          return h.response({ error: "Email already registered" }).code(409);
        }

        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

        const [user] = await db("users")
          .insert({ email, password_hash, name })
          .returning(["id", "email", "name", "created_at"]);

        const token = Jwt.token.generate(
          {
            userId: user.id,
            email: user.email,
          },
          {
            key: "some_shared_secret",
            algorithm: "HS256",
          }
        );

        return h
          .response({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              createdAt: user.created_at,
            },
            token,
          })
          .code(201);
      },
    },
  });


  // POST /login
  server.route({
    method: 'POST',
    path: '/login',
    options: {
      description: 'Login a user',
      notes: 'This route should receive a username and password, authenticate a user, and return a JWT token',
      tags: ['api'],
      validate: {
        payload: loginSchema,
        failAction: (request, h, err) => 
          h
          .response({error: 'invalid login payload', details: err.details})
          .code(400)
          .takeover()
      }
    },
    handler: async(request, h) => {
      const {email, password} = request.payload;

      const user = await db('users').where({email}).first();
      if(!user){
        return h.response({error: 'invalid email or password'}).code(401);
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return h.response({error: "Invalid email or password"}).code(401);
      }

      const token = Jwt.token.generate(
        {
          user: user.id,
          email: user.email
        },
        {
          key: 'some_shared_secret',
          algorithm: 'HS256'
        }
      );

      return h
        .response({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          }
        }).code(200);
    }
  });


  // POST /logout
  server.route({
    method: 'POST',
    path: '/logout',
    options: {
      description: 'Logout current user',
      notes: 'This route should invalidate the credentials of the authenticated user',
      tags: ['api'],
      auth: 'my_jwt_strategy' 
    },
    handler: async (request, h) => {
      // Server side has no action
      // localstorage, cache must delete the token
      return h.response({message: 'Logged out'}).code(200);
    }
  });


  // GET /me
  server.route({
    method: 'GET',
    path: '/me',
    options: {
      description: 'List the user details',
      notes: 'List the authenticated user details',
      tags: ['api'],
      auth: 'my_jwt_strategy'
    },
    handler: async (request, h) => {
      const {userId} = request.auth.credentials;

      const user = await db('users')
        .where({id: userId}).first();

      if (!user){
        return h.response({error: 'User was not found'}).code(404);
      }

      return h.response({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at
      });
    }
  });

  // PATCH /me
  server.route({
    method: 'PATCH',
    path: '/me',
    options: {
      description: 'Update the authenticated user',
      notes: 'This route should edit the details of the authenticated user',
      tags: ['api'],
      auth: 'my_jwt_strategy',
      validate: {
        payload: updateUserSchema,
        failAction: (request, h, err) => 
          h
          .response({error: 'invalid payload', details: err.details})
          .code(400)
          .takeover()
      }
    },
    handler: async(request, h) => {
      const {userId} = request.auth.credentials;
      const {email, name, password} = request.payload;
      const updateData = {};

      if (email){
        const existing = await db('users')
          .where({email})
          .andWhereNot({id: userId})
          .first();

          if(existing) {
            return h.response({error: 'Email already taken'}).code(409);
          }
        updateData.email = email;
      }

      if(name){
        updateData.name = name;
      }

      if(password){
        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
        updateData.password_hash = password_hash;
      }

      if(Object.keys(updateData).length === 0){
        return h
          .response({error: 'Nothing to update'}).code(400);
      }

      const [updated] = await db('users')
        .where({id: userId})
        .update(updateData)
        .returning(['id', 'email', 'name', 'created_at']);
      
      return h.response({
        id: updated.id,
        email: updated.email,
        name: updated.name,
        createdAt: updated.created_at,
      }).code(200);
    }
  });
}
