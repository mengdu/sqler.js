import { format } from 'sqlstring'

// 减少括号层次
function brackets (sql: string) :string {
  return sql.replace(/^\((.*)\)$/g, '$1')
}

export class Block {
  private sqls: string[]
  private args: any[]

  constructor () {
    this.sqls = []
    this.args = []
  }

  add (sql: string, ...args: any[]) {
    sql = sql.trim()
    if (sql === "") return
    this.sqls.push(sql)
    this.args.push(...args)
  }

  set (sql: string, ...args: any[]) {
    if (sql === "") return
    this.sqls = [sql]
    this.args = [...args]
  }

  do (sep: string = " "): {sql: string; args: any[]} {
    if (this.sqls.length === 0) return {sql: "", args: [] }
    return {
      sql: this.sqls.join(sep),
      args: [...this.args]
    }
  }
}

class Or {
  private block: Block

  constructor () {
    this.block = new Block()
  }

  add (sql: string, ...args: any[]) {
    sql = sql.trim()
    if (!sql) return
    this.block.add(sql, ...args)
  }

  and (andFn: (and: Condition) => void) {
    const and = new Condition()
    andFn(and)
    const {sql, args} = and.do(false)
    if (sql) {
      this.add(`(${brackets(sql)})`, ...args)
    }
  }

  do (): {sql: string, args: any[]} {
    return this.block.do(" or ")
  }
}

export class Condition {
  private name: string
  private block: Block

  constructor (name = "") {
    this.name = name
    this.block = new Block()
  }

  and (sql: string, ...args: any[]) {
    sql = sql.trim()
    if (!sql) return
    this.block.add(sql, ...args)
  }

  or (orFn: (or: Or) => void) {
    const or = new Or()
    orFn(or)
    const { sql, args } = or.do()
    if (sql) {
      this.and(`(${brackets(sql)})`, ...args)
    }
  }

  do (isFormat: boolean = true): {sql: string, args: any[]} {
    let { sql, args } = this.block.do(" and ")
  
    if (sql && this.name) {
      sql =  this.name + ' ' + sql
    }

    if (isFormat) {
      return { sql: format(sql, args), args: [] }
    }

    return { sql, args }
  }
}

export class Order {
  private block: Block
  constructor () {
    this.block = new Block()
  }

  add (field: string, sort: 'desc' | 'asc') {
    this.block.add(`${field} ${sort}`)
  }

  do () {
    const { sql } = this.block.do(', ')
    if (!sql) {
      return ''
    }
    return 'order by ' + sql
  }
}

export class Group {
  private block: Block
  constructor () {
    this.block = new Block()
  }

  add (...field: string[]) {
    for (const i in field) {
      this.block.add(field[i])
    }
  }

  do () {
    const { sql } = this.block.do(', ')
    if (!sql) {
      return ''
    }
    return 'group by ' + sql
  }
}
