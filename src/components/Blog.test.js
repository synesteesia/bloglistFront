import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    author: 'Seppo Myrskyranta',
    title: 'otsikko',
    url: 'testi.com',
    likes: 6
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    blog.author)
  expect(component.container).toHaveTextContent(
    blog.title
  )
  expect(component.container).not.toHaveTextContent(blog.url)

  expect(component.container).not.toHaveTextContent(blog.likes)

})

test('clicking the button calls event handler once', async () => {
  const blog = {
    author: 'Seppo',
    title: 'otsikko',
    url: 'testi.com',
    likes: 6
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleLikeBlog={mockHandler} />
  )

  const viewButton = component.getByText('View')
  fireEvent.click(viewButton)

  expect(component.container).toHaveTextContent(
    blog.author)
  expect(component.container).toHaveTextContent(
    blog.title
  )
  expect(component.container).toHaveTextContent(
    blog.url)
  expect(component.container).toHaveTextContent(
    blog.likes
  )


})

test('clicking the button calls event handler once', async () => {
  const blog = {
    author: 'Seppo',
    title: 'otsikko',
    url: 'testi.com',
    likes: 6
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleLikeBlog={mockHandler} />
  )

  const viewButton = component.getByText('View')
  fireEvent.click(viewButton)

  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})