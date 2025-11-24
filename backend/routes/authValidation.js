import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(1).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6),
  name: Joi.string().min(1),
});
