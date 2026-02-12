async function getBooks() {
    try {
        console.log('Fetching books...');
        const response = await fetch('http://localhost:3000/api/books');
        const data = await response.json();

        console.log('Response Status:', response.status);

        if (data.success && data.books) {
            console.log('Books Count:', data.books.length);
            if (data.books.length > 0) {
                console.log('First Book Sample:');
                console.dir(data.books[0], { depth: null });

                // Find a book with images
                const bookWithImages = data.books.find(b => b.images && b.images.length > 0);
                if (bookWithImages) {
                    console.log('\nBook with Images Sample:');
                    console.dir(bookWithImages, { depth: null });
                    console.log('Image Type:', typeof bookWithImages.images);
                    console.log('Is Array?', Array.isArray(bookWithImages.images));
                } else {
                    console.log('\nNo books with images found in the sample.');
                }
            }
        } else {
            console.log('Failed to fetch books or no books field:', data);
        }

    } catch (error) {
        console.error('Error fetching books:', error.message);
    }
}

getBooks();
