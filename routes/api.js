/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const express = require('express');
const mongoose = require('mongoose');

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

var bodyParser  = require('body-parser');
const url = require('url'); 

const Issues = require('../models/issue.js');

const issueRouter = express.Router();

issueRouter.use(bodyParser.json());



const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

//I want to see a list of projects
issueRouter.route('/')
  .get(function(req, res, next) {
    Issues.find({})
      .then((issues) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          let projectList = issues.map((item) => item.issue_project);
          projectList = projectList.filter((x, i, a) => a.indexOf(x) == i)
          res.json(projectList);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(function (req, res, next) {
    res.statusCode = 405;
    res.end("This operation does't possible");
  })
  .put(function (req, res, next){
    res.statusCode = 405;
    res.end("This operation does't possible");
  })
  .delete(function (req, res, next){
    res.statusCode = 405;
    res.end("This operation does't possible");
  })



//issueRouter.route('/api/issues/:project')
issueRouter.route('/:project')
//I can GET /api/issues/{projectname} for an array of all issues on that specific project with all the information for each issue as was returned when posted.
//I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false). I can pass along as many fields/values as I want.
  .get(function (req, res, next){
    //var project = req.params.project;
    let urlParsed = url.parse(req.url, true);
    //res.end("Looking for params");  
  
    if(Object.keys(urlParsed.query).length != 0) {
        console.log("What do you want, mortal?")
        let params = {};
        params.issue_project = req.params.project;  
        if(urlParsed.query.assigned_to) params.assigned_to = urlParsed.query.assigned_to;
        if(urlParsed.query.assigned) params.assigned_to = urlParsed.query.assigned;
        if(urlParsed.query.title) params.issue_title = urlParsed.query.title;
        if(urlParsed.query.text) params.issue_text = urlParsed.query.text;
        if(urlParsed.query.created_by) params.created_by = urlParsed.query.created_by;
        if(urlParsed.query.created) params.created_by = urlParsed.query.created;  
        if(urlParsed.query.open) params.status_text = urlParsed.query.open;
      
        Issues.find(params)
        .then((issues) => {        
            res.statusCode = 200;
            res.json(issues);
        }, (err) => next(err))
        .catch((err) => next(err)); 
    }
    else {
      console.log("Just do it by default")
      Issues.find({issue_project: req.params.project})
        .then((issues) => {        
            res.statusCode = 200;
            res.json(issues);
        }, (err) => next(err))
        .catch((err) => next(err));       
    }
    
  })
//I can POST /api/issues/{projectname} with form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text.
//The object saved (and returned) will include all of those fields (blank for optional no input) and also include created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id.
  .post(function (req, res, next){
    //var project = req.params.project;  
    let newIssue = req.body;
    newIssue.issue_project = req.params.project;
  
    Issues.create(newIssue)
    .then((issue) => {
        console.log('Issues Added ', issue);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json({issue_title: issue.issue_title,
                  issue_text: issue.issue_text,
                  created_by: issue.created_by,
                  assigned_to: issue.asigned_to,
                  status_text: (issue.status_text == 'close'.toLowerCase() ) ? false : true,
                  created_on: issue.createdAt,
                  updated_on: issue.updatedAt,
                  _id: issue._id
                 });
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .put(function (req, res){
    res.statusCode = 418;
    res.end("Enter the ussue ID");
  })
  .delete(function (req, res, next){
    res.statusCode = 418;
    res.end("Enter the ussue ID");
  })
  



issueRouter.route('/:project/:issueId')
  .get(function (req, res, next) {
    Issues.findById(req.params.issueId)
      .then((issue) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(issue);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(function (req, res){
    res.statusCode = 418;
    res.end("Not able to do it");
  })
//I can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object. Returned will be 'successfully updated' or 'could not update '+_id.
//This should always update updated_on. If no fields are sent return 'no updated field sent'.
  .put(function (req, res, next){
    var project = req.params.project;

    Issues.findByIdAndUpdate(req.params.issueId, {
        $set: req.body
    }, { new: true })
      .then((issue) => {
          res.statusCode = 200;
          res.end('Successfully updated');
      }, (err) => {
        err = new Error('Could not update ' + req.params.issueId);
        err.status = 520;
        return next(err);
      })
      .catch((err) => next(err));
  })
//I can DELETE /api/issues/{projectname} with a _id to completely delete an issue. If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.
  .delete(function (req, res, next){
    //var project = req.params.project;
    
    Issues.findByIdAndRemove(req.params.issueId)
      .then(() => {
          res.statusCode = 200;
          res.end("Deleted " + req.params.issueId);
      }, (err) => {
        err = new Error('Could not delete ' + req.params.issueId);
        err.status = 520;
        return next(err);      
      })
      .catch((err) => next(err));
  });

module.exports = issueRouter;