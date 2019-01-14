const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//issue_title, issue_text, created_by, and optional assigned_to and status_text.
var issueSchema = new Schema({
    issue_project: {
        type: String,
        required: true
    },
    issue_title: {
        type: String,
        required: true
    },
    issue_text: {
        type: String,
        required: true
    },
    created_by: {
        type: String,
        required: true
    },
    assigned_to: {
        type: String,
        default: ''
    },
    status_text: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});


var Issues = mongoose.model('Issue', issueSchema);

module.exports = Issues;