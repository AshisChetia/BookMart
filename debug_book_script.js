const axios = require('axios');

async function getBooks() {
    try {
        console.log('Fetching books...');
        const response = await axios.get('http://localhost:3000/api/books');
        console.log('Response Status:', response.status);
        console.log('Books Count:', response.data.books.length);

        if (response.data.books.length > 0) {
            console.log('First Book Sample:');
            console.dir(response.data.books[0], { depth: null });

            // Find a book with images
            const bookWithImages = response.data.books.find(b => b.images && b.images.length > 0);
            if (bookWithImages) {
                console.log('\nBook with Images Sample:');
                console.dir(bookWithImages, { depth: null });
            } else {
                console.log('\nNo books with images found in the sample.');
            }
        }
    } catch (error) {
        console.error('Error fetching books:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
        }
    }
}

getBooks();
