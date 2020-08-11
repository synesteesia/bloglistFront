import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newURL
    })

    setNewTitle('')
    setNewAuthor('')
    setNewURL('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        Title:
        <input
          id='newtitle'
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
        /><br />
        Author:
        <input
          id='newauthor'
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
        />
        <br />
        URL:
        <input
          id='newurl'
          value={newURL}
          onChange={({ target }) => setNewURL(target.value)}
        /><br />
        <button type="submit">save</button>
      </form>
    </div>
  )
}
export default BlogForm