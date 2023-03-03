CKEditor AddOn - Changelog
==========================

### Version 4.20.2 - 03.03.2023

* Update auf CKEditor v4.16.2 Full
* Fixed: Einbindung multipler CKEditoren in MBlock / Gridblock

### Version 4.16.2 - 12. August 2021

* Update auf CKEditor v4.16.2 Full
* Fixed: Einbindung multipler CKEditoren in MBlock / Gridblock

### Version 4.16.1 - 20. Mai 2021

* Update auf CKEditor v4.16.1 Full
* Fixed: Neusortierung von MBlock in Verbindung mit ckeditor.
* Stylesheetparser bei Plugins hinzugefügt

### Version 4.13.1 - 21. Februar 2020

* Update auf CKEditor v4.13.1 Full
* Der CKEditor friert nun nicht mehr ein bei der Neusortierung in MBlock.

### Version 4.13.0 - 16. Oktober 2019

* Update auf CKEditor v4.13.0 Full
* Der CKEditor ist nun kompatibel mit MBlock.

### Version 4.11.3.1 - 19. März 2019

* Fixed: Der CKEditor wurde nicht vollständig geladen.

### Version 4.11.3 - 13. März 2019

* Update auf CKEditor v4.11.3 Full
* Smart Strip enfernt nun auch leere P-Tags die ein style Attribute haben (z.B. bei zentriertem Text), thx@KlemensWinkler

### Version 4.11.2 - 06. Februar 2019

* Update auf CKEditor v4.11.2 Full
* Mblock 3.x Full Compat, thx@fietstouring, thx@joachimdoerr

### Version 4.11.1 - 07. Januar 2019

* Update auf CKEditor v4.11.1 Full
* Mblock 3.x teilweise Compat, thx@fietstouring
* `rex_ckeditor::getProfiles()` hinzugfügt, thx@TobiasKrais

### Version 4.9.2 - 09. Juni 2018

* Update auf CKEditor v4.9.2 Full
* Ausgabe der Codebeispiele für REDAXO 5.6 wiederhergestellt
* Spanische Übersetzung hinzugefügt, thx@nandes2062
* disallowedContent ergänzt da sich margin Werte in den p-Tags verirren konnten
* Profile Cache-File wird beim REDAXO Cache löschen und beim REDAXO DB Import neu erzeugt

### Version 4.8.0-beta1 - 02. November 2017

* Update auf CKEditor v4.8.0 Full Nightly vom 02.11.2017 wegen Styleset Probleme in CKEditor v4.7.2, thx@rkemmere
* `rex_ckeditor::insertProfile()` ergänzt, thx@skerbis

### Version 4.7.2 - 25. August 2017

* Update auf CKEditor 4.7.2 Full
* Syntax Check vor Speicherung des JavaScript Config Objekts beim Profil hinzufügen/bearbeiten
* Methode `rex_ckeditor::profileExists()` hinzugefügt, prüft ob ein Profil vorhanden ist, thx@rkemmere
* Der CKEditor lässt sich nun auch über die CSS Klasse `rex-ckeditor` ansprechen. Ein Geschwindigkeitsvorteil bei der Editor-Initialisierung ist dadurch möglich (aber noch nicht wirklich bewiesen)..., thx@joachimdoerr
* Readme: "CKEditor in MBlock einsetzen" Abschnitt hinzugefügt

### Version 4.6.2 - 15. März 2017

* Portierung zu REDAXO 5
* Update auf CKEditor 4.6.2 FULL!
* Vereinfachter Initialisierungs-Code ohne JavaScript, siehe Readme
* Neuer Readme Eintrag: Bilder als Media Manager Urls umschreiben
* Extra Plugins Mechanismus eingebaut, siehe Readme
* Editor Profile
* Smart Strip Einstellung ins Profil verschoben
* Ab jetzt: AddOn Version gleich mit CKEditor Version

### Version 3.1.1 - 14. März 2016

* Update: Bitte die Hinweise in der `UPDATE.md` beachten!
* Medienpool Link-Button fixed. Bei Einbindung des CKEditors als Metainfo im Medienpool ist nur eine manuelle Linkeingabe ohne Link-Buttons möglich.

### Version 3.1.0 - 01. März 2016

* Update: Bitte die Hinweise in der `UPDATE.md` beachten!
* Update auf CKEditor 4.5.7
* Fixed #22: CKEditor sollte nun auch im Medienpool funktionieren

### Version 3.0.0 - 10. August 2015

* Update: Bitte die Hinweise in der `UPDATE.md` beachten!
* Update auf CKEditor 4.5.2
* Toolbar Configurator unter Hilfe > Tools hinzugefügt

### Version 2.6.0 - 01. Februar 2015

* Update: Bitte die Hinweise in der `UPDATE.md` beachten!
* Update auf CKEditor 4.4.7
* Advanced Tab im Link Dialog wird beim Standard Modul per default angezeigt
* Update Meldung (wenn Update per Installer durchgeführt) + `UPDATE.md` hinzugefügt (auch über Hilfe verfügbar)

### Version 2.5.1 - 03. Dezember 2014

* Module auf eine eigene Seite verschoben

### Version 2.5.0 - 25. Oktober 2014

* Updatefähigkeit für REDAXO 4.6 hergestellt. Einstellungen werden jetzt im Data-Ordner gespeichert.

### Version 2.4.0 - 25. September 2014

* Update auf CKEditor 4.4.5
* Fixed #19: Das deaktivieren der Smart Strip Einstellung führte dazu das Linkmap und Co. nicht mehr verfügbar waren im Editor, thx@krugar
* Optimierungen am Image Modul vorgenommen 
* Hinweis zum Addon-Update in die Readme aufgenommen: Bei einem Update des Addons sollte nach der Reinstallation immer der Browser-Cache komplett gelöscht werden!

### Version 2.3.0 - 29. Juli 2014

* Update auf CKEditor 4.4.3
* Neues Image Modul (Text + Bild) hinzugefügt. Benötigt das be_utilities > jquery_ui Plugin
* XForm Table Manager CSS verbessert

### Version 2.2.1 - 17. April 2014

* Abschnitt "Mehrere Editoren mit gleicher Konfiguration" zur Readme hinzugefügt
* Abschnitt "Ausgabe nachträglich manipulieren" zur Readme hinzugefügt
* Kleinere Readme-Korrekturen

### Version 2.2.0 - 08. Februar 2014

* Fixed #17: Geschützte Leerzeichen werden nicht mehr komplett entfernt, thx@webghost
* Fixed #16: Smart Strip Einstellung greift jetzt auch, wenn man den CKEditor per CSS Klasse `ckeditor` aufruft
* Resize Grip Einstellung hinzugefügt um zu steuern ob der Resize Grip zum vergrößern des Editors angezeigt wird
* Weitereführende Links und Artikel u.a. von webghost in die Readme gepackt

### Version 2.1.1 - 27. Januar 2014

* Image2 Plugin aus Litemodul entfernt, da unter Umständen Bilder per Copy And Paste im Editor landen konnten
* Fehlende ColorButtons zum Standardmodul hinzugefügt
* Bestätigungsdialog bei Modulaktualisierung hinzugefügt
* Finetuning

### Version 2.1.0 - 24. Januar 2014

* Module verbessert, CKEditor Replace jetzt per Textarea ID
* Custom Styles Beispiel in der Readme verbessert (vollständiges Beispiel-Modul hinzugefügt). Kommt jetzt ganz ohne eine extra CSS-Datei aus, thx@webghost
* Bilder haben einen Abstand bekommen zum Text
* Standard Modul: Alle verfügbaren Buttons und somit Funktionen hinzugefügt

### Version 2.0.0 - 23. Januar 2014

* AddOn Rewrite inkl. Update auf CKEditor 4.3.2 Standard + einige extra Plugins (siehe Readme)
* 2 neue Beispielmodule mit integrierter Konfiguration
* Medienpool-Button zum Image-Dialog hinzugefügt
* Smart Strip Einstellung um leere P's und multiple BR's zu entfernen
* Abschnitt "CKEditor Toolbar Buttons" zur Readme hinzugefügt, thx@webghost
* Abschnitt "Custom Styles hinzufügen (ausgehend vom Lite Modul)" zur Readme hinzugefügt, thx@webghost
* Finetuning

### Version 1.0.5 - 22. September 2013

* Mögliche mehrfach vorkommende BRs werden nun herausgefiltert. Der User hat so keine Chance mehr künstliche Abstände zu erzeugen.

### Version 1.0.4 - 09. September 2013

* Plugin `help` hinzugefügt. Durch Klick auf den entsprechenden Button wird eine Kurzhilfe für Redakteure angezeigt.
* `pastefromword` Plugin aktualisiert
* Der Target-Tab wurde im Link-Dialog standardmäßig ausgeschaltet. Über die Option `linkShowTargetTab` in der `config.js` wieder einzuschalten.

### Version 1.0.3 - 27. Mai 2013

* Per CSS-Klasse `ckeditor` kann man den CKEditor auch in den MetaInfos oder im XForm TableManager verwenden.
* Die Option `lazy_load` wurde standardmäßig auf `false` gesetzt in der `settings.inc.php`. Damit ist der CKEditor jetzt überall im Backend einsatzbereit.
* Per Link-Dialog lassen sich nun auch Email-Adressen nutzen. Wer den [Email Obfuscator](https://github.com/RexDude/email_obfuscator) einsetzt sollte bitte darauf achten Version 1.2.6 und höher zu nutzen!

### Version 1.0.2 - 19. April 2013

* Table Dialog angepasst und auf das Wesentliche reduziert
* Lazy Loading Option eingebaut um den CKEditor erst zu laden wenn er auch wirklich gebraucht wird

### Version 1.0.1 - 12. April 2013

* I18N Support
* Eingabe-Modul checkt ob das AddOn installiert ist

### Version 1.0.0 - 11. April 2013



