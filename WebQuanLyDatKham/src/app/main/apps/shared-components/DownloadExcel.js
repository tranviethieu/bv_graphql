import React from "react";
import ReactExport from "react-data-export";
import { Icon, IconButton } from '@material-ui/core';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


const dataSet1 = [
    {
        name: "Johson",
        amount: 30000,
        sex: 'M',
        is_married: true
    },
    {
        name: "Monika",
        amount: 355000,
        sex: 'F',
        is_married: false
    },
    {
        name: "John",
        amount: 250000,
        sex: 'M',
        is_married: false
    },
    {
        name: "Josef",
        amount: 450500,
        sex: 'M',
        is_married: true
    }
];

var dataSet2 = [
    {
        name: "Johnson",
        total: 25,
        remainig: 16
    },
    {
        name: "Josef",
        total: 25,
        remainig: 7
    }
];

const multiDataSet = [
    {
        columns: ["Name", "Salary", "Sex"],
        data: [
            ["Johnson", 30000, "Male"],
            ["Monika", 355000, "Female"],
            ["Konstantina", 20000, "Female"],
            ["John", 250000, "Male"],
            ["Josef", 450500, "Male"],
        ]
    },
    {
        xSteps: 1, // Will start putting cell with 1 empty cell on left most
        ySteps: 5, //will put space of 5 rows,
        columns: ["Name", "Department"],
        data: [
            ["Johnson", "Finance"],
            ["Monika", "IT"],
            ["Konstantina", "IT Billing"],
            ["John", "HR"],
            ["Josef", "Testing"],
        ]
    }
];
const multiDataSet2 = [
    {
        columns: [
            {title: "Headings", width: {wpx: 80}},//pixels width
            {title: "Text Style", width: {wch: 40}},//char width
            {title: "Colors", width: {wpx: 90}},
        ],
        data: [
            [
                {value: "H1", style: {font: {sz: "24", bold: true}}},
                {value: "Bold", style: {font: {bold: true}}},
                {value: "Red", style: {fill: {patternType: "solid", fgColor: {rgb: "FFFF0000"}}}},
            ],
            [
                {value: "H2", style: {font: {sz: "18", bold: true}}},
                {value: "underline", style: {font: {underline: true}}},
                {value: "Blue", style: {fill: {patternType: "solid", fgColor: {rgb: "FF0000FF"}}}},
            ],
            [
                {value: "H3", style: {font: {sz: "14", bold: true}}},
                {value: "italic", style: {font: {italic: true}}},
                {value: "Green", style: {fill: {patternType: "solid", fgColor: {rgb: "FF00FF00"}}}},
            ],
            [
                {value: "H4", style: {font: {sz: "12", bold: true}}},
                {value: "strike", style: {font: {strike: true}}},
                {value: "Orange", style: {fill: {patternType: "solid", fgColor: {rgb: "FFF86B00"}}}},
            ],
            [
                {value: "H5", style: {font: {sz: "10.5", bold: true}}},
                {value: "outline", style: {font: {outline: true}}},
                {value: "Yellow", style: {fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}}}},
            ],
            [
                {value: "H6", style: {font: {sz: "7.5", bold: true}}},
                {value: "shadow", style: {font: {shadow: true}}},
                {value: "Light Blue", style: {fill: {patternType: "solid", fgColor: {rgb: "FFCCEEFF"}}}}
            ]
        ]
    },
    {
        xSteps: 1, // Will start putting cell with 1 empty cell on left most
        ySteps: 7, //will put space of 5 rows,
        columns: [{ title: "Name", width: { wpx: 80 } },
        {title: "Department", width: {wpx: 80}},],
        data: [
            ["Johnson", "Finance"],
            ["Monika", "IT"],
            ["Konstantina", "IT Billing"],
            ["John", "HR"],
            ["Josef", "Testing"],
        ]
    }
];

export  function DownloadExcel({ columns, data, name, className }) {

    return (
        <ExcelFile element={<IconButton><Icon className = {className}>cloud_download</Icon></IconButton>} fileName={name}>
            {
                data && columns && name &&
                <ExcelSheet data={data} name={name ? name : "unnamed"} >
                    {columns && columns.map((column, index) =>
                        <ExcelColumn label={column.title} value={column.value} key={index} width= {{ wpx: 80 }}/>
                    )}
                </ExcelSheet>
            }

        </ExcelFile>
    )
}
//dataSheets:[columns,data,name,xSteps,ySteps]
export function DownloadExcelMultiSheet({ dataSheets, name,element, className }) {

    const multiDataSheet = dataSheets.map(({ columns, data, xSteps, ySteps }) => (
        {
            xSteps:xSteps||0,
            ySteps:ySteps||0,
            columns: columns.map(col => ({
                title: col.title,
                width: {wpx: col.width||80}
            })),
            data: data?data.map(d => {
                const cols = columns.map(c => {
                    try {
                        // console.log("typeof valuecolumn",(typeof c.value),c.value);
                        if (typeof c.value === "string")
                            return d[c.value];
                        else
                            return c.value(d)
                    } catch{
                        return "";
                    }
                });
                return cols;
            }):[]
        }
    ));
    return (
        <ExcelFile element={element||<IconButton><Icon className = {className}>cloud_download</Icon></IconButton>} fileName={name}>
          <ExcelSheet dataSet={multiDataSheet} name="Organization" />

        </ExcelFile>
    )
}
