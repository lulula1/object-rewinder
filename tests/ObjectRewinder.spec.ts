import IObjectRewinder, { State } from '../src/IObjectRewinder'
import ObjectRewinder from '../src/ObjectRewinder'

let dataset: { [k: string]: any } = null
let testcase: IObjectRewinder = null

beforeEach(function () {
  dataset = {}
  testcase = new ObjectRewinder(dataset)
  dataset = testcase.getObject()
})

afterEach(function () {
  testcase = null
  dataset = null
})

describe('test basic methods', function () {
  it('should forward history', function () {
    expect(dataset).toEqual({})
    testcase.forward()
    expect(dataset).toEqual({})
    dataset.x = 42
    expect(dataset).toEqual({ x: 42 })
    testcase.back()
    expect(dataset).toEqual({})
    testcase.forward()
    expect(dataset).toEqual({ x: 42 })
  })

  it('should rewind history', function () {
    expect(dataset).toEqual({})
    testcase.back()
    expect(dataset).toEqual({})
    dataset.x = 42
    expect(dataset).toEqual({ x: 42 })
    testcase.back()
    expect(dataset).toEqual({})
  })

  it('should go to a history state', function () {
    expect(dataset).toEqual({})
    dataset.x = 42
    dataset.y = 69
    dataset.z = 0
    expect(dataset).toEqual({ x: 42, y: 69, z: 0 })
    testcase.go(-2)
    expect(dataset).toEqual({ x: 42 })
    testcase.go(-2) // Exceed by 1 step
    expect(dataset).toEqual({})
    testcase.go(1)
    expect(dataset).toEqual({ x: 42 })
    testcase.go(3) // Exceed by 1 step
    expect(dataset).toEqual({ x: 42, y: 69, z: 0 })
  })

  it('should save history state', function () {
    expect(testcase.saveState()).toEqual(0 as State)
    expect(testcase.saveState()).toEqual(0 as State)
    dataset.x = 42 // Should update state
    expect(testcase.saveState()).toEqual(1 as State)
    dataset.x // Should NOT update state
    expect(testcase.saveState()).toEqual(1 as State)
    delete dataset.x // Should update state
    expect(testcase.saveState()).toEqual(2 as State)
  })

  it('should load history state', function () {
    expect(dataset).toEqual({})
    testcase.loadState(0 as State)
    expect(dataset).toEqual({})
    testcase.loadState(-1 as State) // Exceed state
    expect(dataset).toEqual({})
    dataset.x = 42
    dataset.y = 69
    dataset.z = 0
    expect(dataset).toEqual({ x: 42, y: 69, z: 0 })
    testcase.loadState(1 as State)
    expect(dataset).toEqual({ x: 42 })
    testcase.loadState(4 as State)  // Exceed state
    expect(dataset).toEqual({ x: 42 })
    testcase.loadState(3 as State)
    expect(dataset).toEqual({ x: 42, y: 69, z: 0 })
  })

  it('should delete and restore properties', function () {
    expect(dataset).toEqual({})
    dataset.x = 42
    expect(dataset).toEqual({ x: 42 })
    delete dataset.x
    expect(dataset).toEqual({})
    testcase.back()
    expect(dataset).toEqual({ x: 42 })
  })

  it('should delete and restore nested properties', function () {
    expect(dataset).toEqual({})
    dataset.obj = {}
    expect(dataset).toEqual({ obj: {} })
    dataset.obj.x = 42
    expect(dataset).toEqual({ obj: { x: 42 } })
    delete dataset.obj
    expect(dataset).toEqual({})
    testcase.back()
    expect(dataset).toEqual({ obj: { x: 42 } })
  })
})

describe('test method combinations', function () {

  it('should test combination of back, forward, saveState', function () {
    // TODO - Test back, forward and saveState
    expect(testcase.saveState()).toEqual(0 as State)
    testcase.forward()
    expect(testcase.saveState()).toEqual(0 as State)
    dataset.x = 42
    expect(testcase.saveState()).toEqual(1 as State)
    testcase.back()
    expect(testcase.saveState()).toEqual(0 as State)
    testcase.forward()
    expect(testcase.saveState()).toEqual(1 as State)
  })

  it('should test combination of saveState and loadState', function () {
    expect(dataset).toEqual({})
    dataset.x = 42
    let state = testcase.saveState()
    dataset.y = 69
    dataset.z = 0
    expect(dataset).toEqual({ x: 42, y: 69, z: 0 })
    testcase.loadState(state)
    expect(dataset).toEqual({ x: 42 })
  })
})

describe('test method behaviours', function () {
  it('should restore altered objects', function () {
    expect(dataset).toEqual({})
    let obj: any = {}
    dataset.obj = obj
    expect(dataset).toEqual({ obj: {} })
    obj.x = 42
    expect(dataset).toEqual({ obj: {} })
    delete dataset.obj
    expect(dataset).toEqual({})
    obj.x = 69
    testcase.back()
    expect(dataset).toEqual({ obj: {} })
  })

  it('should delete property on rewind', function () {
    expect(dataset).toEqual({})
    dataset.x = 42
    expect(dataset).toEqual({ x: 42 })
    testcase.back()
    expect(Object.keys(dataset).length).toBe(0)
  })
})

})