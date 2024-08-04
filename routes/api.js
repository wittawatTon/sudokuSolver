'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
  .post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    console.log(`Received request to /api/check with body:`, req.body);

    // Check for missing required fields
    if (!puzzle || !coordinate || !value) {
      console.log("error: Required field(s) missing");
      return res.status(200).json({ error: 'Required field(s) missing' });
    }

    // Validate puzzle string
    if (puzzle.length !== 81) {
      console.log("error: Expected puzzle to be 81 characters long");
      return res.status(200).json({ error: 'Expected puzzle to be 81 characters long' });
    }
    if (/[^1-9.]/.test(puzzle)) {
      console.log("error: Invalid characters in puzzle");
      return res.status(200).json({ error: 'Invalid characters in puzzle' });
    }

    // Validate coordinate and value
    if (coordinate.length!=2){
      console.log("error: Invalid coordinate");
      return res.status(200).json({ error: 'Invalid coordinate' });
    }
    const row = coordinate.charAt(0).toUpperCase();
    const column = coordinate.charAt(1);
    if (/[^A-I]/.test(row) || /[^1-9]/.test(column)) {
      console.log("error: Invalid coordinate");
      return res.status(200).json({ error: 'Invalid coordinate' });
    }
    if (/[^1-9]/.test(value)) {
      console.log("error: Invalid value");
      return res.status(200).json({ error: 'Invalid value' });
    }

    const rowIndex = row.charCodeAt(0) - 65;
    const colIndex = parseInt(column) - 1;

    console.log(`Checking placement for rowIndex: ${rowIndex}, colIndex: ${colIndex}, value: ${value}`);

    if (puzzle[rowIndex*9+colIndex]===value){
      console.log("Placement is valid");
      return res.json({ valid: true });
    }

    // Check placement
    const rowCheck = solver.checkRowPlacement(puzzle, rowIndex, colIndex, value);
    const colCheck = solver.checkColPlacement(puzzle, rowIndex, colIndex, value);
    const regionCheck = solver.checkRegionPlacement(puzzle, rowIndex, colIndex, value);

    console.log(`Row check result: ${rowCheck}`);
    console.log(`Column check result: ${colCheck}`);
    console.log(`Region check result: ${regionCheck}`);

    if (rowCheck && colCheck && regionCheck) {
      console.log("Placement is valid");
      return res.json({ valid: true });
    } else {
      const conflicts = [];
      if (!rowCheck) conflicts.push('row');
      if (!colCheck) conflicts.push('column');
      if (!regionCheck) conflicts.push('region');
      console.log(`Placement is invalid. Conflicts: ${conflicts.join(', ')}`);
      return res.json({ valid: false, conflict: conflicts });
    }
  });

  app.route('/api/solve')
  .post((req, res) => {
    const { puzzle } = req.body;

    console.log(`Received request to /api/solve with body:`, req.body);

    // Check for missing puzzle field
    if (!puzzle) {
      console.log("error: Required field missing");
      return res.status(200).json({ error: 'Required field missing' });
    }

    // Validate puzzle string
    if (puzzle.length !== 81) {
      console.log("error: Expected puzzle to be 81 characters long");
      return res.status(200).json({ error: 'Expected puzzle to be 81 characters long' });
    }
    if (/[^1-9.]/.test(puzzle)) {
      console.log("error: Invalid characters in puzzle");
      return res.status(200).json({ error: 'Invalid characters in puzzle' });
    }

    console.log("Starting to solve the puzzle");

    const solution = solver.solve(puzzle);
    console.log("error: Puzzle cannot be solved");
    if (!solution) {
      console.log("error: Puzzle cannot be solved");
      return res.status(200).json({ error: 'Puzzle cannot be solved' });
    }

    console.log(`Puzzle solved. Solution: ${solution}`);
    return res.json({ solution });
  });

};
