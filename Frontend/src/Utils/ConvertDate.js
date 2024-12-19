export const  convertTimestampToDate = (isoTimestamp)=> {
    console.log(isoTimestamp);
    const date = new Date(isoTimestamp); 
    const day = String(date.getUTCDate()).padStart(2, '0'); 
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
    const year = date.getUTCFullYear(); 

    return `${day}-${month}-${year}`; 
}


