import { useState } from 'react'

const CreateForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }


  const addBlog = async (event) => {
    event.preventDefault()
    const newBlog = { title:title, author:author, url:url }

    const createSuccessfully = await createBlog(newBlog)
    if (createSuccessfully) {
      setTitle('')
      setAuthor('')
      setUrl('')
      toggleVisibility()
    }

  }

  return(
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{'create new blog'}</button>
      </div>
      <div style={showWhenVisible}>
        <div>
          <h2>Create new</h2>
          <form onSubmit={addBlog}>
            <div>
              <label>
                            title
                <input
                  type="text"
                  value={title}
                  onChange={({ target }) => setTitle(target.value)}/>
              </label>
            </div>
            <div>
              <label>
                            author
                <input
                  type="text"
                  value={author}
                  onChange={({ target }) => setAuthor(target.value)}/>
              </label>
            </div>
            <div>
              <label>
                            url
                <input
                  type="text"
                  value={url}
                  onChange={({ target }) => setUrl(target.value)}/>
              </label>
            </div>
            <button type="submit">create</button>
          </form>
        </div>
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>




  )
}

export default CreateForm