test('NODE_ENV', () => {
  expect(process.env.NODE_ENV).toBe('test')
})

test('BACKEND_URL', () => {
  expect(process.env.BACKEND_URL).toBeDefined()
})
