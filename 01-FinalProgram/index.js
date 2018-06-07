let Web3 = require('web3');

let https = require('https');

let http = require('http');

let web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/8Sz0lITQzrM5dS9o6rb4"));

var startDate = new Date(), cnt = 0;

let obj = undefined;


f2 = function () {
    var endDate = new Date();

    console.log(startDate);

    console.log(endDate);

    console.log(endDate - startDate);
};

function f1(callback) {
    for(let i = 1; i <= 5; i++) {

        web3.eth.getBlock(3000000+i, true, (err, res) => {
            cnt++;
            // if(res.transactions != undefined) {
            console.log(res);
            console.log(cnt);
            // }
            if(cnt == 5)
                callback();
                });

    }
}

// f1(f2);

ans = 0;


// let option = {
//     host: 'api.tokenbalance.com',
//     path: '/balance/' + '0xa74476443119A942dE498590Fe1f2454d7D4aC0d' + '/' + '0xda0aed568d9a2dbdcbafc1576fedc633d28eee9a',
//     method: 'GET',
//     header: {
//         Connection: 'keep-alive',
//         ciphers: 'DES-CBC3-SHA'
//     }
// };
//
// var A = http.request(option, function (res) {
//     console.log(res);
//     calculatedTotalSupply += parseFloat(res);
//     console.log(calculatedTotalSupply);
// });
// A.end();

https.get('https://api.tokenbalance.com/balance/0xa74476443119A942dE498590Fe1f2454d7D4aC0d/0xda0aed568d9a2dbdcbafc1576fedc633d28eee9a', (res) => {

    res.setEncoding('utf8');
    res.on('data', function (body) {
        console.log(body);
        ans += body;
        console.log(calculatedTotalSupply+'*');
    });
});


https.get('https://api.tokenbalance.com/balance/0xa74476443119A942dE498590Fe1f2454d7D4aC0d/0xda0aed568d9a2dbdcbafc1576fedc633d28eee9a', (res) => {

    res.setEncoding('utf8');
    res.on('data', function (body) {
        console.log(body);
        calculatedTotalSupply += body;
        console.log(calculatedTotalSupply+'*');
    });
});


