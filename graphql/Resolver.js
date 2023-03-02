const UserModel = require('../Model/UserModel')
const jsonwebtoken = require('../Util/Jwt')
const bcrypt = require('bcrypt')
const cloudinary = require('../Util/Cloudinary')
const BlogSchema = require('../Model/BlogModel')
const { use } = require('bcrypt/promises')
const commentModel = require('../Model/CommentModel')

const Resolvers = {
  Query: {
    getAllUsers: async () => {
      const Users = await UserModel.find()

      return Users
    },
    getAllBlogs: async () => {
      const Blogs = await BlogSchema.find()

      return Blogs
    },
    getFollowedUsers: async (parent, args, context, info) => {
      const { userId } = args

      const user = await UserModel.findById({ _id: userId })

      const matchingBlogs = await BlogSchema.find({
        userId: { $in: user.following },
      })

      return matchingBlogs
    },
    getAllComment: async () => {
      const allComment = await commentModel.find()

      return allComment
    },
  },
  Mutation: {
    // create new user
    AddUser: async (parent, args, context, info) => {
      const { fullName, email, password, mobile, gender, dob } = args.data

      try {
        const checkUser = await UserModel.findOne({ email: email })

        if (checkUser) {
          return {
            status: 'error',
            message: 'User Already Exists',
          }
        } else {
          const hashedPassword = await bcrypt.genSalt(10).then((salt) => {
            return bcrypt.hash(password, salt)
          })

          const newUser = await UserModel.create({
            fullName,
            email,
            mobile,
            gender,
            dob,
            password: hashedPassword,
          })

          const token = await jsonwebtoken(
            newUser.email,
            newUser.fullName,
            newUser.mobile,
            newUser._id,
          )

          console.log(token)

          return {
            UserId: newUser._id,
            status: 'success',
            message: 'User created successfully',
            Token: token,
          }
        }
      } catch (error) {
        return {
          status: 'error',
          message: 'Something Went Wrong Please Try Again..',
        }
      }
    },
    // Login user to check the email and password is correct or not
    LoginUser: async (parent, args, context, info) => {
      const { email, password } = args.data

      try {
        const checkUser = await UserModel.findOne({ email: email })

        if (!checkUser) {
          return { status: 'error', message: "User Doesn't Exist" }
        } else if (
          checkUser &&
          bcrypt.compareSync(password, checkUser.password)
        ) {
          const token = jsonwebtoken(
            checkUser.email,
            checkUser.fullName,
            checkUser.mobile,
            checkUser._id,
          )

          return {
            UserId: checkUser._id,
            Token: token,
            status: 'success',
            message: 'Authentication successful..',
          }
        } else {
          return { status: 'error', message: 'Password is wrong..' }
        }
      } catch (error) {
        return { status: 'error', message: 'Something went wrong..' }
      }
    },
    // Add Blog
    AddBlog: async (parent, args, context, info) => {
      const { blogName, category, blogContent, image, userId } = args.data

      try {
        if (image !== '') {
          const imageResult = await cloudinary.uploader.upload(image, {
            folder: 'BlogImage',
          })

          const createBlog = await BlogSchema.create({
            blogName,
            blogContent,
            category,
            userId,
            image: {
              public_id: imageResult.public_id,
              url: imageResult.secure_url,
            },
          })

          return {
            status: 'success',
            message: 'Blog Created Successfully',
          }
        } else {
          const createBlog = await BlogSchema.create({
            blogName,
            blogContent,
            category,
            userId,
          })

          return {
            status: 'success',
            message: 'Blog Created Successfully',
          }
        }
      } catch (error) {
        return {
          status: 'error',
          message: 'Blog creation failed',
        }
      }
    },
    // Update Blog
    UpdateBlog: async (parent, args, context, info) => {
      const { blogId, blogName, category, blogContent, image } = args.data

      try {
        if (image === '') {
          const updateBlog = await BlogSchema.findByIdAndUpdate(blogId, {
            blogName,
            blogContent,
            category,
          })

          return {
            status: 'success',
            message: 'Blog Updated Successfully',
          }
        } else {
          const blog = await BlogSchema.findById({ _id: blogId })

          if (blog.image.public_id) {
            await cloudinary.uploader
              .destroy(blog.image.public_id)
              .then((result) => {
                console.log('Existed Image Deleted')
              })
          }

          const imageResult = await cloudinary.uploader.upload(image, {
            folder: 'BlogImage',
          })

          const updateData = await blog.update({
            blogName: blogName,
            blogContent: blogContent,
            category: category,
            image: {
              public_id: imageResult.public_id,
              url: imageResult.secure_url,
            },
          })

          if (updateData) {
            return {
              status: 'success',
              message: 'Updated successfully',
            }
          }
        }
      } catch (error) {
        return {
          status: 'error',
          message: 'Something went wrong please try again',
        }
      }
    },
    // Delete Blog
    DeleteBlog: async (parent, args, context, info) => {
      const { id } = args

      try {
        const blog = await BlogSchema.findById({ _id: id })

        if (blog.image.public_id) {
          await cloudinary.uploader
            .destroy(blog.image.public_id)
            .then((result) => {
              console.log('Existed Image Deleted')
            })
        }

        const deleteBlog = await BlogSchema.findByIdAndDelete({ _id: id })

        if (deleteBlog) {
          return {
            message: 'Blog Deleted Successfully',
            status: 'success',
          }
        } else {
          return {
            message: 'Blog Deleted Failed',
            status: 'error',
          }
        }
      } catch (error) {
        return {
          message: 'Something went wrong please try again',
          status: 'error',
        }
      }
    },
    // Update User
    updateUser: async (parent, args, context, info) => {
      const {
        fullName,
        bio,
        image,
        mobile,
        gender,
        dob,
        category,
        userId,
      } = args.data

      if (image === '') {
        const updateUser = await UserModel.findByIdAndUpdate(userId, {
          fullName: fullName,
          bio: bio,
          mobile: mobile,
          gender: gender,
          category: category,
          dob: dob,
        })

        return {
          status: 'success',
          message: 'User Updated Successfully',
        }
      } else {
        const user = await UserModel.findById({ _id: userId })

        if (user.image.public_id) {
          await cloudinary.uploader
            .destroy(user.image.public_id)
            .then((result) => {
              console.log('Existed Image Deleted')
            })
        }

        const imageResult = await cloudinary.uploader.upload(image, {
          folder: 'UserImage',
        })

        if (user) {
          const updateUser = await UserModel.findByIdAndUpdate(userId, {
            fullName: fullName,
            bio: bio,
            mobile: mobile,
            gender: gender,
            category: category,
            dob: dob,
            image: {
              public_id: imageResult.public_id,
              url: imageResult.secure_url,
            },
          })

          return {
            status: 'success',
            message: 'User Updated Successfully',
          }
        }
      }
    },
    // Following User
    following: async (parent, args, context, info) => {
      const { userId, followerID } = args.data

      try {
        const followingUser = await UserModel.findByIdAndUpdate(userId, {
          $push: { following: followerID },
        })
        const followedUser = await UserModel.findByIdAndUpdate(followerID, {
          $push: { followers: userId },
        })

        if (followingUser && followedUser) {
          return {
            status: 'success',
            message: 'Following User Successfully',
          }
        } else {
          return {
            status: 'error',
            message: 'Something Went Wrong While Following. Please Try Again..',
          }
        }
      } catch (error) {
        return {
          status: 'error',
          message: 'Something Went Wrong Please Try Again..',
        }
      }
    },
    // UnFollowers user
    unFollowing: async (parent, args, context, info) => {
      const { userId, followerID } = args.data
      try {
        const followingUser = await UserModel.findByIdAndUpdate(userId, {
          $pull: { following: followerID },
        })
        const followedUser = await UserModel.findByIdAndUpdate(followerID, {
          $pull: { followers: userId },
        })

        if (followingUser && followedUser) {
          return {
            status: 'success',
            message: 'UnFollowing User Successfully',
          }
        } else {
          return {
            status: 'error',
            message: 'Something Went Wrong While Following. Please Try Again..',
          }
        }
      } catch (error) {
        return {
          status: 'error',
          message: 'Something Went Wrong Please Try Again..',
        }
      }
    },
    // Blog Like
    LikeBlog: async (parent, args, context, info) => {
      const { userId, blogId } = args.data

      try {
        const AddLike = await BlogSchema.findByIdAndUpdate(blogId, {
          $push: { Liked: userId },
        })

        return {
          status: 'success',
          message: 'Blog Liked Successfully',
        }
      } catch (error) {
        return {
          status: 'error',
          message: 'Blog Liked Failed...',
        }
      }
    },
    // Unlike Blog
    UnLikeBlog: async (parent, args, context, info) => {
      const { userId, blogId } = args.data

      console.log(userId, blogId)
      try {
        const AddLike = await BlogSchema.findByIdAndUpdate(blogId, {
          $pull: { Liked: userId },
        })

        return {
          status: 'success',
          message: 'Blog Liked Successfully',
        }
      } catch (error) {
        return {
          status: 'error',
          message: 'Blog Liked Failed...',
        }
      }
    },
    //Commenting on blog
    CommentBlog: async (parent, args, context, info) => {
      const { commenterID, blogID, comment } = args.data

      console.log(commenterID, blogID, comment)

      try {
        const createComment = await commentModel.create({
          commenterID,
          comment,
          blogID,
        })

        if (createComment) {
          return {
            status: 'success',
            message: 'Blog Commenting Successfully',
          }
        }
      } catch (error) {
        return {
          status: 'error',
          message: 'Blog Commenting Failed',
        }
      }
    },
    // Delete Comment
    DeleteComment: async (parent, args, context, info) => {
      const { id } = args

      try {
        const deleteComment = await commentModel.findByIdAndDelete({ _id: id })

        if (deleteComment) {
          return {
            status: 'success',
            message: 'Comment deleted successfully...',
          }
        }
      } catch (error) {
        return {
          status: 'error',
          message: 'Something went wrong please try again...',
        }
      }
    },
    // Search
    searchBlog: async (parent, args, context, info) => {
      const { search } = args.data

      const words = search
        .split(/\s+/)
        .map((word) => `\\b${word}\\b`)
        .join('|')
      const regex = new RegExp(words, 'i')
      const query = { blogName: { $regex: regex } }
      const searchBlog = await BlogSchema.find(query)

      console.log(searchBlog)

      return searchBlog
    },
    // Search User
    searchUser: async (parent, args, context, info) => {
      const { search } = args.data

      const words = search
        .split(/\s+/)
        .map((word) => `\\b${word}\\b`)
        .join('|')
      const regex = new RegExp(words, 'i')
      const query = { fullName: { $regex: regex } }
      const searchBlog = await UserModel.find(query)

      return searchBlog
    },
  },
}

module.exports = Resolvers
