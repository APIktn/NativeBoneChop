import { generateUserCode } from './user-code.util'

describe('generateUserCode', () => {

  const mockDate = new Date('2026-02-18T00:00:00Z')

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockDate)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should return first running number when no user exists', async () => {

    const prismaMock: any = {
      user: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
    }

    const code = await generateUserCode(prismaMock)

    expect(code).toBe('USR202602180001')
  })

  it('should increment running number when last user exists', async () => {

    const prismaMock: any = {
      user: {
        findFirst: jest.fn().mockResolvedValue({
          UserCode: 'USR202602180005',
        }),
      },
    }

    const code = await generateUserCode(prismaMock)

    expect(code).toBe('USR202602180006')
  })

})
