var express = require('express')
var router = express.Router()

router.get('/',function (req,res) {
	// body...
	// return res.json({type:true})
	res.render('index')
})

module.exports = router; 