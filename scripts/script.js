const button = document.querySelector('button');
const input = document.querySelector('input');
const replies = document.querySelector('.replies');

button.addEventListener('click', addReply);
input.addEventListener('keydown', (e) => {
    if (e.which == 13) {
        addReply();
    }
});

function onError(e) {
    throw new Error(e.message)
}

function addReply() {
    const text = input.value.trim();

    if (!text.length) {
        return;
    }
    const reply = document.createElement('div');
    reply.classList.add('reply');
    reply.innerHTML = `<p>${text}</p>`;
    replies.appendChild(reply);
    input.value = null;
}

function drawPhotos(photos) {
    const gallery = document.getElementById('gallery');

    photos.forEach(drawPhoto);

    function drawPhoto(photo) {
        const container = document.createElement('div');
        const img = document.createElement('img');

        container.classList.add('photo');
        img.src = photo.url;

        container.appendChild(img);
        gallery.appendChild(container);
    }
}

function drawProfile(profile) {
    const avatar = document.querySelector('.avatar');
    const name = document.querySelector('.name');
    const phone = document.querySelector('.phone');
    const email = document.querySelector('.email');

    avatar.src = profile.picture.large;
    name.textContent = `${profile.name.first} ${profile.name.last}`;
    phone.textContent = profile.cell;
    email.textContent = profile.email;
}

function drawFriends(friendList) {
    const friends = document.getElementById('friends');

    friendList.forEach((friend) => {
        const container = document.createElement('div');
        const img = document.createElement('img');
        container.classList.add('friend');
        img.src = friend.picture.large;
        container.appendChild(img);
        friends.appendChild(container);
    });
}

function get(url, callback) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };

    xhr.onerror = function(e) {
        onError(e)
    }

    xhr.open('GET', url, true);
    xhr.send(null);
}

get('/photos', (response) => {
    drawPhotos(response.photos);
    get('https://randomuser.me/api/', (response) => {
        drawProfile(response.results[0]);
        get('https://randomuser.me/api/?results=15', (response) => {
            drawFriends(response.results);
        }, onError);
    }, onError);
}, onError);