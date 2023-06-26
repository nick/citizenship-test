const fs = require('fs');
const readline = require('readline');

const readInterface = readline.createInterface({
    input: fs.createReadStream('input.txt'),
    output: process.stdout,
    console: false
});

let section = '';
let subsection = '';
let question = '';
let answers = [];
let output = [];

readInterface.on('line', function(line) {
    line = line.trim();

    if (line === '') return;  // Skip empty lines

    if (/^\d+\./.test(line)) {
        // This is a question
        // If there was a previous question, add it to the output
        if (question !== '') {
            output.push({
                section,
                subsection,
                question,
                answers
            });
            // Clear answers for the next question
            answers = [];
        }

        // Save the new question
        question = line.trim();
    } else if (/^[A-Z]:/.test(line)) {
        // This is a subsection
        // If there was a previous question, add it to the output
        if (question !== '') {
            output.push({
                section,
                subsection,
                question,
                answers
            });
            // Clear question and answers for the new subsection
            question = '';
            answers = [];
        }

        subsection = line.substring(2).trim();
    } else if (line.startsWith('.')) {
        // This is an answer
        answers.push(line.substring(1).trim());
    } else if(line === line.toUpperCase()){
        // This must be a section
        // If there was a previous question, add it to the output
        if (question !== '') {
            output.push({
                section,
                subsection,
                question,
                answers
            });
            // Clear question and answers for the new section
            question = '';
            answers = [];
        }

        section = line.trim();
    }
});

readInterface.on('close', function() {
    // Add the last question
    if (question !== '') {
        output.push({
            section,
            subsection,
            question,
            answers
        });
    }

    fs.writeFileSync('output.json', JSON.stringify(output, null, 4));
});
