const express = require('express')
const router = express.Router();
const { transpiler } = require('../transpiler')
const { getClassifier } = require('../classifier/classifier')

router.get('/', async (req, res) => {
    const intent = req.query.intent;
    const chain = req.query.chain;
    const userAddress = req.query.userAddress;

    try {
        const classifier = await getClassifier();
        const txn = await transpiler(intent, classifier, userAddress, chain);
        console.log(txn, 'txn')
        res.status(200).send({
            transactions: JSON.stringify(txn)
        })
    } catch (err) {
        console.log(err);
        res.status(503).send({
            transactions: ""
        })
    }

})

module.exports = router;