const sqlstring = require('sqlstring')
const Sqler = require('../dest')

const q = new Sqler.default()

q.select('select id, username')
q.from('users')
q.where(where => {
  where.and('field1 = ?', 1)
  where.and('field2 = ?', 2)
  where.or(or => {
    or.add("field3 = ?", 3)
    or.add("field4 = ?", 4)
    or.and(and => {
      and.and('field5 = ?', 5)
      and.and('field6 = ?', 6)
      and.or(or => {
        or.add("field7 = ?", 7)
        or.add("field8 = ?", 8)
      })
    })
  })
})
q.group(group => {
  group.add('field1')
  group.add('field2')
  group.add('field3')
})
q.having(having => {
  having.and('field1 > 1')
})
q.order(o => {
  o.add('id', 'desc')
  o.add('age', 'asc')
})
q.limit(0, 10)
console.log(q.do())
console.log(q.doCount())

const b = new Sqler.Condition("where")

b.and("field1 = ?", 1)
b.and("field2 = ?", 2)
b.or(or => {
  or.add("field3 = ?", 3)
  or.add("field4 = ?", 4)
  or.and(and => {
    and.and('field5 = ?', 5)
    and.and('field6 = ?', 6)
    and.or(or => {
      or.add("field7 = ?", 7)
      or.add("field8 = ?", 8)
    })
  })
})
console.log(b.do(true))
console.log(sqlstring.format('like ?', []))

const o = new Sqler.Order()
o.add('field1', 'asc')
o.add('field2', 'desc')
console.log(o.do())

const g = new Sqler.Group()
g.add('field1')
g.add('field2', 'field3')
console.log(g.do())