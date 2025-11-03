function GenreTile({genre}) {  
    return (
        <div className="genre-tile">
            <img src={genre.logo} alt={genre.title} />
            <p style={{
                textAlign: 'center',
                fontSize: '14px',
                marginTop: '8px',
                color: '#333'
            }}>{genre.title}</p>
        </div>   
    );
}

export default GenreTile;