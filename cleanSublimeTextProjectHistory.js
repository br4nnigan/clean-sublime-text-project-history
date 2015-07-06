var osenv = require('osenv')
var home = osenv.home();
var fs = require("fs");
var session_file_path = home+"/Library/Application Support/Sublime Text 3/Local/Session.sublime_session";


fs.readFile(session_file_path, "binary", function(err, session_file) {

	if(err) {
		console.log( err + "\n" );
	}
	else{

		session_file = session_file.replace( /\t/g,  '', "g"); // escape tabs

		var
		sublime_session = JSON.parse(session_file),
		lengthBefore    = sublime_session.workspaces.recent_workspaces.length,
		lengthAfter;



		sublime_session.workspaces.recent_workspaces = sublime_session.workspaces.recent_workspaces.filter(function (workspace_file_path) {

			if ( !fs.existsSync(workspace_file_path) ){
				console.log('Workspace does not exist:', workspace_file_path);
				return false;
			}else {

				var
				workspace,
				project_file_path,
				workspace_file = fs.readFileSync(workspace_file_path, {encoding: "utf8"});

				if ( workspace_file ){

					workspace_file    = workspace_file.replace( /\t/g,  '', "g"); // escape tabs
					workspace         = JSON.parse(workspace_file);
					project_file_path = workspace_file_path.substr(0, workspace_file_path.lastIndexOf("/")) + "/" + workspace.project;

					if ( workspace.project && !fs.existsSync(project_file_path) ){
						console.log('Project does not exist:', project_file_path);
						return false;
					}else{
						// console.log('Project DOES exist:', project_file_path);
					}
				}

				return true;
			}
		});



		lengthAfter = sublime_session.workspaces.recent_workspaces.length

		if ( lengthAfter != lengthBefore ){

			session_file = JSON.stringify(sublime_session);

			fs.writeFile(session_file_path, session_file, function (err) {
				if (err)
					throw err;
				else
					console.log("Removed", lengthBefore-lengthAfter, " entries.");
			});
		}else{
			console.log("Nothing to remove.");
		}

	}

});