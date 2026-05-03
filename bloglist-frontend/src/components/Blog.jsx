import { useState } from 'react'

const Blog = ({ blog, likeFunction, deleteFunction, user }) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const isUser = () => {
    if (user === null) {
      return false
    }
    if (user.username === blog.user.username) {
      return true
    }
    return false
  }

  return(
    <div style={blogStyle} data-testid='blog'>
      <div>
        {blog.title} {blog.author} <button onClick={toggleExpanded}>{ expanded ? 'hide' :'view'}</button>
      </div>
      {expanded &&
      <div id='expanded'>
        {blog.url}
        <br/>
        {blog.likes} likes <button onClick={() => likeFunction(blog)}>like</button>
        <br/>
        {blog.user.name}
        {isUser() &&
          <div>
            <button onClick={() => deleteFunction(blog)}>delete</button>
          </div>
        }
      </div>
      }
    </div>
  )
}

export default Blog