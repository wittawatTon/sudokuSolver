class SudokuSolver {

  validate(puzzleString) {
    console.log(`Validating puzzle string: ${puzzleString}`);
    
    // Check length of puzzle string
    if (puzzleString.length !== 81) {
      console.log("Validation failed: Expected puzzle to be 81 characters long");
      return { valid: false, error: "Expected puzzle to be 81 characters long" };
    }

    // Check for invalid characters
    if (/[^1-9.]/.test(puzzleString)) {
      console.log("Validation failed: Invalid characters in puzzle");
      return { valid: false, error: "Invalid characters in puzzle" };
    }

    console.log("Puzzle string is valid");
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const start = row * 9; // Start index of the row
    const rowValues = puzzleString.slice(start, start + 9); // Extract the row
    const isValid = !rowValues.includes(value);

    console.log(`Checking row placement: row ${row}, column ${column}, value ${value}`);
    console.log(`Row values: ${rowValues}, Valid: ${isValid}`);

    return isValid;
  }

  checkColPlacement(puzzleString, row, column, value) {
    console.log(`Checking column placement: row ${row}, column ${column}, value ${value}`);

    for (let i = 0; i < 9; i++) {
      if (puzzleString[column + i * 9] === value) {
        console.log(`Value ${value} found in column at row ${i}, column ${column}`);
        return false; // Value is already in the column
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRowStart = Math.floor(row / 3) * 3;
    const regionColStart = Math.floor(column / 3) * 3;

    console.log(`Checking region placement: row ${row}, column ${column}, value ${value}`);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const index = (regionRowStart + i) * 9 + (regionColStart + j);
        if (puzzleString[index] === value) {
          console.log(`Value ${value} found in region at index ${index}`);
          return false; // Value is already in the region
        }
      }
    }
    return true;
  }


  solve(puzzleString) {
    const findEmptyCell = (inStr) => {
      for (let i = 0; i < 81; i++) {
        if (inStr[i] === '.') {
          console.log(`Empty cell found at index ${i}`);
          return i;
        }
      }
      console.log("No empty cells found, puzzle solved");
      return -1;
    };
  
    if (this.validate(puzzleString).valid===false){
      return false;
    }

    const solver = (puzzleString) => {
      console.log(`Input with puzzle string: ${puzzleString}`);
      const emptyCellIndex = findEmptyCell(puzzleString);
      if (emptyCellIndex === -1) return puzzleString; // Puzzle solved
  
      const row = Math.floor(emptyCellIndex / 9);
      const col = emptyCellIndex % 9;
  
      for (let value = 1; value <= 9; value++) {
        const strValue = value.toString();
        console.log(`Trying value ${strValue} at row ${row}, column ${col}`);
  
        if (
          this.checkRowPlacement(puzzleString, row, col, strValue) &&
          this.checkColPlacement(puzzleString, row, col, strValue) &&
          this.checkRegionPlacement(puzzleString, row, col, strValue)
        ) {
          const newPuzzleString = puzzleString.slice(0, emptyCellIndex) + strValue + puzzleString.slice(emptyCellIndex + 1);
          console.log(`Placing value ${strValue} at index ${emptyCellIndex}, new puzzle string: ${newPuzzleString}`);
          console.log(`Recursing with puzzle string: ${newPuzzleString}`);
          const solvedPuzzle = solver(newPuzzleString);
          console.log(`Recursing with puzzle string: ${newPuzzleString}`);
          if (solvedPuzzle) return solvedPuzzle;
          
          console.log(`Backtracking, removing value ${strValue} from index ${emptyCellIndex}`);
        }
      }
  
      return false; // Trigger backtracking
    };
  
    console.log("Starting puzzle solve");
    return solver(puzzleString);
  }
  
  
}
module.exports = SudokuSolver;
