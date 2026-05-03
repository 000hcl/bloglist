const loginWith = async (page, username, password)  => {
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByText('login').click()
}

const createBlogWith = async (page, title, author, url) => {
    await page.getByText('create new blog').click()
    await page.getByLabel('title').fill(title)
    await page.getByLabel('author').fill(author)
    await page.getByLabel('url').fill(url)
    await page.getByRole('button', {name:'create'}).click()
}
  
export { loginWith, createBlogWith }