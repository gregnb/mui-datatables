const path = require("path");

function excludeNodeModulesExcept(modules) {
	var pathSep = path.sep;
	if (pathSep == "\\") {
		// must be quoted for use in a regexp:
		pathSep = "\\\\";
	}

	var moduleRegExps = modules.map(
		(modName) => new RegExp("node_modules" + pathSep + modName.replace('/', '\\\\'))
	);

	return (modulePath) => {
		if (/node_modules/.test(modulePath)) {
			for (var i = 0; i < moduleRegExps.length; i++) {
				if (moduleRegExps[i].test(modulePath)) {
					// if one of the regexes matches, we leave out the modulePath from exclusion
					return false;
				}
			}
			// if none of the regexes matches, return true and exclude the path from processing by babel-loader
			return true;
		}
		return false;
	};
}

module.exports = excludeNodeModulesExcept;
