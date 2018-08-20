const readline = require('readline-sync');
const mongoose = require('mongoose');
const Web3 = require('web3');
const https = require('https');

var db = undefined;

var web3;

var contractList = [];

var addrList = [];

var calculatedTotalSupply = 0;


const Address = mongoose.model('address', AddrSchema);

function unique(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

const AddrSchema = mongoose.Schema({
    addr: {
        type: String,
        required: true
    }
});

function getAddress(givenAddress, callback) {
    const query = {
        addr: givenAddress
    };
    Address.findOne(query, callback);
}

function insertAddress(givenAddress) {
    let newAddress = new Address({
        addr: givenAddress
    });
    newAddress.save();
}

function connectToDatabase() {
    let databaseURL = 'mongodb://localhost:27017/ethTotalSupplyAnalysis';

    mongoose.connect(databaseURL);

    db = mongoose.connection;

    if (!db.readyState)
        console.log('[ Log / Database ] Database error');
    else
        console.log('[ Log / Database ] Connected to database successfully: ' + databaseURL);

    //  [Abandoned Code]
    //      Doesn't Work for Unknown Reason
    //
    //
    // db.on('connected', () => {
    //     console.log('[ Log / Database ] Connected to database successfully: '+ databaseURL);
    // });
    //
    // db.on('error', (err) => {
    //     console.log('[ Log / Database ] Database error'+err);
    // });

    // console.log(db);

    // var db = mongoose.connect(databaseURL, (err) => {
    //     if(err)
    //         console.log('[ Log / Database ] Database error'+err);
    //     else
    //         console.log('[ Log / Database ] Connected to database successfully: '+ databaseURL);
    // });

}

function connectToEtherNode() {

    let ethNodeURL = "https://mainnet.infura.io/8Sz0lITQzrM5dS9o6rb4";
    web3 = new Web3(new Web3.providers.HttpProvider(ethNodeURL));

    console.log('[ Log / Eth Web3 ] Current Node: ' + web3.version.node);

}

function importDataFromDB() {

    // TO-DO
    console.log('[ Log / Database ] Import Data Complete! ');
}

function A_AnalyzeNewBlock() {

    let start = readline.question('Please Input Start Block Number (Default 1): ');
    let end = readline.question('Please Input End Block Number (Default Latest One): ');

    // console.log(start);
    // console.log(end);

    try {
        start = parseInt(start, 10);

    } catch (err) {
        start = 1;
    }

    try {
        end = parseInt(end, 10);
    } catch (err) {
        end = web3.eth.blockNumber;
    }

    // console.log(start);
    // console.log(end);


    for (let i = start; i <= end; i++) {

        let blockTxnNumber = web3.eth.getBlockTransactionCount(i);
        // console.log(blockTxnNumber);
        for (let j = 0; j < blockTxnNumber; j++) {
            let txn = web3.eth.getTransactionFromBlock(i, j);
            // console.log(txn);
            if (contractList.includes(txn.to))
                addrList.append(txn.from);
            if (contractList.includes(txn.from))
                addrList.append(txn.to);
        }

    }

    unique(addrList);

    for (let i = 0; i < addrList.length; i++) {
        getAddress(addrList[i], (err, addrFound) => {
            if (err)
                console.log('[ Error / Database ] ' + err);
            if (!addrFound) {
                insertAddress(addrList[i]);
            }
        });
    }
}



function B_AddUpBalancesOfAContract() {

    let contractAddr = readline.question('Please Input Contract Address: ');

    addrList = Address.find();

    calculatedTotalSupply = 0;

    for (let i = 0; i < contractList.length; i++) {
        let tokenBalanceURL = 'api.tokenbalance.com/balance/' + contractAddr + '/' + addrList[i];

        // let option = {
        //     host: 'https://api.tokenbalance.com',
        //     port: 443,
        //     path: '/balance/' + contractAddr + '/' + addrList[i],
        //     method: 'GET'
        // };

        // https.request(option, function (res) {
        //    calculatedTotalSupply += parseFloat(res);
        // });

        https.get(tokenBalanceURL, (res) => {

            res.setEncoding('utf8');
            res.on('data', function(balance) {
                calculatedTotalSupply += parseFloat(balance);
            });
        });
    }

    console.log('[ Result / Calculated Total Supply ] Ans is: ' + calculatedTotalSupply);

}

function B2_AddUpBalancesOfAContractByGeth() {

    let web3.
}

function main() {
    connectToDatabase();
    connectToEtherNode();
    importDataFromDB();

    intro = `
[ Operation Lists ]
(A) Abstract Addresses from Blocks
(B) Add Up Balances of a Contract

Please input your option: `;

    while (true) {
        let input = readline.question(intro)[0].toUpperCase();
        if (input == 'A')
            A_AnalyzeNewBlock();
        if (input == 'B')
            B_AddUpBalancesOfAContract();
    }
    rl.close();
}

main();