import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author but not expanded information by default', () => {
  const blog = {
    title: 'testing in react',
    author: 'some guy',
    url: 'www.testing.com/react',
    likes: 600,
    user: {
      name: 'test man',
      username: 'testing2026'
    }
  }

  const { container } = render(<Blog blog={blog}/>)

  const url = screen.queryByText('www.testing.com/react')
  const title = screen.queryByText('testing in react')
  const author = screen.queryByText('some guy')
  const likes = screen.queryByText('600 likes')
  const expanded = container.querySelector('#expanded')
  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(expanded).toBeNull()
  expect(likes).toBeNull()
  expect(url).toBeNull()

})

test('renders expanded information when button is clicked', async () => {
  const loggedInUser = {
    name: 'test man',
    username: 'testing2026'
  }
  const blog = {
    title: 'testing in react',
    author: 'some guy',
    url: 'www.testing.com/react',
    likes: 600,
    user: loggedInUser
  }
  render(<Blog blog={blog} user={loggedInUser}/>)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)


  const url = screen.queryByText('www.testing.com/react')
  const likes = screen.queryByText('600 likes')

  expect(likes).toBeDefined()
  expect(url).toBeDefined()
})

test('like button pressed twice calls function twice', async () => {
  const loggedInUser = {
    name: 'test man',
    username: 'testing2026'
  }
  const blog = {
    title: 'testing in react',
    author: 'some guy',
    url: 'www.testing.com/react',
    likes: 600,
    user: loggedInUser
  }
  const mockHandler = vi.fn()
  render(<Blog blog={blog} user={loggedInUser} likeFunction={mockHandler}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})