const books = [
    {
        title: "The Awakening",
        author: "Kate Chopin",
    },
    {
        title: "Aslam of Glass",
        author: "Paul Auster",
    },
];
const students = [
    {
        name: "aslam"
    },
    {
        name: "Rehan"
    }
];
const resolvers = {
    Query: {
        books: () => books,
    },
};
