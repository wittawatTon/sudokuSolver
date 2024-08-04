const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  
  suite('POST /api/solve', () => {
    
    test('Solve a puzzle with valid puzzle string', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzlesAndSolutions[0][0] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'solution');
          assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
          done();
        });
    });

    test('Solve a puzzle with missing puzzle string', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });

    test('Solve a puzzle with invalid characters', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5....a9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Solve a puzzle with incorrect length', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Solve a puzzle that cannot be solved', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });

  });

  suite('POST /api/check', () => {
    
    test('Check a puzzle placement with all fields', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'A1',
          value: '7'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isTrue(res.body.valid);
          done();
        });
    });

    test('Check a puzzle placement with single placement conflict', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'A1',
          value: '2'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.include(res.body.conflict, 'column');
          done();
        });
    });

    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A1',
          value: '1'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'column');
          done();
        });
    });

    test('Check a puzzle placement with all placement not conflict', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'C3',
          value: '2'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isTrue(res.body.valid);
          done();
        });
    });

    test('Check a puzzle placement with missing required fields', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'A1'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test('Check a puzzle placement with invalid characters', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5....a9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'A1',
          value: '2'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Check a puzzle placement with incorrect length', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37',
          coordinate: 'A1',
          value: '2'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Check a puzzle placement with invalid placement coordinate', (done) => {
        const coordinates = ['A0', 'A10', 'J1', 'A', '1', 'XZ18'];
        let remainingTests = coordinates.length;
        for (const coordinate of coordinates) {
            chai.request(server)
                .post('/api/check')
                .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: coordinate,
                value: '7'
                })
                .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid coordinate');
                remainingTests -= 1;
                if (remainingTests === 0) {
                  done();
                }
                });
            }
    });

    test('Check a puzzle placement with invalid placement value', (done) => {
      const values = ['0', '10', 'A'];
      let remainingTests = values.length;
      for (const val of values) {
        chai.request(server)
            .post('/api/check')
            .send({
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            coordinate: 'A1',
            value: val
            })
            .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid value');
            remainingTests -= 1;
            if (remainingTests === 0) {
              done();
            }
            });
        }
    });

  });

});
