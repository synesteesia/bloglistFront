import React, { useState } from 'react'
import '../styles/blog.css'


const Blog = ({ blog, handleLikeBlog, handleRemove, showDelete }) => {
  const [showDetails, setShowDetails] = useState(false)


  const details = () => (
    <div>
      <div>{blog.url} </div>
      <div>{blog.likes} <button onClick={handleLikeBlog}>like</button></div>
      {showDelete && <div><button onClick={handleRemove}>remove</button></div>}
    </div>
  )

  return (
    <div className='borderStyle'>
      {blog.title} {blog.author} <button onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'Hide' : 'View'}</button>
      {showDetails && details()}
    </div>
  )
}

export default Blog
