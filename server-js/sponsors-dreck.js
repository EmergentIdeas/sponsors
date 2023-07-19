const Dreck = require('dreck')
const _ = require('underscore')
const addCallbackToPromise = require('dreck/add-callback-to-promise')

const simplePropertyInjector = require('dreck/binders/simple-property-injector')
const createValuedCheckboxInjector = require('dreck/binders/create-valued-checkbox-injector')

let wh = require('webhandle')

class SponsorsDreck extends Dreck {
	constructor(options) {
		super(options)
		let curDreck = this
		_.extend(this, 
			{
				templatePrefix: 'sponsors/sponsors/',
				locals: {
					pretemplate: 'app_pre',
					posttemplate: 'app_post'
				},
				injectors: [
					(req, focus, next) => {
						simplePropertyInjector(req, focus, curDreck.bannedInjectMembers, next)
					}
					, createValuedCheckboxInjector('groups')
				]
			}
		)
	}
	addAdditionalFormInformation(focus, req, res, callback) {
		let p = new Promise(async (resolve, reject) => {
			let groups = await wh.services.sponsorgroups.fetch()
			res.locals.groups = groups
			resolve(focus)
		})
		
		return addCallbackToPromise(p, callback)
	}
}

module.exports = SponsorsDreck