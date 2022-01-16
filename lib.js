const lib = (module.exports = {
  sessions: {},

  sendJson: function (res, obj = null) {
    res.writeHead(200, { "Content-type": "application/json" });
    if (obj != null) res.write(JSON.stringify(obj));
    res.end();
  },

  sendError: function (res, code, cause = "") {
    console.error(code, cause);
    res.writeHead(code, { "Content-type": "application/json" });
    res.write(JSON.stringify({ cause }));
    res.end();
  },

  checkPermissions: function(reqStr, roles) {

    console.log('\'' + reqStr + '\'')

    let permittedRoles = []
    for(let pattern in lib.permissions) {
        let regexp = new RegExp(pattern)
        if(regexp.test(reqStr)) {
            permittedRoles = lib.permissions[pattern]
            break
        }
    }

    console.log('permittedRoles', permittedRoles)

    // jeśli url ma pustą tablicę ról, jest niechroniony
    if(permittedRoles.length < 1) return true
    if(!roles || roles.length < 1) return false

    let intersection = []
    roles.forEach(function(role) { if(permittedRoles.includes(role)) intersection.push(role) })
    return intersection.length > 0
},


});
