module.exports = (robot) => {

    // functions
    var roll = (dice, sides, bonus) => {
        var roll_array = [];
        for (var i = 0; i < dice; i++) {
            roll_array.push(rollOne(sides));
        }
        if (bonus) {roll_array.push(bonus);}

        return roll_array;
    }

    var rollOne = (sides) => {
        return 1 + Math.floor(Math.random() * sides);
    };

    var rollAdvantage = () => {
        var arr = [];
        for (var i = 0; i < 2; i++) {
            var num = rollOne(20).toString();
            num.match(/([8])/g) !== null ? arr.push(`an ${num}`) : arr.push(`a ${num}`);
        }

        return `I rolled ${arr[0]} and ${arr[1]}`;
    };

    var report = function (results) {
        if (results.length === 1) {
            return `I rolled a ${results}`;
        } else {
            let total = results.reduce(function(x,y) {
                return x+y;
            });
            let finalComma = results.length > 2 ? ',' : '';
            last = results.pop();
            return `I rolled ${results.join(', ')}${finalComma} and ${last}, making ${total}.`
        }
    };

    var reportBonus = function (results) {
        let total = results.reduce(function(x,y) {
            return x+y;
        });
        last = results.pop();
        return `I rolled ${results.join(', ')}: a bonus of +${last}, makes it ${total}.`
    }

    // huger-og-drager's listeners
    robot.hear(/rollbot help/i, res => {
        res.send('here are my commands so far:\n roll 6-sided die: "@rollbot roll dice"\n roll 2d6: "@rollbot roll dice"\n roll xdy: "@rollbot roll xdy"\n roll xdy+n: "@rollbot roll xdy+n"\n roll advantage: "@rollbot roll advantage"\n roll disadvantage "@rollbot roll disadvantage"');
    });


    //*** huger-og-drager's responses ***//
    // response for one-die roll
    robot.respond(/roll (die|one)/i, msg => {
        msg.reply(report(rollOne(6)));
    });
    // response for two-die rolls
    robot.respond(/roll dice/i, msg => {
        msg.reply(report(roll(2,6)));
    });
    // response for xdy roll
    robot.respond(/roll (\d+)d(\d+$)/i, msg => {
        let dice = parseInt(msg.match[1]);
        let sides = parseInt(msg.match[2]);
        let answer = '';

        if (sides < 1) {
            answer = 'How do YOU roll a zero-sided die?'
        } else if (dice > 100) {
            answer = 'Nope.  Not gonna roll more than 100 dice for you.'
        } else {
            answer = report(roll(dice, sides));
        }

        msg.reply(answer);
    });
    robot.respond(/roll (\d+)d(\d+)\+(\d+)/, msg => {
        let dice = parseInt(msg.match[1]);
        let sides = parseInt(msg.match[2]);
        let bonus = parseInt(msg.match[3]);
        let answer = '';

        if (sides < 1) {
            answer = 'How do YOU roll a zero-sided die?'
        } else if (dice > 100) {
            answer = 'Nope.  Not gonna roll more than 100 dice for you.'
        } else {
            answer = reportBonus(roll(dice, sides, bonus));
        }

        msg.reply(answer);
    })

    // response for dis/advantage roll
    robot.respond(/roll (disadvantage|advantage)/i, msg => {
        msg.reply(rollAdvantage());
    });

}
