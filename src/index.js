let commentsPopupTemplateFn = require('../comments-popup.hbs');
let commentsTemplateFn = require('../comments.hbs');
let balloonBodyTemplateFn = require('../balloonBody.hbs');

var myMap;
var clusterer;

ymaps.ready(init);

function init() {
    myMap = new ymaps.Map('map', {
        center: [55.751574, 37.573856],
        zoom: 9
    }, {
        searchControlProvider: 'yandex#search',
    });

    clusterer = new ymaps.Clusterer({
        /**
         * Через кластеризатор можно указать только стили кластеров,
         * стили для меток нужно назначать каждой метке отдельно.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage.xml
         */
        preset: 'islands#invertedVioletClusterIcons',
        /**
         * Ставим true, если хотим кластеризовать только точки с одинаковыми координатами.
         */
        groupByCoordinates: false,
        /**
         * Опции кластеров указываем в кластеризаторе с префиксом "cluster".
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark.xml
         */
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterDisableClickZoom: true,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false
    });

    myMap.geoObjects.add(clusterer);

    myMap.events.add('click', (e) => {
        const coords = e.get('coords');

        ymaps.geocode(coords).then((res) => {
            if (!isOpenPopup()) {
                const title = res.geoObjects.get(0).properties.get('name');
                openPopup(title, e.get('offsetX'), e.get('offsetY'), coords);
            } else {
                closePopup();
            }
        })
    });
}

function openPopup(title, offsetX, offsetY, coords) {
    const commentsPopup = document.createElement('div');
    commentsPopup.innerHTML = commentsPopupTemplateFn({title: title});
    commentsPopup.id = 'commentsPopup';
    commentsPopup.className = 'container';
    commentsPopup.style.left = `${offsetX}px`;
    commentsPopup.style.top = `${offsetY}px`;
    document.body.appendChild(commentsPopup);

    const closeButton = document.querySelector('.closeButton');
    closeButton.onclick = function () {
        closePopup();
    };

    const addCommentButton = commentsPopup.querySelector('#addCommentButton');
    addCommentButton.onclick = function () {
        const senderNameInput = commentsPopup.querySelector('#senderNameInput');
        const placeInput = commentsPopup.querySelector('#placeInput');
        const messageTextArea = commentsPopup.querySelector('#messageTextArea');
        const currentTime = new Date();
        const comment = {
            title: title,
            senderName: senderNameInput.value,
            time: currentTime,
            place: placeInput.value,
            message: messageTextArea.value
        };
        addCommentToLocalStorage(coords, comment);
        updateComments(coords);
        addMarkerOnMap(coords);
        senderNameInput.value = '';
        placeInput.value = '';
        messageTextArea.value = '';
    }
}

function closePopup() {
    const popup = document.querySelector('#commentsPopup');
    document.body.removeChild(popup);
}

function isOpenPopup() {
    return !!document.querySelector('.closeButton');
}

function addCommentToLocalStorage(key, comment) {
    const comments = window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : [];
    comments.push(comment);
    window.localStorage.setItem(key, JSON.stringify(comments));
}

function addMarkerOnMap(coords) {
    const comments = JSON.parse(window.localStorage.getItem(coords));
    const lastComment = comments[comments.length - 1];

    const content = `<a href="#">${lastComment.title}</a><br>${lastComment.message}`;
    // const content = balloonBodyTemplateFn(lastComment);

    const myPlacemark = new ymaps.Placemark(coords, {
        balloonContentHeader: lastComment.place,
        balloonContentBody: content,
        balloonContentFooter: lastComment.time,
    });

    myPlacemark.events.add('click', function (e) {
        if (!isOpenPopup()) {
            openPopup(lastComment.title, e.get('offsetX'), e.get('offsetY'), coords);
            updateComments(coords);
        }
    });

    myMap.geoObjects.add(myPlacemark);
    clusterer.add(myPlacemark);
}

function updateComments(key) {
    const comments = window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : [];

    const popup = document.querySelector('#commentsPopup');
    const commentsPanel = popup.querySelector('#comments');

    commentsPanel.innerHTML = commentsTemplateFn({comments});
}