import Joi from "joi";
import mongoose from "mongoose";

const objectIdExtension = {
  type: "objectId",
  base: Joi.string(),
  messages: {
    "objectId.invalid": "{{#label}} must be a valid ObjectId",
  },
  validate(value, helpers) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return { value, errors: helpers.error("objectId.invalid") };
    }
    return { value };
  },
};

const ExtendedJoi = Joi.extend(objectIdExtension);

export default ExtendedJoi;
