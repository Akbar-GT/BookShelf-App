// Id Global
const INCOMPLETE_BOOKSHELF_LIST = "incompleteBookshelfList";
const COMPLETE_BOOKSHELF_LIST = "completeBookshelfList";
const STORAGE_KEY = "BOOKSHELF_APP";

// array to store book Object
let books = [];

/**
 * Check whether browser support localStorage or not
 * @returns {boolean} - 1 if yes
 * @returns {boolean} - 0 if no
 */
function isStorageExist() {
    if(typeof(Storage) !== 'undefined') {
        return true;
    } else {
        alert("Browser Anda tidak mendukung penggunaan Storage");
        return false;
    }
}

/**
 * Save data to LocalStorage
 */
function saveData() {
    const stringBooks = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, stringBooks);
    document.dispatchEvent(new Event('ondatasaved'));
}

/**
 * Update data to LocalStorage
 */
function updateLocalData() {
    if(isStorageExist()) {
        saveData();
    }
}

/**
 * Restore data from Local Storage when page loaded
 */
function restoreData() {
    const objectBooks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(objectBooks !== null) {
        books = objectBooks;
    }
    document.dispatchEvent(new Event("ondataloaded"));
}

/**
 * make list of item from Local Storage
 */
function getDataFromLocal() {
    const incompleteBookshelfList = document.getElementById(INCOMPLETE_BOOKSHELF_LIST);
    const completeBookshelfList = document.getElementById(COMPLETE_BOOKSHELF_LIST);

    for(book of books) {
        const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
        newBook["id"] = book.id;

        if(!book.isComplete) {
            incompleteBookshelfList.append(newBook);
        } else {
            completeBookshelfList.append(newBook);
        }
    }
}

/**
 * compose book object to store in books array 
 * @param {string} title - title from book
 * @param {string} author - author from book
 * @param {number} year - year from book
 * @param {boolean} isComplete - reading status of book
 * @returns {object} book object
 */
function composeBookObject(title, author, year, isComplete) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isComplete
    };
}

/**
 * create book item from Input Form
 */
function addBook() {
    const bookTitle = document.getElementById("inputTitle").value;
    const bookAuthor = document.getElementById("inputAuthor").value;
    const bookYear = document.getElementById("inputYear").value;
    const isComplete = document.getElementById("inputisComplete").checked;
    
    const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, isComplete);
    const book = makeBook(bookTitle, bookAuthor, bookYear, isComplete);
    book["id"] = bookObject.id;

    let bookContainer = "";
    if(!isComplete) {
        bookContainer = document.getElementById(INCOMPLETE_BOOKSHELF_LIST);
    } else {
        bookContainer = document.getElementById(COMPLETE_BOOKSHELF_LIST);
    }

    bookContainer.append(book);
    books.push(bookObject);

    updateLocalData();
}

/**
 * make book item container 
 */
function makeBook(title, author, year, isComplete) {
    const container = document.createElement("article");
    container.setAttribute("draggable", true);
    container.classList.add("book-item");
    
    const titleContainer = document.createElement("h3");
    titleContainer.innerText = title;
    
    const authorContainer = document.createElement("p");
    authorContainer.innerText = author;
    
    const yearContainer = document.createElement("p");
    yearContainer.innerText = year;
    
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");

    if(!isComplete) {
        buttonContainer.append(createFinishButton(), createRemoveButton());
    } else {
        buttonContainer.append(createUnfinishedButton(), createRemoveButton());
    }

    container.append(titleContainer, authorContainer, yearContainer, buttonContainer);
    container.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData('itemId', event.target.id);
    });

    return container;
}

/**
 * create finish button
 * @returns {Element} button finish element
 */
function createFinishButton() {
    const button = document.createElement("button");
    button.classList.add("green");
    button.innerText = "Selesai dibaca";
    button.addEventListener('click', (event) => {
        addToFinishedShelf(event.target.parentElement.parentElement);
    });
    return button;
}

/**
 * create remove button
 * @returns {Element} button remove element
 */
function createRemoveButton() {
    const button = document.createElement("button");
    button.classList.add("red");
    button.innerText = "Hapus buku";
    button.addEventListener('click', (event) => {
        removeBook(event.target.parentElement.parentElement);
    });
    return button;
}

/**
 * create unfinish button
 * @returns {Element} unfinish button element
 */
function createUnfinishedButton() {
    const button = document.createElement("button");
    button.classList.add("green");
    button.innerText = "Belum selesai di Baca";
    button.addEventListener('click', (event) => {
        addToUnfinishedShelf(event.target.parentElement.parentElement);
    });
    return button;
}

/**
 * find books array index by Id
 * @param {number} id - id from book-item article
 * @returns {number} index of array
 */
function findBookIndex(id) {
    let index = 0;
    for(index = 0; index < books.length; index++) {
        if(books[index].id == id) {
            return index;
        }
    }
    return -1;
}

/**
 * remove book item from list
 * @param {Element} taskElement - book-item article
 */
function removeBook(taskElement) {
    const index = findBookIndex(taskElement["id"]);
    const removedContainer = taskElement;
    books.splice(index, 1);
    removedContainer.remove();

    updateLocalData();
}

/**
 * add book item to finish list 
 * @param {Element} taskElement - book-item article
 */
function addToFinishedShelf(taskElement) {
    const completeBookshelfList = document.getElementById(COMPLETE_BOOKSHELF_LIST);

    const bookTitle = taskElement.querySelector("h3").innerText;
    const bookAuthor = taskElement.querySelectorAll("p")[0].innerText;
    const bookYear = taskElement.querySelectorAll("p")[1].innerText;
    const isComplete = true;

    const addBookObject = composeBookObject(bookTitle, bookAuthor, bookYear, isComplete);
    const addBook = makeBook(bookTitle, bookAuthor, bookYear, isComplete);
    addBook["id"] = addBookObject.id;

    removeBook(taskElement);

    books.push(addBookObject);
    completeBookshelfList.append(addBook);

    updateLocalData();
}

/**
 * add book item to unfinish list
 * @param {Element} taskElement - book-item article
 */
function addToUnfinishedShelf(taskElement) {
    const incompleteBookshelfList = document.getElementById(INCOMPLETE_BOOKSHELF_LIST);

    const bookTitle = taskElement.querySelector("h3").innerText;
    const bookAuthor = taskElement.querySelectorAll("p")[0].innerText;
    const bookYear = taskElement.querySelectorAll("p")[1].innerText;
    const isComplete = false;

    const addBookObject = composeBookObject(bookTitle, bookAuthor, bookYear, isComplete);
    const addBook = makeBook(bookTitle, bookAuthor, bookYear, isComplete);
    addBook["id"] = addBookObject.id;

    removeBook(taskElement);

    books.push(addBookObject);
    incompleteBookshelfList.append(addBook)

    updateLocalData();
}

/**
 * search book from given title
 */
function searchBookByTitle() {
    const searchedTitle = document.getElementById("inputSearchTitle").value;
    const incompleteBookshelfList = document.getElementById(INCOMPLETE_BOOKSHELF_LIST);
    const completeBookshelfList = document.getElementById(COMPLETE_BOOKSHELF_LIST);

    const bookIncomplete = incompleteBookshelfList.querySelectorAll("article");
    const bookComplete = completeBookshelfList.querySelectorAll("article");

    const bookContainer = [...bookComplete, ...bookIncomplete];

    if(searchedTitle.length == 0) {
        for(book of bookContainer) {
            book.removeAttribute("hidden");
        }
    } else {
        for(book of bookContainer) {
            if(book.querySelector("h3").innerText == searchedTitle) {
                continue;
            }
            book.setAttribute("hidden", true);
        }
    }
}

// code bellow will be execute when DOM already loaded
document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", (event) => {
        event.preventDefault();
        addBook();
    });

    const searchForm = document.getElementById("searchBook");
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        searchBookByTitle();
    });

    const dragBookToIncomplete = document.getElementById("incompleteBookshelfList");
    dragBookToIncomplete.addEventListener("dragover", (event) => {
        event.preventDefault();
    });
    dragBookToIncomplete.addEventListener("drop", (event) => {
        event.preventDefault();
        const book = document.getElementById(event.dataTransfer.getData("itemId"));
        addToUnfinishedShelf(book);
        updateLocalData();
    });

    const dragBookToComplete = document.getElementById("completeBookshelfList");
    dragBookToComplete.addEventListener("dragover", (event) => {
        event.preventDefault();
    });
    dragBookToComplete.addEventListener("drop", (event) => {
        event.preventDefault();
        const book = document.getElementById(event.dataTransfer.getData("itemId"));
        addToFinishedShelf(book);
        updateLocalData();
    });

    if(isStorageExist()) {
        restoreData();
    }
});

// code below will be execute when ondatasaved occur
document.addEventListener('ondatasaved', () => {
    console.log("Data berhasil disimpan pada Local Storage");
});

// code below will be execute when page reload/reopen
document.addEventListener('ondataloaded', () => {
    console.log("Data berhasil diambil dari Local Storage");
    getDataFromLocal();
});
