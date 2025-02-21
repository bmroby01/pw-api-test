import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach(async ({page}) => {
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })

  await page.goto('https://conduit.bondaracademy.com/')
  await page.getByText('Sign in ').click()
  await page.getByRole('textbox', {name: "Email"}).fill('brianna124@gmail.com')
  await page.getByRole('textbox', {name: "Password"}).fill('hello123')
  await page.getByRole('button').click()
})
test('has title', async ({ page }) => {
  await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = "This is a MOCK test title"
    responseBody.articles[0].description = "This is a MOCK description"

    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })

  await page.getByText('Global Feed').click()
  await expect(page.locator('.navbar-brand')).toHaveText('conduit')
  await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title')
  await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK description')
})

test('delete article', async({page, request}) => {
  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user":{"email":"brianna124@gmail.com","password":"hello123"}
    }
  })
  const responseBody = await response.json()
  const accessToken = responseBody.user.token
  
  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data:{
      "article":{"title":"This is a test title","description":"This is a test description","body":"This is a test","tagList":[]}
    },
    headers: {
      Authorization: `Token ${accessToken}`
    }
  })
  expect(articleResponse.status()).toEqual(201)

  await page.getByText('Global Feed').click()
  await page.getByText('This is a test title').click()
  await page.getByRole('button', {name: "Delete Article"}).first().click()
  await page.getByText('Global Feed').click()
})

