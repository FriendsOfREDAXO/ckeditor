/**
 * Basic sample plugin inserting helpeviation elements into CKEditor editing area.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 */

// Register the plugin within the editor.
CKEDITOR.plugins.add( 'rex_help', {

	// Register the icons.
	icons: 'rex_help',

	// The plugin initialization logic goes inside this method.
	init: function( editor ) {

		// Define an editor command that opens our dialog.
		editor.addCommand( 'rex_help', new CKEDITOR.dialogCommand( 'helpDialog' ) );

		// Create a toolbar button that executes the above command.
		editor.ui.addButton( 'rex_help', {

			// The text part of the button (if available) and tooptip.
			label: 'Kurzhilfe',

			// The command to execute on click.
			command: 'rex_help',

			// The button placement in the toolbar (toolbar group name).
			toolbar: 'rex_help'
		});

		// Register our dialog file. this.path is the plugin folder path.
		CKEDITOR.dialog.add( 'helpDialog', this.path + 'dialogs/rex_help.js' );
	}
});

