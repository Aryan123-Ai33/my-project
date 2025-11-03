import { useState } from "react";

export default function App() {
    const [books, setBooks] = useState([
        { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
        { id: 3, title: "1984", author: "George Orwell" }
    ]);
    const [search, setSearch] = useState("");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");

    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase())
    );

    const addBook = (e) => {
        e.preventDefault();
        if (title.trim() && author.trim()) {
            setBooks([...books, { id: Date.now(), title, author }]);
            setTitle("");
            setAuthor("");
        }
    };

    const removeBook = (id) => {
        setBooks(books.filter((book) => book.id !== id));
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Library Management</h1>
            <input
                type="text"
                placeholder="Search by title or author"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
            />
            <form onSubmit={addBook} className="mb-4">
                <input
                    type="text"
                    placeholder="Book Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 w-full mb-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="border p-2 w-full mb-2 rounded"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Add Book
                </button>
            </form>
            <ul className="space-y-2">
                {filteredBooks.map((book) => (
                    <li key={book.id} className="flex justify-between items-center border p-2 rounded">
                        <div>
                            <p className="font-semibold">{book.title}</p>
                            <p className="text-sm text-gray-600">{book.author}</p>
                        </div>
                        <button
                            onClick={() => removeBook(book.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
