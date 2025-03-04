import { signToken } from "../services/auth.js";
import { AuthenticationError } from "../services/auth.js";
import { User, Resource } from "../models/index.js";
const resolvers = {
    Query: {
        getSingleUser: async (_parent, _args, context) => {
            const foundUser = await User.findOne({
                username: context.user.username,
            });
            if (!foundUser) {
                throw new AuthenticationError("Authentication Error");
            }
            return foundUser;
        },
        getAllUsers: async (_parent, _args, context) => {
            if (context?.user) {
                const allUsers = await User.find();
                return allUsers;
            }
            else {
                throw new AuthenticationError("Authentication Error");
            }
        },
        getUserByUsername: async (_parent, args, context) => {
            if (context?.user) {
                const foundUser = await User.findOne({
                    username: args.username,
                });
                if (!foundUser) {
                    throw new AuthenticationError("User not found");
                }
                return foundUser;
            }
            else {
                throw new AuthenticationError("Authentication Error");
            }
        },
        getResource: async (_parent, { resourceId }, context) => {
            if (!context.user) {
                throw new AuthenticationError("You need to be logged in!");
            }
            try {
                const resource = await Resource.findById(resourceId);
                if (!resource) {
                    throw new Error("Resource not found");
                }
                return resource;
            }
            catch (error) {
                throw new Error("Error fetching resource");
            }
        },
        getAllResources: async (_parent, _args) => {
            const getResources = await Resource.find();
            return getResources;
        },
        //getResourceByCategory()
    },
    Mutation: {
        createUser: async (_parent, args, _context) => {
            const user = await User.create(args);
            if (!user) {
                return null;
            }
            const token = signToken(user.username, user.password, user._id);
            return { token, user };
        },
        updateUser: async (_parent, args, context) => {
            if (context.user) {
                // const updatedUser = await User.findByIdAndUpdate(
                //   context.user._id,
                //   {
                //     $set: {
                //       //   ...args,
                //       username: args.username || context.user.username,
                //       email: args.email || context.user.email,
                //       password: args.password || context.user.password,
                //     },
                //   },
                //   {
                //     new: true,
                //     runValidators: true,
                //   }
                // );
                const targetUser = await User.findById(context.user._id);
                if (args?.username && targetUser?.username) {
                    targetUser.username = args.username;
                }
                if (args?.email && targetUser?.email) {
                    targetUser.email = args.email;
                }
                if (args?.password && targetUser?.password) {
                    targetUser.password = args.password;
                }
                targetUser?.save();
                console.log(targetUser);
                return targetUser;
            }
            throw new AuthenticationError("Authentication Error");
        },
        deleteUser: async (_parent, _args, context) => {
            console.log(context.user);
            if (context.user) {
                const user = await User.findByIdAndDelete(context.user._id);
                console.log(user);
                return;
            }
            throw new AuthenticationError("Must be logged in to delete account");
        },
        login: async (_parent, args, _context) => {
            const user = await User.findOne({
                $or: [{ username: args.username }, { email: args.email }],
            });
            if (!user) {
                throw new AuthenticationError("Authentication Error");
            }
            const correctPw = await user.isCorrectPassword(args.password);
            if (!correctPw) {
                throw new AuthenticationError("Authentication Error");
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        createResource: async (_parent, { title, description, url }, context) => {
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
            }
            catch (error) {
                throw new Error("Error adding resource");
            }
        },
        deleteResource: async (_parent, { resourceId }, context) => {
            if (!context.user) {
                throw new AuthenticationError("You need to be logged in!");
            }
            try {
                const resource = await Resource.findByIdAndDelete(resourceId);
                if (!resource) {
                    throw new Error("Resource not found");
                }
                console.log(`Successfully deleted resource with ID: ${resourceId}`);
                return resource;
            }
            catch (error) {
                throw new Error("Error deleting resource");
            }
        },
        updateResource: async (_parent, { resourceId, title, description, url }, context) => {
            if (!context.user) {
                throw new AuthenticationError("You need to be logged in!");
            }
            try {
                const updatedResource = await Resource.findByIdAndUpdate(resourceId, { title, description, url }, { new: true, runValidators: true });
                if (!updatedResource) {
                    throw new Error("Resource not found");
                }
                return updatedResource;
            }
            catch (error) {
                throw new Error("Error updating resource");
            }
        },
        // saveResource: async (_parent: any, args: any, context: any) => {
        //   try {
        //     const updatedUser = await User.findByIdAndUpdate(
        //       { _id: context.user._id },
        //       { $addToSet: { savedResource: args.resourceId } },
        //       { new: true, runValidators: true }
        //     );
        //     return updatedUser;
        //   } catch (err) {
        //     return null;
        //   }
        // },
        saveResource: async (_parent, args, context) => {
            try {
                const updatedUser = await User.findByIdAndUpdate({ _id: context.user._id }, { $addToSet: { savedResource: args.resourceId } }, { new: true, runValidators: true });
                return updatedUser;
            }
            catch (err) {
                console.error(err);
                return null;
            }
        },
        // removeResource: async (_parent: any, args: any, context: any) => {
        //   const updatedUser = await User.findByIdAndUpdate(
        //     { _id: context.user._id },
        //     { $pull: { savedResource: { resourceId: args.resourceId } } },
        //     { new: true }
        //   );
        //   if (!updatedUser) {
        //     return null;
        //   }
        //   return updatedUser;
        // },
    },
};
export default resolvers;
