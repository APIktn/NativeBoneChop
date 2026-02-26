import { generateAvatar } from './avatar.util'

describe('generateAvatar', () => {

  it('should return a valid URL string', () => {
    const url = generateAvatar('John', 'Doe')
    expect(typeof url).toBe('string')
    expect(url).toContain('https://ui-avatars.com/api/')
  })

  it('should include correct initials', () => {
    const url = generateAvatar('John', 'Doe')
    expect(url).toContain('JD')
  })

  it('should encode initials properly', () => {
    const url = generateAvatar('A', 'B')
    expect(url).toContain('AB')
  })

  it('should include background color', () => {
    const url = generateAvatar('John', 'Doe')
    expect(url).toMatch(/background=\w+/)
  })

})
