const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return userData;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
  Mutation: {
    addUser: async (_, { input }) => {
      try {
        const user = await User.create(input);

        if (!user) {
          throw new Error("Something is wrong!");
        }

        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.log(err);
        throw new Error("Internal server error");
      }
    },
    login: async (_, { input }) => {
      try {
        const { username, email, password } = input;

        const user = await User.findOne({
          $or: [{ username }, { email }],
        });

        if (!user) {
          throw new Error("Can't find this user");
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          throw new Error("Wrong password!");
        }

        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.log(err);
        throw new Error("Internal server error");
      }
    },
    saveBook: async (_, { input }, { user }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      } catch (err) {
        console.log(err);
        throw new Error("Internal server error");
      }
    },
    deleteBook: async (_, { bookId }, { user }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        if (!updatedUser) {
          throw new Error("Couldn't find user with this id!");
        }

        return updatedUser;
      } catch (err) {
        console.log(err);
        throw new Error("Internal server error");
      }
    },
  },
};

module.exports = resolvers;
