let allFriendsListTemplateFn = require('../all-friends-list.hbs');
let selectedFriendsListTemplateFn = require('../selected-friends-list.hbs');

let friendSelector = document.querySelector('#friend-selector');
let allFriendsDiv = document.querySelector('#all-friends-list');
let selectedFriendsDiv = document.querySelector('#selected-friends-list');

let allFriends = [];
let selectedFriends = [];

function login() {
    return new Promise((resolve, reject) => {
        VK.init({
            apiId: 5561322
        });

        VK.Auth.login(function(result) {
            if (result.status == 'connected') {
                resolve();
            } else {
                reject();
            }
        });
    });
}

function getFriends() {
    return new Promise((resolve, reject) => {
        VK.api('friends.get', { v: 5.62, fields: 'photo_50' }, function(result) {
            if (result.error) {
                reject();
            } else {
                resolve(result.response.items);
            }
        })
    });
}

function renderAllFriends(friends) {
    allFriendsDiv.innerHTML = allFriendsListTemplateFn({friends: friends});
}

function renderSelectedFriends(friends) {
    selectedFriendsDiv.innerHTML = selectedFriendsListTemplateFn({friends: friends});
}

function actualizeLocalStorage(friends) {
    actualizeAllFriends(friends);
    actualizeSelectedFriends(friends);
}

function actualizeAllFriends(friends) {
    let allFriends = JSON.parse(localStorage.allFriends);
    let selectedFriends = JSON.parse(localStorage.selectedFriends);

    friends.forEach(friend => {
        if (allFriends.indexOf(friend.id) == -1 && selectedFriends.indexOf(friend.id) == -1) {
            console.log(`добавляю друга к списку всех друзей ${friend.last_name}`);
            allFriends.push(friend.id);
        }
    });

    for (let i = 0; i < allFriends.length; i++) {
        if (friends.indexOf(allFriends[i]) == -1) {
            allFriends.splice(i, 1);
        }
    }

    localStorage.allFriends = JSON.stringify(allFriends);
    console.log('закончил обновление хранилища для всех друзей');
}

function actualizeSelectedFriends(friends) {
    console.log('обновляю хранилище для выбранных друзей');
    let selectedFriends = JSON.parse(localStorage.selectedFriends);

    for (let i = 0; i < selectedFriends.length; i++) {
        if (friends.indexOf(selectedFriends[i]) == -1) {
            selectedFriends.splice(i, 1);
        }
    }

    localStorage.selectedFriends = JSON.stringify(selectedFriends);
    console.log('закончил обновление хранилища для выбранных друзей');
}

function isSavedFriendsToLocalStorage() {
    return localStorage.allFriends && localStorage.selectedFriends;
}

function saveFriendsToLocalStorage(friends) {
    localStorage.allFriends = JSON.stringify(friends);
    localStorage.selectedFriends = JSON.stringify([]);
}

login().then(() => {
    return getFriends();
}).then(result => {

    /*if (!isSavedFriendsToLocalStorage()) {
        saveFriendsToLocalStorage(result);
    } else {
        actualizeLocalStorage(result);
    }*/

    allFriends = result;

    renderAllFriends(allFriends);
    renderSelectedFriends(selectedFriends);

    friendSelector.addEventListener('click', event => {
        if (!event.target.dataset.role) {
            return;
        }

        if (event.target.dataset.role == 'toSelected') {
            for (let i = 0; i < allFriends.length; i++) {
                if (allFriends[i].id == event.target.dataset.id) {
                    selectedFriends.push(allFriends[i]);
                    allFriends.splice(i, 1);
                    break;
                }
            }

            renderAllFriends(allFriends);
            renderSelectedFriends(selectedFriends);
        }

        if (event.target.dataset.role == 'toAll') {
            for (let i = 0; i < selectedFriends.length; i++) {
                if (selectedFriends[i].id == event.target.dataset.id) {
                    allFriends.push(selectedFriends[i]);
                    selectedFriends.splice(i, 1);
                    break;
                }
            }

            renderAllFriends(allFriends);
            renderSelectedFriends(selectedFriends);
        }
    });

}).catch((e) => {
    alert(`Ошибка ${e}`)
});