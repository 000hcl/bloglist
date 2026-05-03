const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlogWith } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                username: 'testguy',
                name: 'John Tester',
                password: 'secretpasswordis45'
            }
        })
        await request.post('http://localhost:3003/api/users', {
            data: {
                username: 'greg',
                name: 'Greg Craig',
                password: 'secretive'
            }
        })

        await page.goto('http://localhost:5173')
    })
  
    test('Login form is shown', async ({ page }) => {
      const locator = page.getByText('Log in to bloglist')
      await expect(locator).toBeVisible()
      await expect(page.getByLabel('username')).toBeVisible()
      await expect(page.getByLabel('password')).toBeVisible()
    })
    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'testguy', 'secretpasswordis45')
            await expect(page.getByText('Logged in as John Tester')).toBeVisible()
        })
    
        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'testguy', 'wrongpassword')
            await expect(page.getByText('Invalid username or password.')).toBeVisible()
        })
    })
    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'testguy', 'secretpasswordis45')
        })
      
        test('a new blog can be created', async ({ page }) => {
            await createBlogWith(page, 'Testing 101', 'Johnny Test', 'www.testing.com/101')

            await expect(page.getByText('A new blog Testing 101 by Johnny Test added')).toBeVisible()
            await expect(page.getByText('Testing 101 Johnny Test')).toBeVisible()
        })
        describe('when a blog has been created', () => {
            beforeEach(async ({ page }) => {
                await createBlogWith(page, 'Testing 101', 'Johnny Test', 'www.testing.com/101')
            })
            test('it can be liked', async ({ page }) => {
                await page.getByRole('button', {name: 'view'}).click()
                await expect(page.getByText('0 likes')).toBeVisible()
                await page.getByRole('button', {name: 'like'}).click()
                await expect(page.getByText('1 likes')).toBeVisible()
            })
            test('the blog can be deleted', async ({ page }) => {
                await page.getByText('Testing 101 Johnny Test').getByRole('button', {name: 'view'}).click()
                page.on('dialog', dialog => dialog.accept())
                await page.getByRole('button', {name: 'delete'}).click()
                await expect(page.getByText('Testing 101 was successfully deleted')).toBeVisible()
                await expect(page.getByText('Testing 101 Johnny Test')).not.toBeVisible()

            })
            describe('with multiple users', () => {
                beforeEach(async ({ page }) => {
                    await page.getByText('log out').click()
                    await loginWith(page, 'greg', 'secretive')
                })
                test('other users blog does not have delete button', async ({ page }) => {
                    await page.getByText('Testing 101 Johnny Test').getByRole('button', {name: 'view'}).click()
                    await expect(page.getByText('delete')).not.toBeVisible()
                })
                test('blogs are ordered according to likes', async ({ page }) => {
                    await createBlogWith(page, 'experts on rocks', 'Brock Stone', 'www.brockstone.com/1')
                    const expectedBeforeLikes = ['Testing 101 Johnny Test', 'experts on rocks Brock Stone']
                    await expect(page.locator('data-testid=blog')).toContainText(expectedBeforeLikes)
                    await page.getByText('experts on rocks Brock Stone').getByRole('button', {name: 'view'}).click()
                    await page.getByRole('button', {name: 'like'}).click()
                    await page.getByRole('button', {name: 'like'}).click()
                    const expectedAfterLikes = ['experts on rocks Brock Stone', 'Testing 101 Johnny Test']
                    await expect(page.locator('data-testid=blog')).toContainText(expectedAfterLikes)
                })
            })
        })
    })
  })
