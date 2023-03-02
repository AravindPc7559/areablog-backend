const { gql } = require('apollo-server')

const typeDefs = gql`
  input RegisterData {
    fullName: String
    email: String
    mobile: String
    gender: String
    dob: String
    password: String
  }

  type ImageType {
    public_id: String
    url: String
  }

  input UpdateUser {
    fullName: String
    bio: String
    mobile: String
    gender: String
    dob: String
    category: String
    image: String
    userId: String
  }

  input LoginData {
    email: String
    password: String
  }

  type AddUserReturn {
    Token: String
    status: String
    message: String
    UserId: String
  }

  type UserData {
    fullName: String
    email: String
    mobile: String
    gender: String
    dob: String
    bio: String
    image: ImageType
    followers: [String]
    following: [String]
    category: String
    _id: String
  }

  input BlogData {
    blogName: String
    category: String
    blogContent: String
    image: String
    userId: String
  }

  input UpdateBlog {
    blogName: String
    category: String
    blogContent: String
    image: String
    blogId: String
  }

  type AllBlogs {
    blogName: String
    category: String
    blogContent: String
    image: ImageType
    userId: String
    Liked: [String]
    _id: String
  }

  type BlogDataReturn {
    status: String
    message: String
  }

  input followingData {
    followerID: String
    userId: String
  }

  input blogLike {
    userId: String
    blogId: String
  }

  input commentBlog {
    comment: String
    commenterID: String
    blogID: String
  }
  type ALlComment {
    _id: String
    comment: String
    commenterID: String
    blogID: String
    createdAt: String
    updatedAt: String
  }


  
  input SearchData {
    search: String
  }

  type Query {
    getAllUsers: [UserData]
    getAllBlogs: [AllBlogs]
    getFollowedUsers(userId: String): [AllBlogs]
    getAllComment: [ALlComment]
  }

  type Mutation {
    AddUser(data: RegisterData): AddUserReturn
    LoginUser(data: LoginData): AddUserReturn
    AddBlog(data: BlogData): BlogDataReturn
    UpdateBlog(data: UpdateBlog): BlogDataReturn
    DeleteBlog(id: String): BlogDataReturn
    updateUser(data: UpdateUser): BlogDataReturn
    following(data: followingData): BlogDataReturn
    unFollowing(data: followingData): BlogDataReturn
    LikeBlog(data: blogLike): BlogDataReturn
    UnLikeBlog(data: blogLike): BlogDataReturn
    CommentBlog(data: commentBlog): BlogDataReturn
    DeleteComment(id: String): BlogDataReturn
    searchBlog(data: SearchData): [AllBlogs]
    searchUser(data: SearchData): [UserData]
  }
`

module.exports = typeDefs
