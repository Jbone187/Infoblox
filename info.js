const fs = require('fs');
const ora = require('ora');
const ping = require('ping');
const https = require('https');
const axios = require('axios');
const dotenv = require("dotenv");
const program = require('commander');
const inquirer = require("inquirer");

//Secret Management
dotenv.config();

const arr = [];


//Rest api Queries
const searchHostname = 'https://####/wapi/v2.7/record:host?name~=';
const searchArecord = 'https://####/wapi/v2.7/record:a?name~=';
const searchSubnet = 'https://####/wapi/v2.7/ipv4address?network=';
const createHostname = 'https://####/wapi/v2.7/record:host';
const createArecord = 'https://####/wapi/v2.7/record:a';
const createPTR = 'https://####/wapi/v2.7/record:ptr';

//Inquirer command list
const userCommands = [{
    type: "list",
    name: "listData",
    message: "Choose Wapi Query",
    choices: ["Search Hostname", "Search Subnet", "Search A Record", "Add Hostname", "Add A Record", "Add PTR", "Multi Hostname", "Multi A Record", "Multi PTR", "Live_IP_No_Domain", "Search Hostname Query to File", "Search Subnet Query to File"],
}, {
    type: "input",
    name: "inputData",
    message: "Input Query"

}];

//General Help and Version Commands

function commanderHelp() {

    if (process.argv[2] === undefined) {

        //Title of Application
        console.log("Welcome to Infoblox Node Api\n");

        //Start Function
        apiRequest();

    } else {

        program.version('0.0.2');

        program.parse(process.argv);

        if (!program.args.length) program.help();

        process.exit(1);
    };
};
commanderHelp();



function apiRequest(userInfo) {
    inquirer
        .prompt(userCommands)
        .then(answers => {

            if (answers.listData === "Search Hostname") {

                //Visual CLI Spinner
                const spinner = ora('Loading Data\n').start();

                function axiosRequest1(input) {

                    let data = input.toLowerCase();

                    //Request to Infoblox
                    axios({
                            method: 'get',
                            url: `${searchHostname}${data}`,
                            responseType: 'json',
                            auth: {
                                username: process.env.user,
                                password: process.env.password
                            },
                            httpsAgent: new https.Agent({
                                rejectUnauthorized: false
                            })
                        })
                        .then(function (response) {
                            console.log(response.data);

                            for (let i = 0; i < response.data.length; i++) {
                                arr.push(response.data[i].name);
                            };
                            console.table(arr);

                            spinner.stop();


                        }).catch(function (error) {
                            console.log("No Data Found\n");
                            spinner.stop();
                        }).finally(function () {
                            console.log("---Query Completed---\n");
                        });
                };
                axiosRequest1(answers.inputData);

            } else if (answers.listData === "Search Subnet") {

                const spinner = ora('Loading Data\n').start();

                function axiosRequest2(data) {

                    axios({
                            method: 'get',
                            url: `${searchSubnet}${data}`,
                            responseType: 'json',
                            auth: {
                                username: process.env.user,
                                password: process.env.password
                            },
                            httpsAgent: new https.Agent({
                                rejectUnauthorized: false
                            })
                        })
                        .then(function (response) {
                            console.log(response.data);

                            for (let i = 0; i < response.data.length; i++) {

                                arr.push(response.data[i].ip_address)
                            };
                            console.table(arr);

                            spinner.stop();

                            arr.forEach(function (host) {
                                ping.sys.probe(host, function (isAlive) {
                                    let msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
                                    console.log(msg);
                                });
                            });


                        }).catch(function (error) {
                            console.log("No Data Found\n");
                            spinner.stop();
                        }).finally(function () {

                            console.log("---Query Completed---\n");

                            console.log("---Ping IP's---\n");
                        });
                };
                axiosRequest2(answers.inputData);

            } else if (answers.listData === "Search Hostname Query to File") {

                const spinner = ora('Loading Data\n').start();

                function axiosRequest3(data) {

                    axios({
                            method: 'get',
                            url: `${searchHostname}${data}`,
                            responseType: 'json',
                            auth: {
                                username: process.env.user,
                                password: process.env.password
                            },
                            httpsAgent: new https.Agent({
                                rejectUnauthorized: false
                            })
                        })
                        .then(function (response) {

                            for (let i = 0; i < response.data.length; i++) {
                                arr.push(response.data[i].name)
                            };
                            console.table(arr);

                            spinner.stop();

                            const newData = arr.join("\n")

                            fs.appendFile('hostname_query.txt', newData, function (err) {
                                if (err) throw err;
                                console.log('Saved!');
                            });


                        }).catch(function (error) {
                            console.log("No Data Found");
                            spinner.stop();
                        }).finally(function () {
                            console.log("---Query Completed---\n");
                        });
                };
                axiosRequest3(answers.inputData);

            } else if (answers.listData === "Search Subnet Query to File") {

                const spinner = ora('Loading Data\n').start();

                function axiosRequest4(data) {

                    axios({
                            method: 'get',
                            url: `${searchSubnet}${data}`,
                            responseType: 'json',
                            auth: {
                                username: process.env.user,
                                password: process.env.password
                            },
                            httpsAgent: new https.Agent({
                                rejectUnauthorized: false
                            })
                        })
                        .then(function (response) {

                            for (let i = 0; i < response.data.length; i++) {

                                console.log(response.data[i].names);

                                arr.push(response.data[i].ip_address)
                            };
                            console.table(arr);

                            spinner.stop();

                            const newData = arr.join("\n")

                            fs.appendFile('search_query.txt', newData, function (err) {
                                if (err) throw err;
                                console.log('Saved!');
                            });



                        }).catch(function (error) {
                            console.log("No Data Found");
                            spinner.stop();
                        }).finally(function () {
                            console.log("---Query Completed---\n");
                        });
                };
                axiosRequest4(answers.inputData);

            } else if (answers.listData === "Live_IP_No_Domain") {

                const spinner = ora('Loading Data\n').start();

                function axiosRequest5(data) {

                    axios({
                            method: 'get',
                            url: `${searchSubnet}${data}`,
                            responseType: 'json',
                            auth: {
                                username: process.env.user,
                                password: process.env.password
                            },
                            httpsAgent: new https.Agent({
                                rejectUnauthorized: false
                            })
                        })
                        .then(function (response) {

                            for (let i = 0; i < response.data.length; i++) {

                                if (response.data[i].names.length === 0) {
                                    arr.push(response.data[i].ip_address);
                                };
                            };
                            spinner.stop();

                            arr.forEach(function (host) {

                                ping.sys.probe(host, function (isAlive) {

                                    if (isAlive === true) {
                                        console.log(`${host}  alive`);
                                    };
                                });
                            });
                        }).catch(function (error) {
                            console.log("No Data Found");
                            spinner.stop();
                        }).finally(function () {
                            console.log("---Query Completed---\n");
                        });
                };
                axiosRequest5(answers.inputData);

            } else if (answers.listData === "Add Hostname") {

                function axiosRequest6(data) {

                    let stringSplit = data;
                    let newData = stringSplit.split(" ");

                    let hostObj = {
                        "ipv4addrs": [{
                            "configure_for_dhcp": false,
                            "ipv4addr": newData[0]
                        }],
                        "name": newData[1],
                        "configure_for_dns": false
                    };

                    let newHostObj = JSON.stringify(hostObj);

                    axios({
                            method: 'post',
                            url: `${createHostname}`,
                            data: `${newHostObj}`,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            auth: {
                                username: process.env.user,
                                password: process.env.password
                            },
                            httpsAgent: new https.Agent({
                                rejectUnauthorized: false
                            })
                        }).then(function (response) {
                            console.log(response)
                        })
                        .catch(function (error) {
                            console.log(error)
                        });

                };
                axiosRequest6(answers.inputData);

            } else if (answers.listData === "Multi Hostname") {

                function axiosRequest7(dataFile) {

                    fs.readFile(dataFile, 'utf8', (err, data) => {
                        if (err) {
                            console.error(err)
                        };
                        arr.push(data);

                        let stringSplit = data;
                        let newData = stringSplit.split("\n");

                        for (let i = 0; i < newData.length; i++) {

                            //Important part in pushing data from txt file to script
                            if (i % 2 !== 0) {

                                let newArray = new Array(newData[i], newData[i + 1]);

                                let hostObj = {
                                    "ipv4addrs": [{
                                        "configure_for_dhcp": false,
                                        "ipv4addr": newArray[0]
                                    }],
                                    "name": newArray[1],
                                    "configure_for_dns": false
                                };

                                let newHostObj = JSON.stringify(hostObj);

                                axios({
                                        method: 'post',
                                        url: `${createHost}`,
                                        data: `${newHostObj}`,
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        auth: {
                                            username: process.env.user,
                                            password: process.env.password
                                        },
                                        httpsAgent: new https.Agent({
                                            rejectUnauthorized: false
                                        })
                                    }).then(function (response) {
                                        console.log(response)
                                    })
                                    .catch(function (error) {
                                        console.log(error)
                                    });
                            };

                        };

                    });

                };
                axiosRequest7(answers.inputData);

            } else if (answers.listData === "Add A Record") {

                function axiosRequest8(data) {

                    let stringSplit = data;
                    let newData = stringSplit.split(" ");

                    let hostObj = {
                        "ipv4addr": newData[0],
                        "name": newData[1]
                    };

                    let newHostObj = JSON.stringify(hostObj);

                    axios({
                            method: 'post',
                            url: `${createArecord}`,
                            data: `${newHostObj}`,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            auth: {
                                username: process.env.user,
                                password: process.env.password
                            },
                            httpsAgent: new https.Agent({
                                rejectUnauthorized: false
                            })
                        }).then(function (response) {
                            console.log(response)
                        })
                        .catch(function (error) {
                            console.log(error)
                        });

                };
                axiosRequest8(answers.inputData);

            } else if (answers.listData === "Multi A Record") {

                function axiosRequest9(dataFile) {

                    fs.readFile(dataFile, 'utf8', (err, data) => {
                        if (err) {
                            console.error(err)
                        };
                        arr.push(data);

                        let stringSplit = data;
                        let newData = stringSplit.split("\n");

                        for (let i = 0; i < newData.length; i++) {

                            if (i % 2 !== 0) {

                                let newArray = new Array(newData[i], newData[i + 1]);

                                let hostObj = {
                                    "ipv4addr": newArray[0],
                                    "name": newArray[1]
                                };

                                let newHostObj = JSON.stringify(hostObj);

                                axios({
                                        method: 'post',
                                        url: `${createArecord}`,
                                        data: `${newHostObj}`,
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        auth: {
                                            username: process.env.user,
                                            password: process.env.password
                                        },
                                        httpsAgent: new https.Agent({
                                            rejectUnauthorized: false
                                        })
                                    }).then(function (response) {
                                        console.log(response)
                                    })
                                    .catch(function (error) {
                                        console.log(error)
                                    });
                            };

                        };

                    });

                };
                axiosRequest9(answers.inputData);

            } else if (answers.listData === "Add PTR") {

                function axiosRequest10(data) {

                    let stringSplit = data;
                    let newData = stringSplit.split(" ");

                    let hostObj = {
                        "ipv4addr": newData[0],
                        "ptrdname": newData[1]
                    };

                    let newHostObj = JSON.stringify(hostObj);

                    axios({
                            method: 'post',
                            url: `${creatPTR}`,
                            data: `${newHostObj}`,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            auth: {
                                username: process.env.user,
                                password: process.env.password
                            },
                            httpsAgent: new https.Agent({
                                rejectUnauthorized: false
                            })
                        }).then(function (response) {
                            console.log(response)
                        })
                        .catch(function (error) {
                            console.log(error)
                        });

                };
                axiosRequest10(answers.inputData);

            } else if (answers.listData === "Search A Record") {

                const spinner = ora('Loading Data\n').start();

                function axiosRequest11(input) {

                    let data = input.toLowerCase();

                    axios({
                            method: 'get',
                            url: `${searchArecord}${data}`,
                            responseType: 'json',
                            auth: {
                                username: process.env.user,
                                password: process.env.password
                            },
                            httpsAgent: new https.Agent({
                                rejectUnauthorized: false
                            })
                        })
                        .then(function (response) {
                            console.log(response.data);

                            for (let i = 0; i < response.data.length; i++) {
                                arr.push(response.data[i].name)
                            };
                            console.table(arr);
                            spinner.stop();

                            arr.forEach(function (host) {

                                ping.sys.probe(host, function (isAlive) {

                                    let msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
                                    console.log(msg);
                                });
                            });
                        }).catch(function (error) {
                            console.log("No Data Found\n");
                            spinner.stop();
                        }).finally(function () {

                            console.log("---Query Completed---\n");

                            console.log("---Ping Domains---\n");
                        });
                };
                axiosRequest11(answers.inputData);

            } else if (answers.listData === "Multi PTR") {

                function axiosRequest9(dataFile) {

                    fs.readFile(dataFile, 'utf8', (err, data) => {
                        if (err) {
                            console.error(err)
                        };
                        arr.push(data);

                        let stringSplit = data;
                        let newData = stringSplit.split("\n");

                        for (let i = 0; i < newData.length; i++) {

                            if (i % 2 !== 0) {

                                let newArray = new Array(newData[i], newData[i + 1]);

                                let hostObj = {
                                    "ipv4addr": newArray[0],
                                    "ptrdname": newArray[1]
                                };

                                let newHostObj = JSON.stringify(hostObj);

                                axios({
                                        method: 'post',
                                        url: `${createPTR}`,
                                        data: `${newHostObj}`,
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        auth: {
                                            username: process.env.user,
                                            password: process.env.password
                                        },
                                        httpsAgent: new https.Agent({
                                            rejectUnauthorized: false
                                        })
                                    }).then(function (response) {
                                        console.log(response);
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            };

                        };

                    });

                };
                axiosRequest9(answers.inputData);
            };
        });

};
