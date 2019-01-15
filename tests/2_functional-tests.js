/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Test implementation',
          issue_text: 'text',
          created_by: 'Outlander tester',
          assigned_to: 'Chai and Mocha',
          status_text: 'In testing'
        })
        .end(function(err, res){
          assert.equal(res.status, 201);           
             
          assert.equal(res.body.issue_title, 'Test implementation');  
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Outlander tester');   
          assert.equal(res.body.assigned_to, 'Chai and Mocha');        
          assert.equal(res.body.status_text, 'In testing');
          assert.property(res.body, 'createdAt');
          assert.property(res.body, 'updatedAt');
          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/mocha')
        .send({
          issue_title: 'WTF',
          issue_text: 'What I should to do here?',
          created_by: 'Unknown reader',
          assigned_to: 'Chai and Mocha',
          status_text: 'In testing'          
        })
        .end(function(err, res){
          assert.equal(res.body.issue_project, 'mocha');
          assert.equal(res.body.issue_title, 'WTF');  
          assert.equal(res.body.issue_text, 'What I should to do here?');
          assert.equal(res.body.created_by, 'Unknown reader');
          assert.property(res.body, '_id');

          done();
        });
      });  
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/miss')
        .send({
          issue_title: 'Do',
          issue_text: 'Just do it!'         
        })
        .end(function(err, res){
          //console.log(res.error);
          //assert.equal(res.text.body, 'Issue validation failed');
          //expect(res.error.text).to.contain('cannot POST');
          //expect(res.Error).to.exist;
          //expect(res.error);
          assert.equal(res.status, 400);
          
          done();
        });
        
      });
      
    });
    
  
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test/5c3c5bb59a06bb2298ebce5c')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 418);
            assert.equal(res.text, 'Add the information');
            done();
          })
      });
      
      test('One field to update', function(done) {        
        chai.request(server)
          .put('/api/issues/test/5c3c5bbfbe63f522f56930ca')
          .send({
             "issue_text": "update me"    
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'Successfully updated');
            done();
          })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test/5c3c5bd300e90c24a28bc126')
          .send({
             "issue_text": "update me fully",
	           "issue_status": "don't delete me"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'Successfully updated');
            done();
          })
        
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
          .get('/api/issues/world')
          .query({})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            //assert.property(res.body[0], 'created_on');
            //assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'createdAt');
            assert.property(res.body[0], 'updatedAt');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            //assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });
      });
      

      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/world?title=Test it by AI')
          .query({})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.equal(res.body[0].issue_title, 'Test it by AI');  
            assert.property(res.body[0], 'issue_text'); 
            assert.property(res.body[0], 'createdAt');
            assert.property(res.body[0], 'updatedAt');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');    
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });

      });
      

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
           
        chai.request(server)
          .get('/api/issues/world?title=Test it by AI&status=open')
          .query({})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.equal(res.body[0].issue_title, 'Test it by AI');  
            assert.property(res.body[0], 'issue_text');   
            assert.property(res.body[0], 'createdAt');
            assert.property(res.body[0], 'updatedAt');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');    
            assert.equal(res.body[0].status_text, 'open');  
            assert.property(res.body[0], '_id');
            done();
          });
      });

    });
  
  
  

    suite('DELETE /api/issues/{project} => text', function() {

      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test/')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 418);
            assert.equal(res.text, 'Enter the ussue ID');
            done();
          })

      });
      

      test('Valid _id', function(done) {        
        chai.request(server)
          .delete('/api/issues/mocha/5c3db43b7be3b64d48053b81')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'Deleted 5c3db43b7be3b64d48053b81');
          
            done();
          })

      });

    });

});
