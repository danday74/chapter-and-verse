const chai = require('chai')
const expect = chai.expect

const example = require('./example')

describe('example', () => {
  it('example', () => {
    const value = example()
    expect(value).to.equal(1)
  })
})
