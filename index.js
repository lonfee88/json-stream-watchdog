var Base = require('mocha').reporters.Base;
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
        self.start = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
    });

    //test passed
    runner.on('pass', function (test) {
        test = clean(test);
        var end = new Date;
        test.start = (new Date(end - test.duration)).Format("yyyy-MM-dd hh:mm:ss.S");
        test.end = end.Format("yyyy-MM-dd hh:mm:ss.S");
        console.log(JSON.stringify(['pass', test]));
    });

    //test failed
    runner.on('fail', function (test, err) {
        test = clean(test);
        var end = new Date;
        test.start = self.start;
        test.end = end.Format("yyyy-MM-dd hh:mm:ss.S");
        test.duration = (new Date(test.end)) - (new Date(test.start));
        test.err = err.message;
        console.log(JSON.stringify(['fail', test]));
    });

    //execution complete
    runner.on('end', function () {
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

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
