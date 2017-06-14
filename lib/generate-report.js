//thanks to https://github.com/B-Stefan/node-jira-worklog-export
const _ = require('lodash');
const getWorklogsPromise = require('./worklog-fetch');


function generateReport(dates) {
    return getWorklogsPromise(dates).then((results) => {
        var groupedByAuthor = _.groupBy(results, (item) => item.author.displayName || item.author.name);
        // console.log(groupedByAuthor);
        var newGroupedByDanil =  {};
        newGroupedByDanil['Danil Pankrashin'] = groupedByAuthor['Danil Pankrashin'];
        var summaryByAuthor = _.map(newGroupedByDanil, ( (worklogs, key) => {
            return {author: key, sum: _.sumBy(worklogs, (item) => (+item.timeSpentSeconds))}
        }));
        return {
            summary: summaryByAuthor,
            details: groupedByAuthor
        }
    });
}

module.exports = generateReport;