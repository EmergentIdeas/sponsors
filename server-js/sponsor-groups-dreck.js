const Dreck = require('dreck')
const _ = require('underscore')
const addCallbackToPromise = require('dreck/add-callback-to-promise')

// const formInjector = require('form-value-injector')
const simplePropertyInjector = require('dreck/binders/simple-property-injector')


class SponsorGroupsDreck extends Dreck {
	constructor(options) {
		super(options)
		let curDreck = this
		_.extend(this, 
			{
				templatePrefix: 'sponsors/sponsor-groups/',
				locals: {
					pretemplate: 'app_pre',
					posttemplate: 'app_post'
				},
				injectors: [
					(req, focus, next) => {
						simplePropertyInjector(req, focus, curDreck.bannedInjectMembers, next)
					}
				]
			}
		)
	}
}

module.exports = SponsorGroupsDreck