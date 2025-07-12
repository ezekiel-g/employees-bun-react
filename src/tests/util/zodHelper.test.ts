import { describe, expect, it } from 'bun:test'
import { getSchemaFunction } from '@/util/zodHelper'

describe('zodHelper', () => {
  describe('getSchemaFunction', () => {
    it('returns correct schema for valid table and query type', () => {
      const result1 = getSchemaFunction('table1', 'INSERT')
      const result2 = getSchemaFunction('table2', 'UPDATE')

      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
      expect(typeof result1.safeParse).toBe('function')
      expect(typeof result2.safeParse).toBe('function')
    })

    it('handles invalid table gracefully', () => {
      const result = getSchemaFunction('not_a_table', 'INSERT')

      expect(result).toBeDefined()
      expect(typeof result.safeParse).toBe('function')
    })

    it('handles invalid query type gracefully', () => {
      const result = getSchemaFunction('departments', 'DELETE')

      expect(result).toBeDefined()
      expect(typeof result.safeParse).toBe('function')
    })
  })
})
