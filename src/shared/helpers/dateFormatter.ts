const formatDate = (date:string) => {
    return new Date(date).toLocaleDateString([],{ year: 'numeric', month: 'long', day: 'numeric' });
}

export default formatDate;