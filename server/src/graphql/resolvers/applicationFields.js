import { getAllFields, createField, updateField, deleteField } from "../../models/applicationFields.js";

export default {
  Query: {
    getApplicationFields: async () => {
      return await getAllFields();
    },
  },

  Mutation: {
    addApplicationFields: async (root, args) => {
      await createField({
        fieldView: args.fieldView,
        fieldType: args.fieldType,
        fieldData: args.fieldData,
      });
      return await getAllFields();
    },

    updateApplicationFields: async (root, args) => {
      await updateField(args.id, args.fieldData);
      return await getAllFields();
    },

    deleteApplicationFields: async (root, args) => {
      await deleteField(args.id);
      return await getAllFields();
    },
  },
};
