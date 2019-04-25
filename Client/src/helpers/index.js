export const imgPath = (img) => {
    if (img.includes("http") || img.includes("data:image/"))
        return img;
    else    
        return '/public/img/'+img;
}

export const findGenre = (value, array) => {
    return array.find(arr => {
        if (parseInt(arr.value,10) === value){
            return arr.label;
        }
        else return undefined;
    } );
}

export const renderGenre = (genreId, options) => {
    return genreId.map((genre) => {
        const genreTitle = findGenre(genre, options)
        return genreTitle.label+" ";
    })
}

export const inMyList = (movieId, myList) => {
    return myList.includes(movieId)
}