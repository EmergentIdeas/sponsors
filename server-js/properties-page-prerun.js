module.exports = async (req, res) => {
	res.locals.sponsorGroups = await webhandle.services.sponsorgroups.fetch()
}