/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');


/**
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */
function loadTowns() {
    loadingBlock.style.display = "block";
    return require('./index').loadAndSortTowns();
}

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    if (chunk === "") return false;
    return full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1;
}



let loadingBlock = homeworkContainer.querySelector('#loading-block');
loadingBlock.style.display = "none";

let filterBlock = homeworkContainer.querySelector('#filter-block');
filterBlock.style.display = "none";

let filterInput = homeworkContainer.querySelector('#filter-input');
let filterResult = homeworkContainer.querySelector('#filter-result');

let towns;
loadTowns().then(res => {
    loadingBlock.style.display = "none";
    filterBlock.style.display = "block";
    towns = res;
});

function findMatchTowns(towns, chunkName) {
    let result = [];
    towns.forEach(town => {
        if (isMatching(town.name, chunkName)) {
            result.push(town);
        }
    });
    return result;
}

filterInput.addEventListener('keyup', function() {
    let value = this.value.trim();

    filterResult.textContent = "";
    let matchTowns = findMatchTowns(towns, value);
    matchTowns.forEach(town => {
        let newTown = document.createElement("div");
        newTown.textContent = town.name;
        filterResult.appendChild(newTown);
    });
});

export {
    loadTowns,
    isMatching
};
