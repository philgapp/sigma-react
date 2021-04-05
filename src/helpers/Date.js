
const DateFromInt = (props) => {
    const rawDate = new Date(props)
    const year = rawDate.getFullYear()
    const month = rawDate.getMonth()
    const day = rawDate.getDate()
    // Unused for now but tested:
    // const isoDate = rawDate.toISOString()
    // TODO allow user to set and pass props to change date formatting (i.e. MM/DD/YYYY vs. YYYY-DD-MM etc.)
    const date = year + "-" + day + "-" + month
    return date
};

export default DateFromInt;