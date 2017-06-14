module.exports = {
    jira: {
        "protocol": "https",
        "host": "jira.wiley.com",
        "apiVersion": "2",
        "projectKey": "SPR DEV",
        "maxIssueResults": 10000,
        "verbose": false,
        searchDateFormat: "YYYY/MM/DD HH:mm"
    },
    cmdArgDateFormat: "YYYY/MM/DD HH:mm",
    reportDateFormat: "YY/MM/DD HH:mm",
    repFileNameDateFormat: "YY-MM-DD_HH-mm",
    startWorkingHour: 1,
    issueChunkSize: 256,
    issueChunkDelay: 1000,
    reporters: [
        './lib/console-report-writter'
    ]
};