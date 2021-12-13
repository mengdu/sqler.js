const sqler = require('../dest')

const b = new sqler.Condition("where")

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
console.log(b.do())
