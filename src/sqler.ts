import { Block, Condition } from "./utils"

export default class Sqler {
  private query: Block

  constructor () {
    this.query = new Block()
  }

  select (sql: string, ...args: any[]) {}

  from (sql: string, ...args: any[]) {}

  join (sql: string, ...args: any[]): void
  join (sql: string, onFn: (on: Condition) => void): void
  join (...args: any[]) {}

  where (sql: string, ...args: any[]): void
  where (whereFn: (where: Condition) => void): void
  where (...args: any[]) {}

  group (fields: string[]) {}

  having (sql: string, ...args: any[]): void
  having (havingFn: (having: Condition) => void): void
  having (...args: any[]) {}

  order () {}

  limit (limit: number): void
  limit (offset: number, limit: number): void
  limit (...args: any[]) {}

  do (): {sql: string; args: any[]} {
    return { sql: "", args: [] }
  }
}
