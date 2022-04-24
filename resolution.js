import fetch from "node-fetch";

const replaceData = (format, elements) => {
    return elements
        .map((element, index) =>
            format[index].replace(`%ITEM_${index}%`, elements[index].trim()))
        .join(",");
}

fetch('https://www.sii.cl/servicios_online/1047-nomina_inst_financieras-1714.csv')
    .then(response => response.text())
    .then(csvString => {
        const rows = csvString.split(/\r?\n|\r/);
        const headers = rows[0].split(";");
        const format = headers.map((header, index) => `"${header}": "%ITEM_${index}%"`);
        const result = [];

        for (let i = 1; i < rows.length - 1; i++) {
            const elements = rows[i].split(";");
            const obj = "{"
                .concat(replaceData(format, elements))
                .concat("}");

            result.push(obj)
        }

        const final = "["
            .concat(result.join(","))
            .concat("]");
        console.log(final, "\n\n", JSON.parse(final));
        return final;
    })
    .catch(error => console.error("An error has occurred: ", error));
