'use strict';

const _ = require('lodash');
const moment = require('moment');
const config = require('./config-utils').loadConfig();


const arrivedAtHours = 9;
const arrivedAtMinutes = 30;


function WriteStringReportToHandler(options, writer) {
  var result = options.result;
  var summary = _.sortBy(result.summary, (i) => i.sum);
  var details = result.details;
  summary.map((item) => {
    const author = item.author;
    const items = details[author];
    const lastLog = _.sortBy(items, (i) => -i.started)[0];

    const diff = moment().diff(lastLog.started);
    const diffDuration = moment.duration(diff);
    const duration = moment.duration(item.sum, 'seconds');
    let leftTime;
    let totalDayTime;
    if (moment().weekday() === 1 || moment().weekday() === 3) {
      totalDayTime = 6.0;
    } else {
      totalDayTime = 7.3;
    }
    leftTime = moment.duration(totalDayTime * 60 * 60 - item.sum, 'seconds');

    let leftTimeOfTheDay, dinnerDiff = 0;
    // calculate time without dinner if less than 15 hours
    if (moment().hours() > 14) {
      dinnerDiff = 1;
    }
    leftTimeOfTheDay = moment().hours(arrivedAtHours + 8 + dinnerDiff).minutes(arrivedAtMinutes).diff(moment());
    const leftTimeOfTheDayDuration = moment.duration(leftTimeOfTheDay);
    // writer(_.padEnd(item.author, 20));
    writer(`Arrived at ${arrivedAtHours}h ${arrivedAtMinutes}m home at ${arrivedAtHours+9}h ${arrivedAtMinutes}m`);
    writer(`Logged time : ${Math.floor(duration.asHours())}h ${_.padStart(duration.minutes(), 2, '0')}m;`);
    writer(`Time to log for ${totalDayTime} hours: ${Math.floor(leftTime.asHours())}h ${_.padStart(leftTime.minutes(), 2, '0')}m`);
    writer(`Left time of the day: ${Math.floor(leftTimeOfTheDayDuration.asHours())}h ${_.padStart(leftTimeOfTheDayDuration.minutes(), 2, '0')}m`);
    writer('---');
    writer(`Request time: ${moment().locale('ru').format('LT')}`);
    writer(`Recommended to log : ${Math.floor(diffDuration.asHours())}h ${_.padStart(diffDuration.minutes(), 2, '0')}m`);

  });
  writer('---');
  summary.map((item) => {
    if (options.stereotype === 'prev. week') {

    }
    const author = item.author;
    let items = details[author];
    // items.groupBy/
    // writer(author);
    // let newItems = {};
    // _.each(_.sortBy(items, (i) => i.started), (item) => {
    //   console.log(item.started);
    //   console.log(item.started.date());
    //   const day = item.started.date();
    //   if(newItems[day]){
    //     newItems[day].timeSpentSeconds = newItems[day].timeSpentSeconds + item.timeSpentSeconds;
    //   } else {
    //     newItems[day] = item;
    //   }
    // });
    // _.each(newItems, (item) => {
    //   const duration = moment.duration(item.timeSpentSeconds, 'seconds');
    //   writer('  ', `${item.started.format("DD MMM ddd")} | ${Math.floor(duration.asHours())}h ${_.padStart(duration.minutes(), 2, '0')}m  `);
    // });
    _.each(_.sortBy(items, (i) => i.started), (item) => {
      const duration = moment.duration(item.timeSpentSeconds, 'seconds');
      writer('  ', `${item.started.format(config.reportDateFormat)} | ${ _.padStart(item.timeSpent, 6)} | ${item.issue.key} | ${_.padEnd(_.truncate(item.comment.replace(/(\n|\r)/g, '/ '), {length: 30}), 30)} | ${_.truncate(item.issue.fields.summary, {length: 20})} `);
    });
  });
}

function WriteStringReport(options) {
  var result = "";
  WriteStringReportToHandler(options, function () {
    var args = [].slice.call(arguments);
    result += "\r\n" + args.join(' ');
  });
  return result;
}

module.exports = WriteStringReport;