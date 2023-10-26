const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");
const ROWS = 10;
const COL = 10;
const spreadsheet = [];
const alphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

class Cell {
  constructor(
    isHeader,
    disabled,
    data,
    row,
    column,
    rowName,
    columnName,
    active = false
  ) {
    this.isHeader = isHeader;
    this.disabled = disabled;
    this.data = data;
    this.row = row;
    this.column = column;
    this.rowName = rowName;
    this.columnName = columnName;
    this.active = active;
  }
}

exportBtn.onclick = function (e) {
  let csv = "";
  for (let i = 0; i < spreadsheet.length; i++) {
    if (i === 0) continue;
    csv +=
      spreadsheet[i]
        .filter((item) => !item.isHeader)
        .map((item) => item.data)
        .join(",") + "\r\n";
  }

  // MIME 타입을 지정하여 Blob 생성
  const csvObj = new Blob([csv], { type: "text/csv" });

  // Blob을 URL로 변환
  const csvUrl = URL.createObjectURL(csvObj);

  // 다운로드 링크 생성
  const a = document.createElement("a");
  a.href = csvUrl;

  // 파일 이름 지정
  a.download = "my_spreadsheet.csv"; // 파일 이름을 원하는 이름으로 변경하세요

  // 클릭 이벤트 발생
  a.click();
};

initSpreadsheeet();

function initSpreadsheeet() {
  for (let i = 0; i < ROWS; i++) {
    let spreadsheetRow = [];
    for (let j = 0; j < COL; j++) {
      let cellData = "";
      let isHeader = false;
      let disabled = true;

      //모든 row 첫 번째 컬럼에 숫자 넣기
      if (j === 0) {
        cellData = i;
        isHeader = true;
      }

      if (i === 0) {
        cellData = alphabets[j - 1];
        isHeader = true;
      }

      //첫 번째 row의 컬럼은 "";
      if (!cellData) {
        // cellData 값이 false면 -> undefined면
        cellData = "";
      }

      const rowName = i;
      const columnName = alphabets;

      const cell = new Cell(
        isHeader,
        disabled,
        cellData,
        i,
        j,
        rowName,
        columnName,
        false
      ); //?
      spreadsheetRow.push(cell);
    }
    spreadsheet.push(spreadsheetRow);
    console.log(spreadsheetRow);
  }
}

function createCellEl(cell) {
  const cellEl = document.createElement("input");
  cellEl.className = "cell";
  cellEl.id = "cell_" + cell.row + cell.column;
  cellEl.value = cell.data;
  cellEl.disabled = false;

  if (cell.isHeader) {
    cellEl.classList.add("header");
    cellEl.disabled = true;
  }

  cellEl.onclick = function () {
    handleCellClick(cell);
  };

  // cellEl.onchange 이벤트 핸들러 수정
  cellEl.onchange = function (e) {
    handleOnChange(e.target.value, cell);
  };

  return cellEl;
}

// handleOnChange 함수 수정
function handleOnChange(value, cell) {
  cell.data = value; // 입력된 값을 셀의 데이터로 업데이트
}

function handleCellClick(cell) {
  clearHeaderActiveState();
  const columnHeader = spreadsheet[0][cell.column];
  const rowHeader = spreadsheet[cell.row][0];
  const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
  const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);
  columnHeaderEl.classList.add("active");
  rowHeaderEl.classList.add("active");
}

function clearHeaderActiveState() {
  const headers = document.querySelectorAll(".header");

  headers.forEach((header) => {
    header.classList.remove("active");
  });
}

function getElFromRowCol(row, col) {
  return document.querySelector("#cell_" + row + col);
}

function drawSheet() {
  for (let i = 0; i < spreadsheet.length; i++) {
    const rowContainerEl = document.createElement("div");
    rowContainerEl.className = "cell-row";

    for (let j = 0; j < spreadsheet[i].length; j++) {
      const cell = spreadsheet[i][j];
      spreadSheetContainer.append(createCellEl(cell));
    }
    spreadSheetContainer.append(rowContainerEl);
  }
}

drawSheet();
console.log(spreadsheet);
