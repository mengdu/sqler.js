const Sqler = require('../dest')

test('utils.Block', function () {
  const o = new Sqler.Block()
  const { sql } = o.do()
  expect(sql).toBe('')

  o.add('field1 = ?', 1)
  o.add('field2 = ?', 2)
  o.add(() => 'field3 = 3')
  o.add(() => {
    return { sql: 'field4 = ?', args: [4] }
  })

  const { sql: sql1, args } = o.do()
  expect(sql1).toBe('field1 = ? field2 = ? field3 = 3 field4 = ?')
  expect(args).toEqual([1, 2, 4])
  const { sql: sql2 } = o.do(', ')
  expect(sql2).toBe('field1 = ?, field2 = ?, field3 = 3, field4 = ?')
})

test("utils.Condition", function () {
  (() => {
    const w = new Sqler.Where()
    const { sql } = w.do()
    expect(sql).toBe('')
  })();

  (() => {
    const w = new Sqler.Where()
    w.and('field1 = ?', 1)
    w.and('field2 = ?', 2)
    w.and('field3 = ?', '3')
    const { sql } = w.do()
    expect(sql).toBe('where field1 = 1 and field2 = 2 and field3 = \'3\'')

    const { sql: sql2, args } = w.do(false)
    expect(sql2).toBe('where field1 = ? and field2 = ? and field3 = ?')
    expect(args).toEqual([1, 2, '3'])
  })();

  (() => {
    const w = new Sqler.Where()
    w.and('field1 = ?', 1)
    w.or(or => {
      or.add('field2 = ?', 2)
      or.add('field3 = ?', 3)
  
      or.and(and => {
        and.and('field4 = ?', 4)
        and.and('field5 = ?', 5)
      })
    })
    w.and('field6 = ?', 6)
    const { sql } = w.do()
    expect(sql).toBe('where field1 = 1 and (field2 = 2 or field3 = 3 or (field4 = 4 and field5 = 5)) and field6 = 6')

    const { sql: sql2, args } = w.do(false)
    expect(sql2).toBe('where field1 = ? and (field2 = ? or field3 = ? or (field4 = ? and field5 = ?)) and field6 = ?')
    expect(args).toEqual([1, 2, 3, 4, 5, 6])
  })();
})

test('utils.Order', function () {
  const o = new Sqler.Order()
  expect(o.do()).toBe('')

  o.add('field1', 'desc')
  o.add('field2', 'asc')

  expect(o.do()).toBe('order by field1 desc, field2 asc')
})

test('utils.Group', function () {
  const o = new Sqler.Group()
  expect(o.do()).toBe('')

  o.add('field1')
  o.add('field2')

  expect(o.do()).toBe('group by field1, field2')
})
