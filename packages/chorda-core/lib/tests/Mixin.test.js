"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var mix_1 = require("../src/mix");
describe('Mixin', function () {
    it('Should mix options', function () {
        var m = mix_1.mixin({ name: 'Alice' }, { name: 'Bob' });
        chai_1.expect(m.entries).to.deep.eq([{ name: 'Alice' }, { name: 'Bob' }]);
    });
});
//# sourceMappingURL=Mixin.test.js.map