import { format } from "sqlstring"
import { Group } from "."
import { Block, Condition, Order } from "./utils"

interface block {
  do (): { sql: string, args: any[] }
}

function mergeBlock (...blocks: block[]): { sql: string, args: any[] } {
  const sqls: string[] = []
  const arr: any[] = []

  for (const i in blocks) {
    const { sql, args } = blocks[i].do()
    if (sql) {
      sqls.push(sql)
      arr.push(...args)
    }
  }

  return { sql: sqls.join(' '), args: arr }
}

export default class Sqler {
  private _query: Block
  private _table: Block
  private _join: Block
  private _where: Block
  private _group: Block
  private _having: Block
  private _order: Block
  private _limit: Block

  constructor () {
    this._query = new Block()
    this._table = new Block()
    this._join = new Block()
    this._where = new Block()
    this._group = new Block()
    this._having = new Block()
    this._order = new Block()
    this._limit = new Block()
  }

  select (sql: string, ...args: any[]) {
    this._query.set(sql, ...args)
  }

  from (sql: string, ...args: any[]) {
    this._table.set(sql, ...args)
  }

  join (sql: string, ...args: any[]): void
  join (sql: string, onFn: (on: Condition) => void): void
  join (...arr: any[]) {
    if (typeof arr[1] === 'function') {
      const on = new Condition('on')
      arr[1](on)
      const { sql, args } = on.do(false)
      this._join.add(sql, ...args)
    } else {
      const [sql, ...args] = arr
      this._join.add(sql, ...args)
    }
  }

  where (sql: string, ...args: any[]): void
  where (whereFn: (where: Condition) => void): void
  where (...arr: any[]) {
    if (typeof arr[0] === 'function') {
      const where = new Condition('where')
      arr[0](where)
      const { sql, args } = where.do(false)
      this._where.set(sql, ...args)
    } else {
      const [sql, ...args] = arr
      this._where.set(sql, ...args)
    }
  }

  group (groupFn: (group: Block) => void): void
  group (...field: string[]): void
  group (...arr: any[]) {
    const group = new Group()

    if (typeof arr[0] === 'function') {
      arr[0](group)
    } else {
      group.add(...arr)
    }

    this._group.set(group.do())
  }

  having (sql: string, ...args: any[]): void
  having (havingFn: (having: Condition) => void): void
  having (...arr: any[]) {
    if (typeof arr[0] === 'function') {
      const having = new Condition('having')
      arr[0](having)
      const { sql, args } = having.do(false)
      this._having.set(sql, ...args)
    } else {
      const [sql, ...args] = arr
      this._having.set(sql, ...args)
    }
  }

  order (orderFn: (order: Order) => void) {
    const order = new Order()
    orderFn(order)
    this._order.set(order.do())
  }

  limit (limit: number): void
  limit (offset: number, limit: number): void
  limit (...args: any[]) {
    if (args[1]) {
      this._limit.set('limit ?, ?', args[0], args[1])
    } else {
      this._limit.set('limit ?', args[0])
    }
  }

  do (isFormat: boolean = true): {sql: string; args: any[]} {
    const { sql, args } = mergeBlock(this._query, this._table, this._join, this._where,
      this._group, this._having, this._order, this._limit)
    
    if (isFormat) {
      return { sql: format(sql, args), args: [] }
    }

    return { sql, args }
  }

  doCount (sql?: string, isFormat: boolean = true) {
    const count = new Block()

    if (sql) {
      count.set(sql)
    } else {
      count.set('select count(1) as count from')
    }

    const result = mergeBlock(count, this._table, this._join, this._where,
      this._group, this._having)
    
    if (isFormat) {
      return { sql: format(result.sql, result.args), args: [] }
    }

    return { sql: result.sql, args: result.args }
  }
}
