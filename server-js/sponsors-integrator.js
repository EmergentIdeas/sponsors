const webhandle = require('webhandle')
const express = require('express')
const path = require('path')

const SponsorsDreck = require('./sponsors-dreck')

let integrate = function(dbName, options) {
	let opt = Object.assign({
		collectionName: 'sponsors',
		templateDir: 'node_modules/@dankolz/sponsors/views',
		mountPoint: '/admin/sponsors',
		allowedGroups: ['administrators']
	}, options || {})
	let collectionName = opt.collectionName
	if(!webhandle.dbs[dbName].collections[collectionName]) {
		webhandle.dbs[dbName].collections[collectionName] = webhandle.dbs[dbName].db.collection(collectionName)
	}
	
	let dreck = new SponsorsDreck({
		mongoCollection: webhandle.dbs[dbName].collections[collectionName],
	})
	
	let router = dreck.addToRouter(express.Router())
	let securedRouter = require('webhandle-users/utils/allow-group')(
		opt.allowedGroups,
		router
	)
	webhandle.routers.primary.use(opt.mountPoint, securedRouter)
	
	if(opt.templateDir) {
		webhandle.addTemplateDir(path.join(webhandle.projectRoot, opt.templateDir))
	}
	
	webhandle.pageServer.preRun.push((req, res, next) => {
		let pageName = req.path.split('/').pop()
		if(!pageName) {
			pageName = 'index'
		}
		
		if(res.locals.page.sponsors) {
			webhandle.dbs[dbName].collections[collectionName].find(res.locals.page.sponsors).toArray((err, result) => {
				if(err) {
					log.error(err)
				}
				else if(result){
					res.locals.sponsors = result
				}
				next()
			})
		}
		else {
			next()
		}
	})
	
}

module.exports = integrate