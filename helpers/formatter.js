function mataUang(value) {
    let amount = value.toLocaleString('id-ID')
    return `Rp. ${amount},00`
}

function interest(value) {
    return value + "%"
}

function indoDate(date) {
    return date.toLocaleDateString('id-ID')
}

module.exports = {mataUang, interest, indoDate}