const Sqler = require('../dest')

const w = new Sqler.Where()

w.and("field1 = ?", 1)
w.and("field2 = ?", 2)
w.or(or => {
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

// {
//   sql: 'where field1 = 1 and field2 = 2 and (field3 = 3 or field4 = 4 or (field5 = 5 and field6 = 6 and (field7 = 7 or field8 = 8)))',
//   args: []
// }
console.log(w.do())

// {
//   sql: 'where field1 = ? and field2 = ? and (field3 = ? or field4 = ? or (field5 = ? and field6 = ? and (field7 = ? or field8 = ?)))',
//   args: [ 1, 2, 3, 4, 5, 6, 7, 8]
// }
console.log(w.do(false))

const o = new Sqler.Order()
o.add('field1', 'asc')
o.add('field2', 'desc')

// order by field1 asc, field2 desc
console.log(o.do())

const g = new Sqler.Group()
g.add('field1')
g.add('field2', 'field3')

// group by field1, field2, field3
console.log(g.do())
