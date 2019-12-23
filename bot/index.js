'use strict';
console.clear();
const snoowrap = require('snoowrap'),
    snoostorm = require('snoostorm'),
    config = require('./creds.json'),
    startupDate = parseInt(Date.now().toString().substring(0, Date.now().toString().length-3), 10),
    r = new snoowrap({
        userAgent: config.userAgent,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        username: config.username,
        password: process.argv[2]
    }),
    footer = "\n\n---\n^^Flagify ^^V1.0.0 ^^| ^^[Feedback](https://www.reddit.com/user/flagify/comments/ee7fdt/suggestions_and_feedback/) ^^| ^^[Source](https://github.com/CaltropUwU/flagify)",
    inbox = new snoostorm.InboxStream(r),
    quote = [
        "Ask and you shall receive!",
        "Voilà",
        "There you go",
        "Bitte sehr"
    ]
r.config({requestDelay: 1000, continueAfterRatelimitError: true, warnings: true});

inbox.on("item", (msg) => {
    if(msg.created_utc > startupDate && msg.subject == 'username mention' && msg.was_comment) {
        console.log(msg.body);
        if(isValidLink(msg.body_html)) {
            console.log("is image in ping message")
            r.getComment(msg.id).fetch().then((c) => {
                r.getSubmission(c.link_id).fetch().then((s) => {
                    msg.reply('[*'+quote[Math.floor(Math.random()*quote.length)]+'*](https://caltrop.dev/flag/'+s.id+'/'+msg.id+')'+footer);
                })
            })
        } else {
            r.getComment(msg.parent_id).fetch().then((c) => {
                console.log("checking comment")
                if(isValidLink(c.body_html)) {
                    console.log("is image in comment");
                    r.getSubmission(c.link_id).fetch().then((s) => {
                        msg.reply('[*'+quote[Math.floor(Math.random()*quote.length)]+'*](https://caltrop.dev/flag/'+s.id+'/'+msg.parent_id.substring(3)+')'+footer);
                    })
                } else {
                    r.getSubmission(c.link_id).fetch().then((s) => {
                        trySubmission(s.id, msg);
                    });
                }
            })
            .catch(() => {
                console.log("checking submission")
                trySubmission(msg.parent_id, msg);
            })
        }
    };
});
inbox.on("end", () => console.log("An Error has occured"));

function isValidLink(str) {
    return /(https?:\/\/([^\/]+)\/([^.]+)\.(png|jpe?g|gif)((\?|#)([^"]+)))/g.test(str);
}

function trySubmission(id, msg) {
    r.getSubmission(id).fetch().then((s) => {
        if(!s.is_self && s.post_hint && s.post_hint.toLowerCase() == 'image') {
            console.log("is image in submission")
            msg.reply('[*'+quote[Math.floor(Math.random()*quote.length)]+'*](https://caltrop.dev/flag/'+s.id+')'+footer);
        } else {
            console.log("checked all, isnt image")
            msg.reply('We looked far and wide but could sadly not find anything to flagify - Apologies'+footer);
        }
    }).catch(() => {
        console.error("If you ever see this something has gone horribly wrong")
    });
}

process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.log("[Uncaught Exception]");
    console.log(errorMsg);
    
    inbox.end();
    process.exit(1);
});
  process.on("unhandledRejection", err => {
    console.log("[Uncaught Promise Error]");
    console.log(err.message);
});