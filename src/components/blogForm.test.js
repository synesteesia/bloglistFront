import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './blogForm'

test('<BlogformForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const input = component.container.querySelector('input')
  const form = component.container.querySelector('form')

  fireEvent.change(input, {
    target: { value: 'testing of forms could be easier' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing of forms could be easier')
})

test('<BlogformForm /> calls the create handler with correct parameters', () => {
  const blog = {
    title: 'TestTitle',
    author: 'TEstAuthor',
    url: 'TestURL'
  }
  const createBlog = jest.fn()

  const component = render(<BlogForm createBlog={createBlog} />)

  const newAuthor = component.container.querySelector('#newauthor')
  const newTitle = component.container.querySelector('#newtitle')
  const newURL = component.container.querySelector('#newurl')

  fireEvent.change(newAuthor, { target: { value: blog.author } })
  fireEvent.change(newTitle, { target: { value: blog.title } })
  fireEvent.change(newURL, { target: { value: blog.url } })

  const submitButton = component.container.querySelector('button')
  fireEvent.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual(blog)
})