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
    if (isEmptyArray(array) ) {
        throw new Error("empty array");
    }

    if (!isFunction(fn)) {
        throw new Error("fn is not a function");
    }

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
    if (isEmptyArray(array) ) {
        throw new Error("empty array");
    }

    if (!isFunction(fn)) {
        throw new Error("fn is not a function");
    }

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
    if (!isFunction(fn)) {
        throw new Error("fn is not a function");
    }

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
function calculator(number) {
    if (!isFinite(number)) {
        throw new Error("number is not a number");
    }

    var result = {};

    result.sum = function() {
        var res = number;
        for (var i = 0; i < arguments.length; i++) {
            res += arguments[i];
        }

        return res;
    }

    result.dif = function() {
        var res = number;
        for (var i = 0; i < arguments.length; i++) {
            res -= arguments[i];
        }

        return res;
    }

    result.div = function() {
        var res = number;
        for (var i = 0; i < arguments.length; i++) {
            res /= arguments[i];
        }

        return res;
    }

    result.mul = function() {
        var res = number;
        for (var i = 0; i < arguments.length; i++) {
            res *= arguments[i];
        }

        return res;
    }

    return result;
}

export {
    isAllTrue,
    isSomeTrue,
    returnBadArguments,
    findError,
    calculator
};
