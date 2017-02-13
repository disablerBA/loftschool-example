const nativeSlice = Array.prototype.slice;
const nativeMap = Array.prototype.map;
const nativeReduce = Array.prototype.reduce;

import assert from 'assert';
import {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
} from '../src/index';

describe('ДЗ 3 - объекты и массивы', () => {
    describe('forEach', () => {
        it('должна вызывать функцию для каждого элемента массива и передавать элемент первым аргументом', () => {
            let array = [1, 2, 3, 4, 5];
            let passed = [];

            forEach(array, el => passed.push(el));

            assert.deepEqual(array, passed);
        });

        it('должна передавать индекс элемента вторым аргументом', () => {
            let array = [1, 2, 3, 4, 5];
            let index = 0;

            forEach(array, (el, i) => assert.equal(i, index++));
        });

        it('должна передавать сам массив третьим аргументом', () => {
            let array = [1, 2, 3, 4, 5];

            forEach(array, (el, i, a) => assert.strictEqual(a, array));
        });
    });

    describe('map', () => {
        it('должна вызывать функцию для каждого элемента массива и передавать элемент первым аргументом', () => {
            let array = [1, 2, 3, 4, 5];
            let passed = [];

            map(array, el => passed.push(el));

            assert.deepEqual(array, passed);
        });

        it('должна передавать индекс элемента вторым аргументом', () => {
            let array = [1, 2, 3, 4, 5];
            let index = 0;

            map(array, (el, i) => assert.equal(i, index++));
        });

        it('должна передавать сам массив третьим аргументом', () => {
            let array = [1, 2, 3, 4, 5];

            map(array, (el, i, a) => assert.strictEqual(a, array));
        });

        it('должна возвращать измененную копию массива', () => {
            let array = [1, 2, 3, 4, 5];
            let target = nativeMap.call(array, el => el ** 2);
            let result = map(array, el => el ** 2);

            assert.deepEqual(result, target);
        });

        it('не должна изменять оригинальный массив', () => {
            let array = [1, 2, 3, 4, 5];
            let arrayCopy = nativeSlice.call(array);

            map(array, el => el ** 2);
            assert.deepEqual(array, arrayCopy);
        });
    });

    describe('reduce', () => {
        it('должна вызывать функцию для каждого элемента и передавать предыдущий результат первым аргументом', () => {
            let array = [1, 2, 3, 4, 5];
            let i = 0;
            let prevResult = array[0];

            reduce(array, prev => {
                assert.equal(prev, prevResult);

                return prevResult = i++;
            });
        });

        it('должна учитывать initial', () => {
            let array = [1, 2, 3, 4, 5];
            let passed = [];

            reduce(array, prev => passed.push(prev), 10);
            assert.deepEqual(passed[0], 10);
        });

        it('если initial не указан, то при первой итерации в prev передается первый элемент массива', () => {
            let array = [1, 2, 3, 4, 5];
            let passed = [];

            reduce(array, prev => passed.push(prev));
            assert.deepEqual(passed[0], 1);
        });

        it('должна передавать элемент вторым аргументом', () => {
            let array = [1, 2, 3, 4, 5];
            let passed = [];

            reduce(array, (prev, el) => passed.push(el));
            assert.deepEqual(array.slice(1), passed);

            passed = [];
            reduce(array, (prev, el) => passed.push(el), 10); // с учетом initial
            assert.deepEqual(array, passed);
        });

        it('должна передавать индекс элемента третьим аргументом', () => {
            let array = [1, 2, 3, 4, 5];
            let index = 1;

            reduce(array, (prev, el, i) => assert.equal(i, index++));

            index = 0;
            reduce(array, (prev, el, i) => assert.equal(i, index++), 10); // с учетом initial
        });

        it('должна передавать сам массив четвертым аргументом', () => {
            let array = [1, 2, 3, 4, 5];

            reduce(array, (prev, el, i, a) => assert.strictEqual(a, array));
        });

        it('не должна изменять оригинальный массив', () => {
            let array = [1, 2, 3, 4, 5];
            let arrayCopy = nativeSlice.call(array);

            reduce(array, el => el ** 2);
            assert.deepEqual(array, arrayCopy);
        });

        it('общая проверка работоспособности', () => {
            let array = [1, 2, 3, 4, 5];
            let target = nativeReduce.call(array, (prev, el) => prev + el);
            let result = reduce(array, (prev, el) => prev + el);

            assert.deepEqual(result, target);

            target = nativeReduce.call(array, (prev, el) => prev + el, 10);
            result = reduce(array, (prev, el) => prev + el, 10);
            assert.deepEqual(result, target);
        });
    });

    describe('deleteProperty', () => {
        it('должна удалять указанное свойство из объекта', () => {
            let obj = { a: 1 };

            deleteProperty(obj, 'a');

            assert.equal('a' in obj, false)
        });
    });

    describe('hasProperty', () => {
        it('должна возвращать true если объект имеет указанное свойство и false в противном случае', () => {
            let obj = { a: 1 };

            assert.equal(hasProperty(obj, 'a'), true);
            assert.equal(hasProperty(obj, 'b'), false);
        });
    });

    describe('getEnumProps', () => {
        it('должна возвращать массив только с перечисляемыми свойствами', () => {
            let obj = { a: 1, b: 2 };
            let target = ['a', 'b'];
            let result;

            Object.defineProperty(obj, 'c', { enumerable: false });
            result = getEnumProps(obj);

            assert.deepEqual(result, target);
        });
    });

    describe('upperProps', () => {
        it('должна возвращать массив с именами свойств и преобразовывать эти имена в верхний регистр', () => {
            let obj = { a: 1, b: 2 };
            let target = ['A', 'B'];
            let result = upperProps(obj);

            assert.deepEqual(result, target);
        });
    });

    describe('slice', () => {
        it('общая проверка работоспособности', () => {
            let array = [1, 2, 3, 4, 5, 6, 7];
            let target = nativeSlice.call(array);
            let result = slice(array);

            assert.deepEqual(result, target);

            target = nativeSlice.call(array, 0);
            result = slice(array, 0);
            assert.deepEqual(result, target);

            target = nativeSlice.call(array, 0, 0);
            result = slice(array, 0, 0);
            assert.deepEqual(result, target);

            target = nativeSlice.call(array, 0, 1);
            result = slice(array, 0, 1);
            assert.deepEqual(result, target);

            target = nativeSlice.call(array, 0, 2);
            result = slice(array, 0, 2);
            assert.deepEqual(result, target);

            target = nativeSlice.call(array, 0, 5);
            result = slice(array, 0, 5);
            assert.deepEqual(result, target);

            target = nativeSlice.call(array, 0, -1);
            result = slice(array, 0, -1);
            assert.deepEqual(result, target);

            target = nativeSlice.call(array, 0, -3);
            result = slice(array, 0, -3);
            assert.deepEqual(result, target);

            target = nativeSlice.call(array, 0, -10000);
            result = slice(array, 0, -10000);
            assert.deepEqual(result, target);

            target = nativeSlice.call(array, 3);
            result = slice(array, 3);
            assert.deepEqual(result, target);

            target = nativeSlice.call(array, 3, -100);
            result = slice(array, 3, -100);
            assert.deepEqual(result, target);

            target = nativeSlice.call(array, 3, 100);
            result = slice(array, 3, 100);
            assert.deepEqual(result, target);

            target = nativeSlice.call(array, 3, 5);
            result = slice(array, 3, 5);
            assert.deepEqual(result, target);

            target = nativeSlice.call(array, 9999);
            result = slice(array, 9999);
            assert.deepEqual(result, target);

            target = nativeSlice.call(array, -9999);
            result = slice(array, -9999);
            assert.deepEqual(result, target);

            target = nativeSlice.call(array, -9999, 4);
            result = slice(array, -9999, 4);
            assert.deepEqual(result, target);

            target = nativeSlice.call(array, -9999, -4);
            result = slice(array, -9999, -4);
            assert.deepEqual(result, target);
        });
    });

    describe('createProxy', () => {
        it('должна вернуть Proxy, который возводит в квадрат любое записываемое значение', () => {
            let obj = {};

            obj = createProxy(obj);

            obj.a = 2;
            obj.b = 5;

            assert.equal(obj.a, 4);
            assert.equal(obj.b, 25);
        });
    });
});
