/**
 * The help dialog definition.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 */

// Our dialog definition.
CKEDITOR.dialog.add( 'helpDialog', function( editor ) {
	return {
		title: 'Kurzhilfe',
		minWidth: 390,
		minHeight: 230,
		contents: [
			{
			id: 'tab1',
			label: '',
			title: '',
			expand: true,
			padding: 0,
			elements: [
				{
				type: 'html',
				html: '<style type="text/css">' +
					'.cke_help_container' +
					'{' +
						'color:#000 !important;' +
						'padding:0px 10px 0;' +
						'margin-top:5px' +
					'}' +
					'.cke_help_container p' +
					'{' +
						'margin: 0 0 10px;' +
					'}' +
					'.cke_help_container .cke_help_logo' +
					'{' +
						'height:81px;' +
						'background-color:#fff;' +
						'background-image:url(' + CKEDITOR.plugins.get( 'rex_help' ).path + 'dialogs/logo_ckeditor.png);' +
						'background-position:center; ' +
						'background-repeat:no-repeat;' +
						'margin-bottom:10px;' +
					'}' +
					'.cke_help_container a' +
					'{' +
						'cursor:pointer !important;' +
						'color:#00B2CE !important;' +
						'text-decoration:underline !important;' +
					'}' +
					'</style>' +
					'<div class="cke_help_container">' +
					'<div class="cke_help_logo"></div>' +
					'<p style="text-align: center;">' +
						'CKEditor ' + CKEDITOR.version + ' (revision ' + CKEDITOR.revision + ')<br>' +
					'</p>' +
					'<p><strong>Neuer Abschnitt</strong><br />' + 
					'Enter</p>' +

					'<p><strong>Neue Zeile</strong><br />' + 
					'Shift+Enter</p>' +  

					'<p><strong>Rückgängig / Wiederholen</strong><br />' + 
					'Strg+Z / Strg+Y</p>' +  

					'<p><strong>Kopieren / Ausschneiden / Einfügen / Löschen</strong><br />' + 
					'Strg+C / Strg+X / Strg+V / Entf</p>' +  

					'<p><strong>Context Menü für Tabellen (z.B. Zeilen hinzufügen/entfernen), Links etc.</strong><br />' + 
					'Rechte Maustaste</p>' +  

					'<p><strong>Einfügen von reinem Text</strong><br />' + 
					'Nutzen Sie hierfür den entsprechenden Button in der Toolbar.</p>' +  

					'<p><strong>Einfügen von gestyltem Text (aus Word oder einer Website)</strong><br />' + 
					'Nutzen Sie hierfür den entsprechenden Button in der Toolbar.</p>' +  

					'<p><strong>Interne REDAXO Links einfügen</strong><br />' + 
					'Im Link-Dialog auf den Button "Interner Link" klicken.</p>' +  

					'<p><strong>REDAXO Medienpool Links einfügen</strong><br />' + 
					'Im Link-Dialog auf den Button "Mediepool Link" klicken.</p>' +  

					'<p><strong>Links zu Email-Adressen einfügen</strong><br />' + 
					'Im Link-Dialog den Link-Typ "Email" auswählen.</p>' +  

					'<p><strong>Magicline</strong><br />' + 
					'An Stellen an die man mit dem Cursor nicht hinkommt, erscheint eine rote Linie mit einem Pfeil-Button.<br />' + 
					'Durch Klick auf diesen Button wird eine neue Zeile eingefügt und der Cursor an diese Stelle positioniert.</p>' +  

					'<p> </p>' +
					'</div>'
			}
			]
		}
		],
		buttons: [ CKEDITOR.dialog.cancelButton ]
	};
});
