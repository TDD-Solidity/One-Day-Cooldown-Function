async function increase(duration) {

    const id = Date.now();

    return new Promise((resolve, reject) => {
        
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_increaseTime',
            params: [duration],
            id,
        }, (err1) => {
            if (err1) return reject(err1);

            web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'evm_mine',
                id: id + 1,
            }, (err2, res) => (err2 ? reject(err2) : resolve(res)));
        });

    })
}

async function decrease(duration) {

    const id = Date.now();

    return new Promise((resolve, reject) => {
        
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_decreaseTime',
            params: [duration],
            id,
        }, (err1) => {
            if (err1) return reject(err1);

            web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'evm_mine',
                id: id + 1,
            }, (err2, res) => (err2 ? reject(err2) : resolve(res)));
        });

    })
}

const duration = {
    seconds: function (val) {
        return val;
    },
    minutes: function (val) {
        return val * this.seconds(60);
    },
    hours: function (val) {
        return val * this.minutes(60);
    },
    days: function (val) {
        return val * this.hours(24);
    },
}

module.exports = {
    increase,
    duration,
    decrease
};
