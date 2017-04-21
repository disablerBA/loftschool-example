let allFriendsListTemplateFn = require('../all-friends-list.hbs');
let selectedFriendsListTemplateFn = require('../selected-friends-list.hbs');

let friendSelector = document.querySelector('#friend-selector');
let allFriendsDiv = document.querySelector('#all-friends-list');
let selectedFriendsDiv = document.querySelector('#selected-friends-list');
let saveButton = document.querySelector('#saveButton');

let allFriends = [];
let selectedFriends = [];

let friendsPromise = getFriends();

login().then(() => {
    return friendsPromise;
}).then(result => {
    if (isSavedFriendsToLocalStorage()) {
        actualizeFriends(result);
    } else {
        initializeFriends(result);
    }

    renderFriends(allFriends, selectedFriends);
}).catch((e) => {
    alert(`Ошибка ${e}`)
});

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

function renderFriends(allFriendsId, selectedFriendsId) {
    renderAllFriends(allFriendsId);
    renderSelectedFriends(selectedFriendsId);
}

function renderAllFriends(friendsToRenderId) {
    friendsPromise.then( friends => {
        let friendsToRender = friends.filter(f => friendsToRenderId.indexOf(f.id) !== -1);
        allFriendsDiv.innerHTML = allFriendsListTemplateFn({friends: friendsToRender});
    });
}

function renderSelectedFriends(friendsToRenderId) {
    friendsPromise.then( friends => {
        let friendsToRender = friends.filter(f => friendsToRenderId.indexOf(f.id) !== -1);
        selectedFriendsDiv.innerHTML = selectedFriendsListTemplateFn({friends: friendsToRender});
    });
}

function initializeFriends(friends) {
    allFriends = friends.map(friend => {
        return friend.id;
    });

    selectedFriends = [];
}

function actualizeFriends(friends) {
    actualizeAllFriends(friends);
    actualizeSelectedFriends(friends);
}

function actualizeAllFriends(friends) {
    selectedFriends = JSON.parse(localStorage.selectedFriends);

    allFriends = friends.map(f => f.id).filter(id => selectedFriends.indexOf(id) === -1);
    localStorage.allFriends = JSON.stringify(allFriends);
}

function actualizeSelectedFriends(friends) {
    selectedFriends = JSON.parse(localStorage.selectedFriends);

    selectedFriends = selectedFriends.filter(id => friends.map(f => f.id).indexOf(id) !== -1);
    localStorage.selectedFriends = JSON.stringify(selectedFriends);
}

function isSavedFriendsToLocalStorage() {
    return localStorage.allFriends && localStorage.selectedFriends;
}

function saveFriendsToLocalStorage() {
    localStorage.allFriends = JSON.stringify(allFriends);
    localStorage.selectedFriends = JSON.stringify(selectedFriends);
}

function isMatching(fullName, chunkName) {
    if (chunkName === "") return false;
    return fullName.toLowerCase().indexOf(chunkName.trim().toLowerCase()) !== -1;
}


friendSelector.addEventListener('keyup', event => {
    if (event.target.id === 'allFriendsFilter') {
        let allFriendsFilter = document.querySelector('#allFriendsFilter');
        let search = allFriendsFilter.value;

        if (search.length === 0) {
            renderAllFriends(allFriends);
            return;
        }

        filterFriends(allFriends, search).then(filtered => renderAllFriends(filtered));
    }

    if (event.target.id === 'selectedFriendsFilter') {
        let selectedFriendsFilter = document.querySelector('#selectedFriendsFilter');
        let search = selectedFriendsFilter.value;

        if (search.length === 0) {
            renderSelectedFriends(selectedFriends);
            return;
        }

        filterFriends(selectedFriends, search).then(filtered => renderSelectedFriends(filtered));
    }
});

function filterFriends(friends, chunkName) {
    return friendsPromise.then(result => {

        let filtered = result.filter(f => friends.indexOf(f.id) !== -1)
                             .filter(f => isMatching(f.first_name.concat(' ', f.last_name), chunkName));
        return filtered.map(f => f.id);
    });
}

friendSelector.addEventListener('click', event => {
    friendsPromise.then(() => {
        if (event.target.dataset.role == 'toSelected') {
            toSelected(event.target.dataset.id);
            renderFriends(allFriends, selectedFriends);
        }

        if (event.target.dataset.role == 'toAll') {
            toAll(event.target.dataset.id);
            renderFriends(allFriends, selectedFriends);
        }

        if (event.target.id == 'saveButton') {
            saveFriendsToLocalStorage();
        }
    });
});

function toSelected(id) {
    id = +id;
    selectedFriends.push(id);
    allFriends = allFriends.filter(i => i !== id);
}

function toAll(id) {
    id = +id;
    allFriends.push(id);
    selectedFriends = selectedFriends.filter(i => i !== id);
}

document.addEventListener('drop', e => {
    e.preventDefault();
    var id = e.dataTransfer.getData('text');

    if (e.target.id === 'selected-friends-list' || e.target.parentNode.closest('#selected-friends-list')) {
        toSelected(id);
        renderFriends(allFriends, selectedFriends);
    }
    if (e.target.id === 'all-friends-list' || e.target.parentNode.closest('#all-friends-list')) {
        toAll(id);
        renderFriends(allFriends, selectedFriends);
    }
});

document.addEventListener('dragover', e => {
    if (e.target.id === 'selected-friends-list' || e.target.id === 'all-friends-list' ||
        e.target.parentNode.closest('#selected-friends-list') || e.target.parentNode.closest('#all-friends-list')) {
        e.preventDefault();
    }
});

document.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text', e.target.dataset.id);
});