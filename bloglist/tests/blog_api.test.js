const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('../utils/test_helper')

const api = supertest(app)

const initialBlogs = [
    {
        title: "On the Veg",
        author: "Maverick Beeson",
        url: "someurl.url/mb/ontheveg",
        likes: 500
    },
    {
        title: "Vegetable Cake: is it possible or even good?",
        author: "Maverick Beeson",
        url: "someurl.url/mb/vegetablecake",
        likes: 24
    },
    {
        title: "On Pizza Pies",
        author: "John DiGiorno",
        url: "someurl.url/jdg/onpizzapies",
        likes: 784
    }
]

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        
        await Blog.deleteMany({})
        const blogObjects = initialBlogs.map(b => new Blog(b))
        const promiseArray = blogObjects.map(blog => blog.save())
        await Promise.all(promiseArray)
    })
    
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length)
    })
    
    test('blogs are returned as json', async () => {
        await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      })
      
      after(async () => {
        await mongoose.connection.close()
      })
    
      test('blogs have property id', async () => {
        const response = await api.get('/api/blogs')
        assert(response.body[0].id.length > 0)
    })
    
    describe('adding a new blog', () => {
        test('fails without token', async () => {
            const newBlog = 
            {
                title: "Burgers in town",
                author: "MacDonald King",
                url: "someurl.url/mk/burgersintown",
                likes: 34
            }
            await api.post('/api/blogs').send(newBlog).expect(401)
        })
        test('succeeds with a valid blog', async () => {
            const {token, id} = await helper.createUserAndReturnTokenAndId(process.env.SECRET)
            const newBlog = 
            {
                title: "Burgers in town",
                author: "MacDonald King",
                url: "someurl.url/mk/burgersintown",
                likes: 34,
                user: id
            }
            await api.post('/api/blogs').set('Authorization', token).send(newBlog).expect(201).expect('Content-Type', /application\/json/)
        
            const currentBlogsResponse = await api.get('/api/blogs')
        
            assert.strictEqual(currentBlogsResponse.body.length, initialBlogs.length+1)
        
            const lastBlog = currentBlogsResponse.body.at(-1)
        
            assert(lastBlog.title.includes("Burgers in town"))
            assert(lastBlog.url.includes("someurl.url/mk/burgersintown"))
            assert(lastBlog.author.includes("MacDonald King"))
            
        })
        
        test('with no likes defaults to 0', async () => {
            const {token, id} = await helper.createUserAndReturnTokenAndId(process.env.SECRET)
            const newBlog = 
            {
                title: "Burgers in town",
                author: "MacDonald King",
                url: "someurl.url/mk/burgersintown",
                user: id
            }
            const added = await api.post('/api/blogs').set('Authorization', token).send(newBlog)
            assert(added.body.likes === 0)
        })
        
        test('with missing title results in bad request', async () => {
            const {token, id} = await helper.createUserAndReturnTokenAndId(process.env.SECRET)
            const newBlog = 
            {
                author: "MacDonald King",
                url: "someurl.url/mk/burgersintown",
                user: id
            }
            await api.post('/api/blogs').set('Authorization', token).send(newBlog).expect(400)
        
        })
        
        test('with missing url results in bad request', async () => {
            const {token, id} = await helper.createUserAndReturnTokenAndId(process.env.SECRET)
            const newBlog = 
            {
                title: "Burgers in town",
                author: "MacDonald King",
                user: id
            }
            await api.post('/api/blogs').set('Authorization', token).send(newBlog).expect(400)
        })
    })
    describe('deleting a blog', () => {
        test('with a valid id is successful', async () => {
            const user = await helper.createUserAndReturnTokenAndId(process.env.SECRET)
            const blog = await helper.createBlogWithUserId(user.id)
            const idToDelete = blog._id.toString()

            await api.delete(`/api/blogs/${idToDelete}`).set('Authorization', user.token).expect(204)

            const newResponse = await api.get('/api/blogs')
            assert(newResponse.body.length === initialBlogs.length)
        })

        test('with invalid id causes bad request', async () => {
            const user = await helper.createUserAndReturnTokenAndId(process.env.SECRET)
            await api.delete('/api/blogs/invalidID').set('Authorization', user.token).expect(400)
        })
    })
    describe('updating a blog', () => {
        const updatedBlog = 
            {
                title: "On the Veg: the bleeding veg",
                author: "Maverick Beeson",
                url: "someurl.url/mb/ontheveg",
                likes: 3999
            }
        test('with a valid id is successful', async () => {
            const response = await api.get('/api/blogs')
            const idToUpate = response.body[0].id
            
            await api.put(`/api/blogs/${idToUpate}`).send(updatedBlog).expect(201)

            const updatedResponse = await api.get('/api/blogs')
            const updated = updatedResponse.body[0]
            updatedBlog.id = idToUpate
            assert.deepStrictEqual(updated, updatedBlog)
        })

        test('with invalid id causes bad request', async () => {
            await api.put(`/api/blogs/invalidID`).send(updatedBlog).expect(400)
        })

        test('fails with bad data', async () => {
            const badData = {
                title: "title"
            }
            const response = await api.get('/api/blogs')
            const idToUpate = response.body[0].id
            await api.put(`/api/blogs/${idToUpate}`).send(badData).expect(400)

        })
    })
 
})

after(async () => {
    await mongoose.connection.close()
})