var osenv = require('osenv')
var home = osenv.home();
var fs = require("fs");
var strip = require('strip-comments');
var session_file_path = home+"/Library/Application Support/Sublime Text 3/Local/Session.sublime_session";


fs.readFile(session_file_path, "binary", function(err, session_file) {

	if(err) {
		console.log( err + "\n" );
	}
	else{

		session_file = session_file.replace( /\t/g,  '', "g"); // escape tabs

		var
		sublime_session = JSON.parse(session_file),
		cleaned = 0;

console.log('Checking workspaces.recent_workspaces...');
		sublime_session.workspaces.recent_workspaces = sublime_session.workspaces.recent_workspaces.filter( checkFilePath);

console.log('Checking projects in workspaces.recent_workspaces...');
		sublime_session.workspaces.recent_workspaces = sublime_session.workspaces.recent_workspaces.filter( checkProjectInWorkspace );

console.log('Checking new_window_settings.file_history...');
		sublime_session.settings.new_window_settings.file_history = sublime_session.settings.new_window_settings.file_history.filter( checkFilePath );

console.log('Checking select_project.selected_items...');
		for (var i = 0, wind; i < sublime_session.windows.length; i++) {
			wind = sublime_session.windows[i];
			wind.select_project.selected_items = wind.select_project.selected_items.filter( function(e,s) {
				s = e.split(","); // an item is "searchterm,projectpath"
				e = s.length > 1 ? s[1] : e;
				return checkFilePath(e);
			} );
		}


		function checkProjectInWorkspace (file_path) {


			var
			workspace,
			project_file_path,
			workspace_file = fs.readFileSync(file_path, {encoding: "utf8"});

			if ( workspace_file ){

				workspace_file    = strip(workspace_file.replace( /\t/g,  '', "g")); // escape tabs, strip comments
				workspace         = JSON.parse(workspace_file);
				project_file_path = file_path.substr(0, file_path.lastIndexOf("/")) + "/" + workspace.project;

				if ( workspace.project && !fs.existsSync(project_file_path) ){
					console.log("    Removing '" + project_file_path + "'");

				}else{
					// console.log('Project DOES exist:', project_file_path);
					return true;
				}
			}
			cleaned++;
			return false;
		}

		function checkFilePath(file_path) {

			if ( !fs.existsSync(file_path) ){
				console.log("    Removing '" + file_path + "'");
				cleaned++;
				return false;
			}else {
				return true;
			}
		}


		if ( cleaned > 0 ){

			session_file = JSON.stringify(sublime_session);

			fs.writeFile(session_file_path, session_file, function (err) {
				if (err)
					throw err;
				else
					console.log("Removed " + cleaned + " entries.");
			});
		}else{
			console.log("Nothing to remove.");
		}

	}

});