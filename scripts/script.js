const button = document.querySelector('button');
const input = document.querySelector('input');
const replies = document.querySelector('.replies');

const photoInput= document.getElementById('photo-input');

photoInput.addEventListener('change', (e) => {
    let file = e.target.files[0];
    let types = ['image/jpeg', 'image/gif', 'image/png']

    if (!file || !types.includes(file.type)) {
        e.target.value =null;
        // return
        throw new TypeError('Wrong type of file');
    }
    uploadPhoto(file);
});

function uploadPhoto(photo) {
    let container = {
        url: '/photos',
        resolve:  onSucces,
        reject: onError,
        data: photo
    };
    function onSucces(response) {
        console.log(response);
    }
    post(container)
}

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




function post(params) {
    let xhr = new XMLHttpRequest();

    let formData = new FormData();
    formData.append('file', params.data);

    xhr.onreadystatechange = function() {
        if (xhr.status == 200 && xhr.readyState == 4) {
            params.resolve(JSON.parse(xhr.responseText));
        }
    }

    xhr.para
    xhr.open('POST', params.url, true);
    xhr.send(formData);
}

function get(url, resolve, reject) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            resolve(JSON.parse(xhr.responseText));
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