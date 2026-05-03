const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
    }
  ]

  const biggerList = [
    {
      title: 'On the Veg',
      author: 'Maverick Beeson',
      url: 'someurl.url',
      likes: 500
    },
    {
      title: 'Pizza Pies',
      author: 'John DiGiorno',
      url: 'pizzaurl.url',
      likes: 490
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(biggerList)
    assert.strictEqual(result, 990)
  })

  test('of an empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('favorite blog', () => {
  const blog1 =
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 500,
    }
  const blog2 =
    {
      title: 'On the Veg',
      author: 'Maverick Beeson',
      url: 'someurl.url',
      likes: 500
    }
  const blog3 =
    {
      title: 'Pizza Pies',
      author: 'John DiGiorno',
      url: 'pizzaurl.url',
      likes: 490
    }


  test('when list has only one blog, returns that blog', () => {
    const result = listHelper.favoriteBlog([blog1])
    assert.deepStrictEqual(result, blog1)
  })

  test('of a bigger list is correct', () => {
    const result = listHelper.favoriteBlog([blog2, blog3])
    assert.deepStrictEqual(result, blog2)
  })

  test('when list has equally liked blogs, returns the first one,', () => {
    const result = listHelper.favoriteBlog([blog1,blog2,blog3])
    assert.deepStrictEqual(result, blog1)
  })

  test('of an empty list returns null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})

describe('most blogs', () => {
  const blog1 =
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 500,
    }
  const blog2 =
    {
      title: 'On the Veg',
      author: 'Maverick Beeson',
      url: 'someurl.url',
      likes: 500
    }
  const blog3 =
    {
      title: 'Pizza Pies',
      author: 'John DiGiorno',
      url: 'pizzaurl.url',
      likes: 490
    }
  const blog4 =
    {
      title: 'Top 100 Vegetables',
      author: 'Maverick Beeson',
      url: 'someurl.url',
      likes: 753
    }

  test('returns correct entry with longer list', () => {
    const result = listHelper.mostBlogs([blog1, blog2, blog3, blog4])
    assert.deepStrictEqual(result, { 'author':'Maverick Beeson', 'blogs':2 })
  })

  test('returns one entry with a list of one', () => {
    const result = listHelper.mostBlogs([blog1])
    assert.deepStrictEqual(result, { 'author': 'Edsger W. Dijkstra', 'blogs':1 })
  })

  test('returns undefined with empty list', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(undefined, result)
  })
})

describe('most likes', () => {
  const blog1 =
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 500,
    }
  const blog2 =
    {
      title: 'On the Veg',
      author: 'Maverick Beeson',
      url: 'someurl.url',
      likes: 500
    }
  const blog3 =
    {
      title: 'Pizza Pies',
      author: 'John DiGiorno',
      url: 'pizzaurl.url',
      likes: 490
    }
  const blog4 =
    {
      title: 'Top 100 Vegetables',
      author: 'Maverick Beeson',
      url: 'someurl.url',
      likes: 753
    }

  test('returns correct entry with a longer list', () => {
    const result = listHelper.mostLikes([blog1, blog2, blog3, blog4])
    assert.deepStrictEqual(result, { 'author': 'Maverick Beeson', 'likes': 1253 })
  })

  test('returns one entry with a list of one', () => {
    const result = listHelper.mostLikes([blog3])
    assert.deepStrictEqual(result, { 'author': 'John DiGiorno', 'likes':490 })
  })

  test('returns undefined with empty list', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(undefined, result)
  })
})