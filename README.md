# Add sponsors to a webhandle environment

## Install

```
npm install @dankolz/sponsors
```

Add to less: 
```
@import "../node_modules/@dankolz/sponsors/less/sponsors";
```

Add to client js:

```
require('@dankolz/sponsors/client-js/sponsors.js')
```

Add to server js:
```
const sponsorsIntegrator = require('@dankolz/sponsors/server-js/sponsors-integrator')
sponsorsIntegrator(dbName)
```

By default, the urls are:

/admin/sponsors
/admin/sponsor-groups

Services are:
- sponsors
- sponsorgroups