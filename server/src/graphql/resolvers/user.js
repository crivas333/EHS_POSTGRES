import { signUp, signIn } from "../schemas/index.js";
import { attemptSignIn, signOut, ensureSignedIn } from "../../auth.js";
import bcrypt from "bcryptjs";
import { User } from "../../models/index.js";

export default {
  Query: {
    me: async (root, args, { req }) => {
      ensureSignedIn(req);
      return User.findByPk(req.session.userId, {
        attributes: ["id", "firstName", "lastName", "userName", "email", "createdAt", "updatedAt"],
      });
    },

    openSession: async (root, args, { req }) => {
      if (!req.session.userId) return null;
      return User.findByPk(req.session.userId, {
        attributes: ["id", "firstName", "lastName", "userName", "email", "createdAt", "updatedAt"],
      });
    },

    user: async (root, { id }, { req }) => {
      ensureSignedIn(req);
      return User.findByPk(id, {
        attributes: ["id", "firstName", "lastName", "userName", "email", "createdAt", "updatedAt"],
      });
    },

    users: async (root, args, { req }) => {
      ensureSignedIn(req);
      return User.findAll({
        order: [["createdAt", "DESC"]],
        attributes: ["id", "firstName", "lastName", "userName", "email", "createdAt", "updatedAt"],
      });
    },

    isLoggedIn: (root, args, { req }) => !!req.session.userId,
    isConnected: () => true,
  },

  Mutation: {
    signUp: async (root, args, { req }) => {
      await signUp.validateAsync(args, { abortEarly: false });
      const hashedPassword = await bcrypt.hash(args.password, 10);

      const user = await User.create({
        firstName: args.firstName,
        lastName: args.lastName,
        userName: args.userName,
        email: args.email,
        password: hashedPassword,
      });

      req.session.userId = user.id;
      return user;
    },

    signIn: async (root, args, { req }) => {
      await signIn.validateAsync(args, { abortEarly: false });
      const user = await attemptSignIn(User, args.email, args.password);
      req.session.userId = user.id;

      return User.findByPk(user.id, {
        attributes: ["id", "firstName", "lastName", "userName", "email", "createdAt", "updatedAt"],
      });
    },

    signOut: async (root, args, { req, res }) => signOut(req, res),
  },

  User: {
    chats: async () => [], // placeholder until Chat table is ready
  },
};
