import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateForm from './CreateForm'

test('new blog form calls function with correct variables', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()
  const title = 'testing basics'
  const author = 'Jeremy Someguy'
  const url = 'www.testing.com/basics'
  const expectedBlog = {
    title: title,
    author: author,
    url: url
  }
  render(<CreateForm createBlog={createBlog}/>)
  const expandButton = screen.getByText('create new blog')
  await user.click(expandButton)
  const titleInput = screen.getByLabelText('title')
  const authorInput = screen.getByLabelText('author')
  const urlInput = screen.getByLabelText('url')

  const submitButton = screen.getByText('create')

  await user.type(titleInput, title)
  await user.type(authorInput, author)
  await user.type(urlInput, url)

  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toStrictEqual(expectedBlog)
})
