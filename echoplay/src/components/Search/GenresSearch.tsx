const GenreSearch = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle genre search logic here

    };

    const Genre = "Pop"; // Example genre, this can be dynamic based on props or state
    return (
    <div>
        <form onSubmit={handleSubmit}>
              <button type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300">
                {Genre}
              </button>
        </form>
    </div>

  );
} 
export default GenreSearch;