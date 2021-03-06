//  Book Contrusctor
function Book(title, author, isbn) {
    this.title = title
    this.author = author
    this.isbn = isbn
}

// UI Constructor
function UI() {

}

// Add Book To List
UI.prototype.addBookToList = function (book) {
    const list = document.getElementById('book-list')
    // Create tr element
    const row = document.createElement('tr')
    // Insert cols
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href='#' class='delete'>X</a></td>
    `

    list.appendChild(row)

}

// Show Alert
UI.prototype.showAlert = function(message, className) {
    // Create div
    const div = document.createElement('div')
    // Add Classes
    div.className = `alert ${className}`
    // Add Text
    div.appendChild(document.createTextNode(message))
    // Get Parent
    const container = document.querySelector('.container')
    // Get Form
    const form = document.querySelector('#book-form')
    // Insert Alert
    container.insertBefore(div, form)

    // Timeout after 3 sec
    setTimeout(function(){
        document.querySelector('.alert').remove()
    }, 3000)
}

// Delete Book
UI.prototype.deleteBook = function(target) {
    if(target.className === 'delete'){
        target.parentElement.parentElement.remove()
    }
}

// Clear field
UI.prototype.clearFields = function () {
    document.getElementById('title').value = ''
    document.getElementById('author').value = ''
    document.getElementById('isbn').value = ''
}

// Local Storage
function getBooks(){
    let books
        if(localStorage.getItem('books') === null) {
            books = []
        } else { 
            books = JSON.parse(localStorage.getItem('books'))
        }
        
        return books
}

function addBook(book){
    const books = getBooks()

        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))
}

function displayBooks() {
    const books = getBooks()

        books.forEach(function(book){
            const ui = new UI

            // Add Book to UI
            ui.addBookToList(book)
        })
}

function removeBook(isbn){
    const books = getBooks()

        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1)
            }
        })

        localStorage.setItem('books', JSON.stringify(books))
    }


// Event Listener for add book
document.getElementById('book-form').addEventListener('submit',
    function (e) {
        // Get form values
        const title = document.getElementById('title').value,
            author = document.getElementById('author').value,
            isbn = document.getElementById('isbn').value

        // Instantiate Book
        const book = new Book(title, author, isbn)

        // Instantiate UI
        const ui = new UI()

        // Validate
        if(title === '' || author === '' || isbn === '' ) {
            // Error alert
            ui.showAlert('Please fill in all fields', 'error')
        } else {
            // Add book to list
            ui.addBookToList(book)

            // Add to LS
            addBook(book)

            // Show success
            ui.showAlert('Book Added!', 'success')
    
            // Clear Fields
            ui.clearFields()
        }


        e.preventDefault()
    })

    //DOM load Event
    document.addEventListener('DOMContentLoaded', displayBooks())

    // Event Listener for delete
    document.getElementById('book-list').addEventListener('click', function(e){

        const ui = new UI()

        // Delete book
        ui.deleteBook(e.target)

        // Remove from LS
        removeBook(e.target.parentElement.previousElementSibling.textContent)

        // Show message
        ui.showAlert('Book Removed', 'success')

        e.preventDefault()
    })