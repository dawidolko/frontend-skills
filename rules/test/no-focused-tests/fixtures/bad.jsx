import { describe, it, expect } from 'vitest'

describe.only('cart', () => {
  it.only('adds an item', () => {
    expect(add([], 'mug')).toEqual(['mug'])
  })
})
