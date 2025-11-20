import Joi from "joi";

const firstName = Joi.string().max(254).required().label("First Name");
const lastName = Joi.string().max(254).required().label("Last Name");
const userName = Joi.string().alphanum().min(3).max(30).required().label("Username");
const email = Joi.string().email().required().label("Email");
const password = Joi.string()
  .min(8)
  .max(50)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  .required()
  .label("Password")
  .messages({
    "string.pattern.base": "{{#label}} must contain at least one lowercase letter, one uppercase letter, and one number.",
    "string.min": "{{#label}} must be at least {#limit} characters long",
    "string.max": "{{#label}} must be at most {#limit} characters long",
  });

export const signUp = Joi.object({
  firstName: firstName,
  lastName: lastName,
  userName: userName,
  email,
  password,
});

export const signIn = Joi.object({
  email,
  password,
});
