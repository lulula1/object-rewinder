import DeleteChange from '../src/changes/DeleteChange'

describe('test basic behaviours', function () {
    it('should set and reset property value', function () {
        let change = new DeleteChange(0, 'x')
        let obj = {}
        expect(change.forward(obj)).toEqual({})
        expect(obj).toEqual({})
        obj = { x: 42 }
        expect(change.forward(obj)).toEqual({})
        expect(obj).toEqual({})
        obj = {}
        expect(change.back(obj)).toEqual({ x: 0 })
        expect(obj).toEqual({ x: 0 })
    })
})