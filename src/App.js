import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/loginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/blogForm'
import Notification from './components/Notification'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const blogFormRef = useRef()

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes))
        setSuccessMessage(`New blog '${blogObject.title}' by '${blogObject.author}' added`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      }).catch(() => {
        setErrorMessage(`Something went wrong when adding new blog '${blogObject.title}' by '${blogObject.author}'`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleLikeBlog = (blog) => async () => {
    const updatedBlog = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
    setBlogs([...blogs.filter(b => b.id !== blog.id), updatedBlog].sort((a, b) => b.likes - a.likes))
  }

  const handleRemove = (blog) => async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id).sort((a, b) => b.likes - a.likes))
    }
  }

  const loggedInElement = () => (
    <p>{user.name} logged in <button id="logout-button" onClick={handleLogout}>Log out</button></p>
  )

  return (
    <div>
      {user ? <h2>blogs</h2> : <h2>Log in</h2>}
      <Notification message={errorMessage} className='fail' />
      <Notification message={successMessage} className='success' />

      {!user &&
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      }

      {user && loggedInElement()}
      {user && <Togglable buttonLabel='add blog' ref={blogFormRef} >
        <BlogForm createBlog={addBlog} />
      </Togglable>}

      {user && blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLikeBlog={handleLikeBlog(blog)}
          handleRemove={handleRemove(blog)}
          showDelete={blog.user.username === user.username}
        />
      )}
    </div>
  )
}

export default App

