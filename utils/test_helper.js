const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const createUserAndReturnTokenAndId = async (secret) => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('secretingredientis?', 10)
  const user = new User({
    username: 'digiorno',
    name: 'John DiGiorno',
    passwordHash
  })
  await user.save()

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, secret)

  return { token: `Bearer ${token}`, id: user._id }
}

const createBlogWithUserId = async (id) => {
  const blog = new Blog({
    title: 'Pizza',
    author: 'John DiGiorno',
    url: 'someurl.url/jdg/pizza',
    likes: 784,
    user: id
  })
  await blog.save()
  return blog

}

module.exports = { createUserAndReturnTokenAndId, createBlogWithUserId }