let form = document.querySelector('form');
let imageList = document.querySelector('#pictures');
let buttons = document.querySelector('.navButtons');

form.onsubmit = async event => {
    event.preventDefault();

    let search = form.search.value;
    let color = form.color.value;
    let pageNr = 1;

    empty(imageList);
    empty(buttons);

    let url = "https://pixabay.com/api/?key=33470155-a1510963a99de7f2888f9d89f&q=" + search + "&colors=" + color + "&per_page=10" + "&page=" + pageNr;

    let response = await fetch(url);
    let json = await response.json();

    let result = json.hits;
    let totalHits = json.totalHits;
    let totalPages = Math.ceil(totalHits / result.length);

    importResults(json);

    form.search.value = "";
    form.color.value = "";

    nextPage = true;

    if (nextPage === true) {

        let navButtonPrevious = document.createElement('button');
        let navButtonNext = document.createElement('button');

        navButtonPrevious.textContent = "Previous Page";
        navButtonNext.textContent = "Next page";

        buttons.appendChild(navButtonPrevious);
        buttons.appendChild(navButtonNext);

        navButtonPrevious.disabled = true;

        if (pageNr === totalPages) {
            navButtonNext.disabled = true;
        }

        navButtonNext.onclick = async event => {
            event.preventDefault();

            empty(imageList);

            pageNr++;
            let url = "https://pixabay.com/api/?key=33470155-a1510963a99de7f2888f9d89f&q=" + search + "&colors=" + color + "&per_page=10" + "&page=" + pageNr;

            let response = await fetch(url);
            let json = await response.json();

            importResults(json);

            navButtonPrevious.disabled = false;

            if (pageNr === totalPages) {
                navButtonNext.disabled = true;
            }
        };

        navButtonPrevious.onclick = async event => {
            event.preventDefault();

            empty(imageList);
            pageNr--;
            let url = "https://pixabay.com/api/?key=33470155-a1510963a99de7f2888f9d89f&q=" + search + "&colors=" + color + "&per_page=10" + "&page=" + pageNr;

            let response = await fetch(url);
            let json = await response.json();

            importResults(json);

            if (pageNr === totalPages) {
                navButtonNext.disabled = true;
            }

            if (pageNr < 2) {
                navButtonPrevious.disabled = true;
            }

            navButtonNext.disabled = false;
        }
    };
}

function empty(element) {
    while (element.firstElementChild) {
        element.firstElementChild.remove();
    }
}

function importResults(json) {

    for (let hit of json.hits) {

        let img = document.createElement('img');
        img.src = hit.webformatURL;
        img.alt = hit.tags;

        let link = document.createElement('a');
        link.href = hit.largeImageURL;
        link.appendChild(img);

        link.onclick = function (event) {
            event.preventDefault();
            window.open(this.href, '_blank');
        }

        let li = document.createElement('li');
        li.appendChild(link);
        imageList.appendChild(li);

        let user = document.createElement('div');
        user.className = 'user-line';
        user.textContent = hit.user;
        li.appendChild(user);

        let info = document.createElement('div');
        info.className = 'info-line';
        info.textContent = hit.tags;
        li.appendChild(info);


    }

}