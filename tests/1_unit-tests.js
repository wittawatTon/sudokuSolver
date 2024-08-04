const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

let solver = new Solver();

suite('Unit Tests', () => {
  
  test('Logic handles a valid puzzle string of 81 characters', () => {
    let validPuzzle = puzzlesAndSolutions[0][0];
    assert.equal(validPuzzle.length, 81, 'Puzzle should have 81 characters');
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    let invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37A'; // Contains 'A'
    assert.equal(solver.validate(invalidPuzzle).valid,false, 'Invalid characters in puzzle');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    let invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'; // 80 characters
    assert.equal(solver.validate(invalidPuzzle).valid,false, 'Expected puzzle to be 81 characters long');
  });

  test('Logic handles a valid row placement', () => {
    let validPuzzle = puzzlesAndSolutions[0][0];
    assert.isTrue(solver.checkRowPlacement(validPuzzle, 0, 1, '3'), 'Valid row placement should return true');
  });

  test('Logic handles an invalid row placement', () => {
    let validPuzzle = puzzlesAndSolutions[0][0];
    assert.isFalse(solver.checkRowPlacement(validPuzzle, 0, 1, '5'), 'Invalid row placement should return false');
  });

  test('Logic handles a valid column placement', () => {
    let validPuzzle = puzzlesAndSolutions[0][0];
    assert.isTrue(solver.checkColPlacement(validPuzzle, 0, 1, '3'), 'Valid column placement should return true');
  });

  test('Logic handles an invalid column placement', () => {
    let validPuzzle = puzzlesAndSolutions[0][0];
    assert.isFalse(solver.checkColPlacement(validPuzzle, 0, 1, '2'), 'Invalid column placement should return false');
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    let validPuzzle = puzzlesAndSolutions[0][0];
    assert.isTrue(solver.checkRegionPlacement(validPuzzle, 0, 1, '3'), 'Valid region placement should return true');
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    let validPuzzle = puzzlesAndSolutions[0][0];
    assert.isFalse(solver.checkRegionPlacement(validPuzzle, 0, 1, '2'), 'Invalid region placement should return false');
  });

  test('Valid puzzle strings pass the solver', () => {
    puzzlesAndSolutions.forEach(([puzzle, solution]) => {
      assert.equal(solver.solve(puzzle), solution, 'Solver should return the correct solution');
    });
  });

  test('Invalid puzzle strings fail the solver', () => {
    let invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37A'; // Contains 'A'
    assert.equal(solver.solve(invalidPuzzle),false, 'Invalid characters in puzzle');
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    puzzlesAndSolutions.forEach(([puzzle, solution]) => {
      assert.equal(solver.solve(puzzle), solution, 'Solver should return the correct solution');
    });
  });

});
