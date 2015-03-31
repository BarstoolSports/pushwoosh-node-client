var test = require('tape'),
    Fraudster = require('fraudster'),
    fraudster = new Fraudster(),
    pathToObjectUnderTest = '../index.js',
    errors = require('../lib/errors'),
    testAppCode = 'testAppCode',
    testAuthToken = 'testAuthToken',
    testHost = 'http://localhost',
    testApiVersion = '123',
    testMsg = 'Hello World',
    testError = 'Oooops',
    testMsgCode = '112233';

fraudster.registerAllowables([pathToObjectUnderTest, 'util']);

function resetMocks() {
    fraudster.registerMock('request', {});
    fraudster.registerMock('./lib/errors', errors);
}


function getCleanTestObject() {
    delete require.cache[require.resolve(pathToObjectUnderTest)];
    fraudster.enable({useCleanCache: true, warnOnReplace: false});
    var objectUnderTest = require(pathToObjectUnderTest);
    fraudster.disable();
    resetMocks();
    return objectUnderTest;
}

resetMocks();

test('Pushwoosh client exists', function (t) {
    t.plan(2);
    var client = getCleanTestObject();
    t.ok(client, 'Pushwoosh client does exist');
    t.equal(typeof client, 'function', 'Pushwoosh is a function as expected');
});

test('Pushwoosh constructor success case', function (t) {
    t.plan(4);

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken, {host: testHost, apiVersion: testApiVersion});

    t.equal(client.appCode, testAppCode, 'Application code passed correctly');
    t.equal(client.authToken, testAuthToken, 'Auth token passed correctly');
    t.equal(client.apiVersion, testApiVersion, 'API version correct');
    t.equal(client.host, testHost, 'API host correct');

});

test('Pushwoosh constructor success case with options', function (t) {
    t.plan(4);

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken);

    t.equal(client.appCode, testAppCode, 'Application code passed correctly');
    t.equal(client.authToken, testAuthToken, 'Auth token passed correctly');
    t.ok(client.apiVersion, 'API version exists');
    t.ok(client.host, 'API host exists');

});


test('Pushwoosh constructor test error case 1: no appCode and authToken', function (t) {
    t.plan(2);

    var PwClient = getCleanTestObject();

    try {
        var client = new PwClient();
    } catch (e) {
        t.ok(e, 'Exception exists');
        t.deepEqual(e, new Error('Application ID and Authentication Token from Pushwoosh must be provided'), 'Error does match');
    }
});

test('Pushwoosh constructor test error case 2: appcode/authToken missing', function (t) {
    t.plan(2);

    var PwClient = getCleanTestObject();

    try {
        var client = new PwClient('appCode');
    } catch (e) {
        t.ok(e, 'Exception exists');
        t.deepEqual(e, new Error('Application ID and Authentication Token from Pushwoosh must be provided'), 'Error does match');
    }
});


test('Pushwoosh send message success case with only 2 params msg and callback', function (t) {
    t.plan(5);

    var mockResponse = {
            statusCode: 200
        },
        mockBodyResponse = {
            status_code: 200,
            response: {}
        },
        expectedBody = {
            request: {
                application: testAppCode,
                auth: testAuthToken,
                notifications: [{
                    send_date: 'now',
                    ignore_user_timezone: true,
                    content: testMsg,
                    devices: []
                }]
            }
        };

    fraudster.registerMock('request', function (params, callback) {
        t.ok(params, 'Params exists');
        t.deepEqual(params.body, expectedBody, 'Body are as expected');
        t.equal(params.method, 'POST', 'Method is POST as expected');
        callback(null, mockResponse, mockBodyResponse);
    });

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken);


    client.sendMessage(testMsg, function (err, response) {
        t.notOk(err, 'No error as expected');
        t.deepEqual(response, {}, 'response is the same');
    });

});

test('Pushwoosh send message success case with 3 params: msg, device, callback', function (t) {
    t.plan(5);

    var mockDevice = 'someToken',
        mockResponse = {
            statusCode: 200
        },
        mockBodyResponse = {
            status_code: 200,
            response: {}
        },
        expectedBody = {
            request: {
                application: testAppCode,
                auth: testAuthToken,
                notifications: [{
                    send_date: 'now',
                    ignore_user_timezone: true,
                    content: testMsg,
                    devices: [mockDevice]
                }]
            }
        };

    fraudster.registerMock('request', function (params, callback) {
        t.ok(params, 'Params exists');
        t.deepEqual(params.body, expectedBody, 'Body are as expected');
        t.equal(params.method, 'POST', 'Method is POST as expected');
        callback(null, mockResponse, mockBodyResponse);
    });

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken);


    client.sendMessage(testMsg, mockDevice, function (err, response) {
        t.notOk(err, 'No error as expected');
        t.deepEqual(response, {}, 'response is the same');
    });

});


test('Pushwoosh send message success case with 3 params: msg, options, callback', function (t) {
    t.plan(5);

    var mockDevice = 'someToken',
        mockOptions = {},
        mockResponse = {
            statusCode: 200
        },
        mockBodyResponse = {
            status_code: 200,
            response: {}
        },
        expectedBody = {
            request: {
                application: testAppCode,
                auth: testAuthToken,
                notifications: [{
                    send_date: 'now',
                    ignore_user_timezone: true,
                    content: testMsg,
                    devices: []
                }]
            }
        };

    fraudster.registerMock('request', function (params, callback) {
        t.ok(params, 'Params exists');
        t.deepEqual(params.body, expectedBody, 'Body are as expected');
        t.equal(params.method, 'POST', 'Method is POST as expected');
        callback(null, mockResponse, mockBodyResponse);
    });

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken);


    client.sendMessage(testMsg, mockOptions, function (err, response) {
        t.notOk(err, 'No error as expected');
        t.deepEqual(response, {}, 'response is the same');
    });

});


test('Pushwoosh send message success case with 4 params: msg, device, options, callback', function (t) {
    t.plan(5);

    var mockDevice = 'someToken',
        mockOptions = {},
        mockResponse = {
            statusCode: 200
        },
        mockBodyResponse = {
            status_code: 200,
            response: {}
        },
        expectedBody = {
            request: {
                application: testAppCode,
                auth: testAuthToken,
                notifications: [{
                    send_date: 'now',
                    ignore_user_timezone: true,
                    content: testMsg,
                    devices: [mockDevice]
                }]
            }
        };

    fraudster.registerMock('request', function (params, callback) {
        t.ok(params, 'Params exists');
        t.deepEqual(params.body, expectedBody, 'Body are as expected');
        t.equal(params.method, 'POST', 'Method is POST as expected');
        callback(null, mockResponse, mockBodyResponse);
    });

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken);


    client.sendMessage(testMsg, mockDevice, mockOptions, function (err, response) {
        t.notOk(err, 'No error as expected');
        t.deepEqual(response, {}, 'response is the same');
    });

});


test('Pushwoosh send message error case with no msg passed', function (t) {
    t.plan(2);

    var mockDevice = 'someToken',
        mockOptions = {};

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken);


    client.sendMessage({}, mockDevice, mockOptions, function (err, response) {
        t.deepEqual(err, new Error('Message has to be provided'), 'Error as expected');
        t.notOk(response, 'No response as expected');
    });

});


test('Pushwoosh send message error case 2', function (t) {
    t.plan(5);

    var mockDevice = 'someToken',
        mockOptions = {},
        expectedBody = {
            request: {
                application: testAppCode,
                auth: testAuthToken,
                notifications: [{
                    send_date: 'now',
                    ignore_user_timezone: true,
                    content: testMsg,
                    devices: [mockDevice]
                }]
            }
        };

    fraudster.registerMock('request', function (params, callback) {
        t.ok(params, 'Params exists');
        t.deepEqual(params.body, expectedBody, 'Body are as expected');
        t.equal(params.method, 'POST', 'Method is POST as expected');
        callback(testError);
    });

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken);


    client.sendMessage(testMsg, mockDevice, mockOptions, function (err, response) {
        t.notOk(response, 'No response as expected');
        t.deepEqual(err, testError, 'Error is as expected');
    });

});


test('Pushwoosh send message success case with response code 200 but status code 210', function (t) {
    t.plan(5);

    var mockDevice = 'someToken',
        mockOptions = {},
        mockResponse = {
            statusCode: 200
        },
        mockBodyResponse = {
            status_code: 210,
            response: {},
            status_message: testError
        },
        expectedBody = {
            request: {
                application: testAppCode,
                auth: testAuthToken,
                notifications: [{
                    send_date: 'now',
                    ignore_user_timezone: true,
                    content: testMsg,
                    devices: [mockDevice]
                }]
            }
        },
        expectedResult = {description: 'Argument error', detail: mockBodyResponse.status_message, code: 210};

    fraudster.registerMock('request', function (params, callback) {
        t.ok(params, 'Params exists');
        t.deepEqual(params.body, expectedBody, 'Body are as expected');
        t.equal(params.method, 'POST', 'Method is POST as expected');
        callback(null, mockResponse, mockBodyResponse);
    });

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken);


    client.sendMessage(testMsg, mockDevice, mockOptions, function (err, response) {
        t.notOk(err, 'No error as expected');
        t.deepEqual(response, expectedResult, 'response is the same');
    });

});


test('Pushwoosh send message success case with response code 500', function (t) {
    t.plan(5);

    var mockDevice = 'someToken',
        mockOptions = {},
        mockResponse = {
            statusCode: 500
        },
        mockBodyResponse = {
            status_code: 200,
            response: {}
        },
        expectedBody = {
            request: {
                application: testAppCode,
                auth: testAuthToken,
                notifications: [{
                    send_date: 'now',
                    ignore_user_timezone: true,
                    content: testMsg,
                    devices: [mockDevice]
                }]
            }
        },
        expectedResult = {description: 'Argument error', detail: mockBodyResponse.status_message, code: 210};

    fraudster.registerMock('request', function (params, callback) {
        t.ok(params, 'Params exists');
        t.deepEqual(params.body, expectedBody, 'Body are as expected');
        t.equal(params.method, 'POST', 'Method is POST as expected');
        callback(null, mockResponse, mockBodyResponse);
    });

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken);


    client.sendMessage(testMsg, mockDevice, mockOptions, function (err, response) {
        t.notOk(response, 'No response as expected');
        t.deepEqual(err, new errors.Internal(), 'Got Internal Error!');
    });

});


test('Pushwoosh send message success case with response code 500 test 2', function (t) {
    t.plan(5);

    var mockResponse = {
            statusCode: 500
        },
        mockBodyResponse = {
            status_code: 200,
            response: {}
        },
        expectedBody = {
            request: {
                application: testAppCode,
                auth: testAuthToken,
                notifications: [{
                    send_date: 'now',
                    ignore_user_timezone: true,
                    content: testMsg,
                    devices: []
                }]
            }
        },
        expectedResult = {description: 'Argument error', detail: mockBodyResponse.status_message, code: 210};

    fraudster.registerMock('request', function (params, callback) {
        t.ok(params, 'Params exists');
        t.deepEqual(params.body, expectedBody, 'Body are as expected');
        t.equal(params.method, 'POST', 'Method is POST as expected');
        callback(null, mockResponse, mockBodyResponse);
    });

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken);


    client.sendMessage(testMsg, function (err, response) {
        t.notOk(response, 'No response as expected');
        t.deepEqual(err, new errors.Internal(), 'Got Internal Error!');
    });
});

test('Pushwoosh send message success case with response code 400', function (t) {
    t.plan(5);

    var mockResponse = {
            statusCode: 400
        },
        mockBodyResponse = {
            status_code: 200,
            response: {}
        },
        expectedBody = {
            request: {
                application: testAppCode,
                auth: testAuthToken,
                notifications: [{
                    send_date: 'now',
                    ignore_user_timezone: true,
                    content: testMsg,
                    devices: []
                }]
            }
        },
        expectedResult = {description: 'Argument error', detail: mockBodyResponse.status_message, code: 210};

    fraudster.registerMock('request', function (params, callback) {
        t.ok(params, 'Params exists');
        t.deepEqual(params.body, expectedBody, 'Body are as expected');
        t.equal(params.method, 'POST', 'Method is POST as expected');
        callback(null, mockResponse, mockBodyResponse);
    });

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken);


    client.sendMessage(testMsg, function (err, response) {
        t.notOk(response, 'No response as expected');
        t.deepEqual(err, new errors.Malformed(), 'Got Malformed Error!');
    });
});


test('Pushwoosh send message success case with no response code', function (t) {
    t.plan(5);

    var mockDevice = 'someToken',
        mockOptions = {},
        mockResponse = {},
        mockBodyResponse = {
            status_code: 200,
            response: {}
        },
        expectedBody = {
            request: {
                application: testAppCode,
                auth: testAuthToken,
                notifications: [{
                    send_date: 'now',
                    ignore_user_timezone: true,
                    content: testMsg,
                    devices: [mockDevice]
                }]
            }
        },
        expectedResult = {description: 'Argument error', detail: mockBodyResponse.status_message, code: 210};

    fraudster.registerMock('request', function (params, callback) {
        t.ok(params, 'Params exists');
        t.deepEqual(params.body, expectedBody, 'Body are as expected');
        t.equal(params.method, 'POST', 'Method is POST as expected');
        callback(null, mockResponse, mockBodyResponse);
    });

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken);


    client.sendMessage(testMsg, mockDevice, function (err, response) {
        t.notOk(response, 'No response as expected');
        t.deepEqual(err, new Error('Unknown response code / error'), 'Got Correct Error!');
    });
});

test('Pushwoosh client delete message test 1', function (t) {
    t.plan(5);
    var expectedBody = {
            request: {
                auth: testAuthToken,
                message: testMsgCode
            }
        },
        mockResponse = {
            statusCode: 200
        },
        mockBodyResponse = {
            status_code: 200,
            response: {}
        };
    fraudster.registerMock('request', function (params, callback) {
        t.ok(params, 'Params exists');
        t.deepEqual(params.body, expectedBody, 'Body are as expected');
        t.equal(params.method, 'POST', 'Method is POST as expected');
        callback(null, mockResponse, mockBodyResponse);
    });

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken);

    client.deleteMessage(testMsgCode, function (err, response) {
        t.notOk(err, 'No error');
        t.deepEqual(response, {}, 'Response is as expected');
    });
});

test('Pushwoosh client delete message test error case 1', function (t) {
    t.plan(2);

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken);

    client.deleteMessage({}, function (err, response) {

        t.deepEqual(err, new Error('Message code must be provided'), 'Error as expected');
        t.notOk(response, 'No response as expected');
    });
});

test('Pushwoosh client delete message test 2', function (t) {
    t.plan(5);
    var expectedBody = {
            request: {
                auth: testAuthToken,
                message: testMsgCode
            }
        },
        mockResponse = {
            statusCode: 200
        },
        mockBodyResponse = {
            status_code: 200,
            response: {}
        };
    fraudster.registerMock('request', function (params, callback) {
        t.ok(params, 'Params exists');
        t.deepEqual(params.body, expectedBody, 'Body are as expected');
        t.equal(params.method, 'POST', 'Method is POST as expected');
        callback(testError);
    });

    var PwClient = getCleanTestObject(),
        client = new PwClient(testAppCode, testAuthToken);

    client.deleteMessage(testMsgCode, function (err, response) {

        t.deepEqual(err, testError, 'Error is as expected');
        t.notOk(response, 'No response as expected');
    });
});