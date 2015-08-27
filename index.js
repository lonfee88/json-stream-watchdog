var Base = require('mocha').reporters.Base;
var moment = require('moment');

/**
 * Expose `List`.
 */

exports = module.exports = List;

/**
 * Initialize a new `List` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function List(runner) {
    Base.call(this, runner);

    var self = this
        , stats = this.stats
        , total = runner.total
        , start;

    //execution started
    runner.on('start', function () {
        console.log(JSON.stringify(['start', {total: total}]));
    });

    // 记录开始时间
    runner.on('test', function () {
        self.start = formatTime(new Date());
    });

    //test passed
    runner.on('pass', function (test) {
        test = clean(test);
        var end = new Date;
        test.start = formatTime(new Date(end - test.duration));
        test.end = formatTime(end);
        console.log(JSON.stringify(['pass', test]));
    });

    //test failed
    runner.on('fail', function (test, err) {
        test = clean(test);
        var end = new Date;
        test.start = self.start;
        test.end = formatTime(end);
        test.duration = (new Date(test.end)) - (new Date(test.start));
        test.err = err.message;
        console.log(JSON.stringify(['fail', test]));
    });

    //execution complete
    runner.on('end', function () {
        self.stats.start = formatTime(self.stats.start);
        self.stats.end = formatTime(self.stats.end);
        process.stdout.write(JSON.stringify(['end', self.stats]));
    });
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @param {Object} test
 * @return {Object}
 * @api private
 */

function clean(test) {
    return {
        title: test.title,
        fullTitle: test.fullTitle(),
        duration: test.duration
    }
}

// 日期格式化
function formatTime(time){
    var format = 'YYYY-MM-DD HH:mm:ss.SSS';
    return moment(time).format(format);
}