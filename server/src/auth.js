import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import { SESS_NAME } from "./temporalConfig.js"; // just a string export

export const isSignedIn = (req) => !!req.session?.userId;

export const attemptSignIn = async (UserModel, email, password) => {
  const user = await UserModel.findOne({ where: { email } });
  if (!user) throw new GraphQLError("Incorrect email or password", { extensions: { code: "UNAUTHORIZED" } });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new GraphQLError("Incorrect email or password", { extensions: { code: "UNAUTHORIZED" } });
  return user;
};

export const ensureSignedIn = (req) => {
  if (!isSignedIn(req)) {
    req.session.destroy(() => {});
    throw new GraphQLError("You must be signed in.", { extensions: { code: "UNAUTHORIZED" } });
  }
};

export const ensureSignedOut = (req) => {
  if (isSignedIn(req)) throw new GraphQLError("You are already signed in.", { extensions: { code: "UNAUTHORIZED" } });
};

export const signOut = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) return reject(err);
      res.clearCookie(SESS_NAME);
      resolve(true);
    });
  });
