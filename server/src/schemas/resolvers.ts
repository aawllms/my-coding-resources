import { signToken } from "../services/auth.js";
import { AuthenticationError } from "../services/auth.js";
// import User from "../models/User.js";
// import Resource from "../models/Resource.js";

import { User, Resource } from "../models/index.js";
const resolvers = {
  Query: {
    getSingleUser: async (_parent: any, _args: any, context: any) => {
      const foundUser = await User.findOne({
        username: context.user.username,
      });
      if (!foundUser) {
        throw new AuthenticationError("Authentication Error");
      }
      return foundUser;
    },
    getResource: async (_parent: any, { _id }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        const resource = await Resource.findById(_id);
        if (!resource) {
          throw new Error("Resource not found");
        }
        return resource;
      } catch (error) {
        throw new Error("Error fetching resource");
      }
    },
  },
  Mutation: {
    createUser: async (_parent: any, args: any, _context: any) => {
      const user = await User.create(args);

      if (!user) {
        return null;
      }
      const token = signToken(user.username, user.password, user._id);
      return { token, user };
    },
    login: async (_parent: any, args: any, _context: any) => {
      const user = await User.findOne({
        $or: [{ username: args.username }, { email: args.email }],
      });
      if (!user) {
        return null;
      }

      const correctPw = await user.isCorrectPassword(args.password);

      if (!correctPw) {
        return null;
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    createResource: async (
      _parent: any,
      { title, description, url }: any,
      context: any
    ) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        const newResource = new Resource({
          title,
          description,
          url,
        });

        const savedResource = await newResource.save();

        return savedResource;
      } catch (error) {
        throw new Error("Error adding resource");
      }
    },
    deleteResource: async (_parent: any, { _id }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        const resource = await Resource.findByIdAndDelete(_id);

        if (!resource) {
          throw new Error("Resource not found");
        }

        console.log(`Successfully deleted resource with ID: ${_id}`);
        return resource;
      } catch (error) {
        throw new Error("Error deleting resource");
      }
    },

    // updateResource: {},
    // updateUser: {},
  },
};

export default resolvers;
