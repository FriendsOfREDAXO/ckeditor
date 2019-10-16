CKEditor AddOn für REDAXO 5
===========================

Der [CKEditor](http://ckeditor.com/) für REDAXO inkl. eines Beispielmoduls.

Features
--------

* CKEditor Full
* REDAXO Modul
* Editor Profile
* Eigene Plugins benutzen
* Smart Strip Funktion: filtert leere P's und mehrfach vorkommende BR's heraus
* Linkdialog: Unterstützung für Links über REDAXO Linkmap und Medienpool
* Imagedialog: Unterstützung für Links über REDAXO Medienpool
* Vereinfachter Tabellen- und Imagedialog
* Kurzhilfe für REDAXO Redakteure

Eigene CKEditor Plugins benutzen
--------------------------------

Eigene Plugins werden einfach in dass project Addon dort unter `/install/ckeditor/plugins/` gelegt. Diese werden automatisch in das CKEditor Plugin Verzeichnis kopiert bei Install, Reinstall und Update des CKEditor AddOns und stehen so immer zur Verfügung. Im Profil muss man dann noch unter `extraPlugins` das Plugin mit auflisten (durch Komma getrennt wenn mehrere). Alles weitere sollte man der Doku des Plugins entnehmen... ;) 

Bitte beachten: Sollten nach einem Update die eigene Plugins nicht kompatibel sein mit der neusten CKEditor Version kann der Editor unter Umständen nicht mehr geladen werden. Abhilft schafft hier die betreffenden Plugins im Profil unter `extraPlugins` zu entfernen.

CKEditor in Modulen einsetzen
------------------------------

```html
<textarea class="ckeditor" data-ckeditor-profile="lite" name="REX_INPUT_VALUE[1]">REX_VALUE[1]</textarea>
```

* Die Textarea muss lediglich die CSS-Klasse `ckeditor` zugewiesen bekommen. 
* Desweiteren regelt man über `data-ckeditor-profile` das zu ladende Profil. 
* Wenn nötig kann man über `data-ckeditor-height` die Höhe überschreiben (wird sonst aus dem Profil genommen).

CKEditor in den Metainfos einsetzen
-----------------------------------

* In dem Feldattribute-Feld: `class="ckeditor" data-ckeditor-profile="lite"`
* Optional ebenfalls möglich: `data-ckeditor-height="150"`

CKEditor in yForm einsetzen
---------------------------

* Im Individuelle Attribute-Feld: `{ "class" : "ckeditor", "data-ckeditor-profile" : "lite" }`
* Weitere Attribute kommagetrennt möglich.

CKEditor in MForm einsetzen
---------------------------

```php
$mform->addTextareaField(1); 
$mform->setLabel('Text');
$mform->addAttribute('class', 'ckeditor');
$mform->addAttribute('data-ckeditor-profile', 'lite');
$mform->addAttribute('data-ckeditor-height', '200'); // optional
```
Auch andere Schreibweisen sind möglich, siehe hierzu die MForm Dokumentation.

CKEditor in MBlock einsetzen
----------------------------

```php
$mform->addTextAreaField("$id.0.textarea", array(
    'label'                 => 'Text',
    'class'                 => 'ckeditor',
    'data-ckeditor-profile' => 'lite'
));
```
Auch andere Schreibweisen sind möglich, siehe hierzu die MBlock Dokumentation.

Custom Styles hinzufügen
------------------------

Das Profil muss wie folgt ergänzt werden:

* Die __Styles__ Combobox zur Toolbar hinzufügen
* __stylesSet__ definieren, ersetzt das Besetehende das definiert ist in `/assets/addons/ckeditor/vendor/styles.js`
* Custom CSS per __contentsCss__ für den Editor hinzufügen

Hier ein Lite Profil mit Custom Styles:

```javascript
{
    height: 400,
    fillEmptyBlocks: false,
    forcePasteAsPlainText: true,
    entities: false,
    linkShowTargetTab: false,
    format_tags: 'p;h2;h3',
    removePlugins: 'elementspath',
    extraPlugins: 'rex_help',
    removeDialogTabs: 'link:advanced',
    disallowedContent: 'p{margin,margin-bottom,margin-left,margin-right,margin-top};img{border-style,border-width,margin,margin-bottom,margin-left,margin-right,margin-top};table{width,height}[align,border,cellpadding,cellspacing,summary];caption;',
    toolbar: [
        ['Format', 'Styles'],
        ['Bold', 'Italic'],
        ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'],
        ['Link', 'Unlink', 'Anchor'],
        ['Table'],
        ['PasteText', 'PasteFromWord'],
        ['Maximize'],
        ['rex_help']
        // no comma after last entry!!!
    ],
    stylesSet: [
        { name: 'Grün', element: 'span', attributes: { 'class': 'green' } },
        { name: 'Blau', element: 'span', attributes: { 'class': 'blue' } }
        // no comma after last entry!!!
    ],    
    contentsCss: [CKEDITOR.basePath + 'contents.css', 
        '.green { background: lightgrey; color: green; }' +
        '.blue { background: lightgrey; color: blue; }'
        // no plus after last entry!!!
    ]
    // no comma after last entry!!!
}
```

Ausgabe nachträglich manipulieren
---------------------------------

```php
<?php
$html = <<< EOT
REX_VALUE[id=1 output=html]
EOT;

echo strtoupper($html);
?>
```

Bilder als Media Manager Urls umschreiben 
-----------------------------------------

Hilfreich wenn man Bilder nicht über einen REX_MEDIABUTTON[] sondern per Image Button aus dem Medienpool holt.

```php
<?php
$html = <<< EOT
REX_VALUE[id=1 output=html]
EOT;

echo '<div class="ckeditor-output">';
echo rex_ckeditor::replaceImageTags($html, 'my_media_type');
echo '</div>';
?>
```

```css
.ckeditor-output img { } 
.ckeditor-output img[style*="left"] { }
.ckeditor-output img[style*="right"] { }
```


Prüfen ob ein CKEditor Profil existiert
---------------------------------------

```php
if (rex_ckeditor::profileExists('lite')) {
	// profil "lite" existiert
}
```

Profil anlegen
---------------------------------------
Methode zur Erstellung eines neuen Profils, z.B. bei Installation eines Addons oder Moduls

```php
rex_ckeditor::insertProfile('profilname', $description, $jscode, '1');
```

Beispiel mit vorheriger Prüfung:

```php
// Ist CKeditor verfügbar
if (rex_addon::get('ckeditor')->isAvailable()) {

	// Prüfe ob das gewünschte Profil existiert
	if (!rex_ckeditor::profileExists('profilname')) {

		// Erstelle das Profil
		rex_ckeditor::insertProfile('profilname', $description, $jscode, '1');
	}
}
```


CKEditor Toolbar Buttons
------------------------

Hinweis: Mache Buttons sind nur verfügbar wenn die zugehörigen CKEditor Plugins installiert wurden.

* Source, Save, NewPage, DocProps, Preview, Print, Templates, document
* Cut, Copy, Paste, PasteText, PasteFromWord, Undo, Redo
* Find, Replace, SelectAll, Scayt
* Form, Checkbox, Radio, TextField, Textarea, Select, Button, ImageButton, HiddenField (benötigt das Forms Plugin!)
* Bold, Italic, Underline, Strike, Subscript, Superscript, RemoveFormat
* NumberedList, BulletedList, Outdent, Indent, Blockquote, CreateDiv, JustifyLeft, JustifyCenter, JustifyRight, JustifyBlock, BidiLtr, BidiRtl
* Link, Unlink, Anchor
* CreatePlaceholder, Image, Flash, Table, HorizontalRule, Smiley, SpecialChar, PageBreak, Iframe, InsertPre
* Styles, Format, Font, FontSize
* TextColor, BGColor
* UIColor, Maximize, ShowBlocks
* About

Links
-----

* CKEditor Toolbar Configurator: http://nightly.ckeditor.com/17-02-23-07-09/standard/samples/toolbarconfigurator/index.html
* CKEditor Addon für REDAXO konfigurieren: http://usysto.net/blog/redaxo_ckeditor_addon.php
* REDAXO Artikel im Frontend editieren mit dem CKEditor: http://usysto.net/blog/redaxo_frontend_edit_mit_ckeditor.php
* Alle CKEditor Config-Optionen: http://docs.ckeditor.com/#!/api/CKEDITOR.config
* CKEditor Best Practices: http://docs.ckeditor.com/#!/guide/dev_best_practices
* Content Filtering (ACF): http://docs.ckeditor.com/#!/guide/dev_acf

Hinweise
--------

* Getestet mit REDAXO 5.3
* AddOn-Ordner lautet: `ckeditor`

Changelog
---------

siehe `CHANGELOG.md` des AddOns

Lizenz
------

* CKEditor AddOn: MIT-Lizenz, siehe `LICENSE.md` des AddOns
* CKEditor: siehe `LICENSE.md` des CKEditors

Credits
-------

* CKSource, Xong, webghostx, phoebusryan, skerbis, georgkaser, fietstouring, dergel, prenzlweb, krugar, cukabeka, IngoWinter, JeGr, alexplusde, RexDude

