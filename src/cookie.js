/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */
import {createCookie, deleteCookie} from "./index";

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');

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

/**
 * Создает новый tr для таблицы со списком cookie
 *
 * @param name - имя cookie
 * @param value - значение cookie
 */
function createCookieTr(name, value) {
    const trRow = document.createElement('tr');

    const thName = document.createElement('th');
    thName.textContent = name;

    const thValue = document.createElement('th');
    thValue.textContent = value;

    const thDeleteButton = document.createElement('button');
    thDeleteButton.textContent = 'Удалить';
    thDeleteButton.addEventListener('click', () => {
        deleteCookie(name);
        updateTable();
    });

    trRow.appendChild(thName);
    trRow.appendChild(thValue);
    trRow.appendChild(thDeleteButton);

    listTable.appendChild(trRow);
}

filterNameInput.addEventListener('keyup', function () {
    updateTable();
});

addButton.addEventListener('click', () => {
    if (addNameInput.value === '' || addValueInput.value === '') {
        console.log(document.cookie);
        return;
    }

    createCookie(addNameInput.value, addValueInput.value);
    updateTable();
});

document.addEventListener('DOMContentLoaded', function () {
    const cookie = document.cookie;
    if (cookie === '') {
        return;
    }

    const cookieArray = cookie.split('; ').map(cookie => cookie.split('='));

    cookieArray.forEach(cookie => {
        createCookieTr(cookie[0], cookie[1]);
    })
});

function updateTable() {
    listTable.innerHTML = '';
    let cookie = document.cookie;
    const cookieArray = cookie === '' ? [] : cookie.split('; ').map(cookie => cookie.split('='));
    cookieArray.forEach(cookie => {
        if (filterNameInput.value === '' || isMatching(cookie[0], filterNameInput.value) || isMatching(cookie[1], filterNameInput.value)) {
            createCookieTr(cookie[0], cookie[1]);
        }
    });
}

