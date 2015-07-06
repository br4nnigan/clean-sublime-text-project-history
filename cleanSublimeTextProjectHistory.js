var osenv = require('osenv')
var home = osenv.home();
var fs = require("fs");
var filepath = home+"/Library/Application Support/Sublime Text 3/Local/Session.sublime_session";


fs.readFile(filepath, "binary", function(err, file) {

	if(err) {
		console.log( err + "\n" );
	}
	else{

		file = file.replace( /\t/g,  '', "g"); // escape tabs

		var sublime_session = JSON.parse(file)
		var lengthBefore = sublime_session.workspaces.recent_workspaces.length;
		var lengthAfter;

		sublime_session.workspaces.recent_workspaces = sublime_session.workspaces.recent_workspaces.filter(function (path) {

			if ( !fs.existsSync(path) ){
				console.log('Path does not exist:', path);
				return false;
			}else{
				return true;
			}
		});

		lengthAfter = sublime_session.workspaces.recent_workspaces.length

		if ( lengthAfter != lengthBefore ){

			console.log("Removed", lengthBefore-lengthAfter, " entries.");

			file = JSON.stringify(sublime_session);

			fs.writeFile(filepath, file, function (err) {
				if (err) if (err) throw err;
				console.log("writeFile callback");
			});
		}

		console.log("Cleaned up.");

	}

});