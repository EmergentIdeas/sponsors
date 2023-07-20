const webhandle = require('webhandle')
const express = require('express')
const path = require('path')

const MongoDataService = require('@dankolz/mongodb-data-service')
const SponsorsDreck = require('./sponsors-dreck')
const SponsorGroupsDreck = require('./sponsor-groups-dreck')
const sponsorsPrerun = require('./properties-page-prerun')

const filog = require('filter-log')
let log = filog('sponsors-integrator:')

let integrate = function (dbName, options) {
	let opt = Object.assign({
		collectionName: 'sponsors',
		groupsCollectionName: 'sponsorgroups',
		templateDir: 'node_modules/@dankolz/sponsors/views',
		mountPoint: '/admin/sponsors',
		groupsMountPoint: '/admin/sponsor-groups',
		allowedGroups: ['administrators']
	}, options || {})
	let collectionName = opt.collectionName


	// setup collections
	if (!webhandle.dbs[dbName].collections[collectionName]) {
		webhandle.dbs[dbName].collections[collectionName] = webhandle.dbs[dbName].db.collection(collectionName)
	}
	let groupsCollectionName = opt.groupsCollectionName
	if (!webhandle.dbs[dbName].collections[groupsCollectionName]) {
		webhandle.dbs[dbName].collections[groupsCollectionName] = webhandle.dbs[dbName].db.collection(groupsCollectionName)
	}

	// Setup sponsors
	let dataService = new MongoDataService({
		collections: {
			default: webhandle.dbs[dbName].collections[collectionName]
			, sponsorgroups: webhandle.dbs[dbName].collections[groupsCollectionName]
		}
	})
	webhandle.services.sponsors = dataService


	let dreck = new SponsorsDreck({
		dataService: dataService
	})

	let router = dreck.addToRouter(express.Router())
	let securedRouter = require('webhandle-users/utils/allow-group')(
		opt.allowedGroups,
		router
	)
	webhandle.routers.primary.use(opt.mountPoint, securedRouter)

	webhandle.pageServer.preRun.push(async (req, res, next) => {
		try {
			if (res.locals.page.sponsors) {
				res.locals.sponsors = await webhandle.services.sponsors.fetch(res.locals.page.sponsors)
			}
			if (res.locals.page.sponsorsByGroup) {
				res.locals.sponsors = await webhandle.services.sponsors.fetch({groups: res.locals.page.sponsorsByGroup})
			}
			if(res.locals.sponsors) {
				res.locals.sponsors.sort(({sortOrder: one = 0}, {sortOrder: two = 0}) => {
					return one > two ? -1 : 1
				})
			}
		}
		catch(e) {
			log.error({
				msg: 'could not fetch sponsors',
				error: e
			})
		}
		next()
	})

	// setup sponsor groups
	dataService = new MongoDataService({
		collections: {
			default: webhandle.dbs[dbName].collections[groupsCollectionName],
			sponsors: webhandle.dbs[dbName].collections[collectionName]
		}
	})
	webhandle.services.sponsorgroups = dataService

	let groupsDreck = new SponsorGroupsDreck({
		dataService: dataService
	})

	router = groupsDreck.addToRouter(express.Router())
	securedRouter = require('webhandle-users/utils/allow-group')(
		opt.allowedGroups,
		router
	)
	webhandle.routers.primary.use(opt.groupsMountPoint, securedRouter)


	// add templates
	if (opt.templateDir) {
		webhandle.addTemplateDir(path.join(webhandle.projectRoot, opt.templateDir))
	}
	
	// add for page properties
	if(webhandle.services.pageEditor.pagePropertiesPrerun) {
		webhandle.services.pageEditor.pagePropertiesPrerun.push(sponsorsPrerun)
	}

}

module.exports = integrate
