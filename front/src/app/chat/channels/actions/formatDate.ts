export function formatDate(str: string) {

    const date = new Date(str);
    // Extract date components
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
    const year = date.getFullYear().toString().slice(-2); // Get the last 2 digits of the year
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Format the date as "dd-mm-yy : hh:mm"
    return `${day}/${month}/${year} : ${hours}:${minutes}`;
}