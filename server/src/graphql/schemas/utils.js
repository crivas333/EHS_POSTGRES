import Joi from "./joi.js";

export const objectId = Joi.object({
  id: Joi.objectId().label("Object ID"),
});
