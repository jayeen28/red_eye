module.exports = function () {
    const today = new Date();
    const options = { timeZone: 'Asia/Dhaka' }; // Set timezone to Bangladeshi time
    const bdDate = new Date(today.toLocaleString('en-US', options));

    return [bdDate.getFullYear(), bdDate.getMonth() + 1, bdDate.getDate(), bdDate.getHours(), bdDate.getMinutes(), bdDate.getSeconds()];
}