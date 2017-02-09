/* ДЗ 2 - работа с исключениями и отладчиком */

/*
 вспомогательные функции
 */
function isEmptyArray(object) {
    return !Array.isArray(object) || object.length === 0;
}

function isFunction(fn) {
    return typeof fn === 'function';
}

function getArgumentsArray(args) {
    var result = [];

    for (var i = 0; i < args.length; i++) {
        result.push(args[i]);
    }

    return result;
}

function processArray(initialValue, array, fn) {
    var result = initialValue;

    for (var i = 0; i < array.length; i ++) {
        result = fn(result, array[i]);
    }

    return result;
}

function assertIsFunction(fn) {
    if (!isFunction(fn)) {
        throwNotFunctionError();
    }
}

function throwNotFunctionError() {
    throw new Error('fn is not a function');
}

function assertNotEmptyArray(array) {
    if (isEmptyArray(array) ) {
        throwEmptyArrayError();
    }
}

function throwEmptyArrayError() {
    throw new Error('empty array');
}

function assertIsNumber(number) {
    if (!isFinite(number)) {
        throwNotNumberError();
    }
}

function throwNotNumberError() {
    throw new Error('number is not a number');
}

function assertNotDivisionByZero(args) {
    if (isSomeTrue(getArgumentsArray(args), e => e == 0)) {
        throwDivisionByZeroError();
    }
}

function throwDivisionByZeroError() {
    throw new Error('division by 0');
}

/*
 вспомогательные функции
 */

/*
 Задача 1:
 Функция принимает массив и фильтрующую фукнцию и должна вернуть true или false
 Функция должна вернуть true только если fn вернула true для всех элементов массива
 Необходимо выбрасывать исключение в случаях:
 - array не массив или пустой массив (с текстом "empty array")
 - fn не является функцией (с текстом "fn is not a function")
 Зарпещено использовать встроенные методы для работы с массивами
 */
function isAllTrue(array, fn) {
    assertNotEmptyArray(array);
    assertIsFunction(fn);

    var result = true;

    for (var i = 0; i < array.length; i++) {
        if (!fn(array[i])) {
            result = false;
        }
    }

    return result;
}

/*
 Задача 2:
 Функция принимает массив и фильтрующую фукнцию и должна вернуть true или false
 Функция должна вернуть true если fn вернула true хотя бы для одного из элементов массива
 Необходимо выбрасывать исключение в случаях:
 - array не массив или пустой массив (с текстом "empty array")
 - fn не является функцией (с текстом "fn is not a function")
 Зарпещено использовать встроенные методы для работы с массивами
 */
function isSomeTrue(array, fn) {
    assertNotEmptyArray(array);
    assertIsFunction(fn);

    for (var i = 0; i < array.length; i++) {
        if (fn(array[i])) {
            return true;
        }
    }

    return false;
}

/*
 Задача 3:
 Функция принимает заранее неизветсное количество аргументов, первым из которых является функция fn
 Функция должна поочередно запусти fn для каждого переданного аргумента (кроме самой fn)
 Функция должна вернуть массив аргументов, для которых fn выбросила исключение
 Необходимо выбрасывать исключение в случаях:
 - fn не является функцией (с текстом "fn is not a function")
 */
function returnBadArguments(fn) {
    assertIsFunction(fn);

    function getProcessArguments(args) {
        var result = [];

        for (var i = 1; i < args.length; i++) {
            result.push(args[i]);
        }

        return result;
    }

    var result = [];
    var processArguments = getProcessArguments(arguments);

    for (var i = 0; i < processArguments.length; i++) {
        try {
            fn(processArguments[i]);
        } catch (e) {
            result.push(processArguments[i]);
        }
    }

    return result;
}

/*
 Задача 4:
 Используя отладчик и точки остановки, определите в каких случаях if дает true
 Исправьте условие внутри if таким образом, чтобы функция возвращала true
 */
function findError(data1, data2) {
    return (function() {
        for (var i = 0; i < data1.length; i++) {
            if ((data1[i] != data2[i]) && !(isNaN(data1[i]) && isNaN(data2[i]))) {
                return false;
            }
        }

        return true;
    })();
}

/*
 Задача 5:
 Функция имеет параметр number (по умолчанию - 0)
 Функция должна вернуть объект, у которого должно быть несколько методов:
 - sum - складывает number с переданным аргументами
 - dif - вычитает из number переданные аргументы
 - div - делит number на первый аргумент. Результат делится на следующий аргумент (если передан) и так далее
 - mul - умножает number на первый аргумент. Результат умножается на следующий аргумент (если передан) и так далее

 Количество передаваемых в методы аргументов заранее неизвестно
 Необходимо выбрасывать исключение в случаях:
 - number не является числом (с текстом "number is not a number")
 - какой-либо из аргументов div является нулем (с текстом "division by 0")
 */
function calculator(number = 0) {
    assertIsNumber(number);

    var result = {};

    result.sum = function() {
        return processArray(number, getArgumentsArray(arguments), (value1, value2) => value1 + value2);
    };

    result.dif = function() {
        return processArray(number, getArgumentsArray(arguments), (value1, value2) => value1 - value2)
    };

    result.div = function() {
        assertNotDivisionByZero(arguments);

        return processArray(number, getArgumentsArray(arguments), (value1, value2) => value1 / value2)
    };

    result.mul = function() {
        return processArray(number, getArgumentsArray(arguments), (value1, value2) => value1 * value2)
    };

    return result;
}

export {
    isAllTrue,
    isSomeTrue,
    returnBadArguments,
    findError,
    calculator
};
