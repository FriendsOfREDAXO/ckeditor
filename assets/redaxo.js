function rex_ckeditor_init(textareaId) {
	// this function assumes this global js vars from profile file: ckDefaultProfileName, ckProfiles, ckSmartStripSettings, ckRexHelpPluginAvailable
	var jTextarea = $('#' + textareaId);

	if (ckDefaultProfileName !== '' && $('#' + textareaId).length) {
		var currentEditorConfig;
		var currentProfileName;

		// set config object
		if (jTextarea.attr('data-ckeditor-profile') && jTextarea.attr('data-ckeditor-profile') in ckProfiles) {
			currentProfileName = jTextarea.attr('data-ckeditor-profile');
		} else {
			currentProfileName = ckDefaultProfileName;
		}

		currentEditorConfig = ckProfiles[currentProfileName];

		// add smart strip class
		if (ckSmartStripSettings[currentProfileName] === 1) {
			jTextarea.addClass('ckeditor-smartstrip');
		}

		// overwrite height if necessary
		if (jTextarea.attr('data-ckeditor-height')) {
			currentEditorConfig.height = jTextarea.attr('data-ckeditor-height');
		}

		// make sure rex_help is available otherwise js error		
		if (ckRexHelpPluginAvailable) {
			currentEditorConfig.extraPlugins = currentEditorConfig.extraPlugins + ',rex_help';
		} else {
			currentEditorConfig.extraPlugins = currentEditorConfig.extraPlugins.replace(/rex_help/g,'');
		}

		// finally replace textareas
		CKEDITOR.replace(textareaId, currentEditorConfig);
	}
}

function rex_ckeditor_init_all() {
	var i = 0;

	$('.ckeditor,.rex-ckeditor').each(function() {
		i++;

		// if id of textarea is missing set one, otherwise ckeditor replace will not work
		if (!$(this).attr('id')) {
			$(this).attr('id', 'ckeditor-' + i);
		}

		var textareaId = $(this).attr('id');

		rex_ckeditor_init(textareaId);
	});
}

function rex_ckeditor_destroy(instanceName) {
	for (name in CKEDITOR.instances) {
		CKEDITOR.instances[instanceName].destroy(true);
	}
}

function rex_ckeditor_destroy_all() {
	for (name in CKEDITOR.instances) {
		CKEDITOR.instances[name].destroy(true);
	}
}

function rex_ckeditor_get_link_from_linkmap() {
	var linkMap = openLinkMap();

	$(linkMap).on('rex:selectLink', function (event, linkurl, linktext) {
		event.preventDefault();
		linkMap.close();

		jQuery('.rex-url input').val(linkurl);
		jQuery('.rex-protocol option:last').prop('selected', true);
	});
}

function rex_ckeditor_get_link_from_mediapool() {
	var mediapool = openMediaPool('ckeditor_medialink');

	$(mediapool).on('rex:selectMedia', function (event, filename) {
		event.preventDefault();
		mediapool.close();
	
		jQuery('.rex-url input').val("/media/" + filename);
		jQuery('.rex-protocol option:last').prop('selected', true); // only for link dialog
	});
}

$(document).on('rex:ready', function (event, container) {
	// mblock compat
	if ($('.mblock_wrapper').length > 0 ) {
		// update textareas before destroying editors
		for (var i in CKEDITOR.instances) {
			CKEDITOR.instances[i].updateElement();
		}

		rex_ckeditor_destroy_all();
	} 

	// initialize ckeditor
	rex_ckeditor_init_all();

	// js config code check
	$('#rex-page-ckeditor-profiles form').submit(function(f) {
		var code = '';

		if ($('.CodeMirror').length) {
			var editor = $('.CodeMirror')[0].CodeMirror;
			code = editor.getValue();
		} else {
			code = $('#ckeditor-jscode').val();
		}

		if (code.charAt(0) !== '{' ) {
			if (!confirm($('#rex-ckeditor-lang-strings').attr('data-lang-ckeditor-js-config-object-syntax-check-4') + '\n\n' + $('#rex-ckeditor-lang-strings').attr('data-lang-ckeditor-js-config-object-syntax-check-3'))) {
				f.preventDefault();
			}
		}

		if (code !== '') {
			try {
				eval('var config = ' + code);
			} catch (e) {
				if (e instanceof SyntaxError) {
					if (!confirm($('#rex-ckeditor-lang-strings').attr('data-lang-ckeditor-js-config-object-syntax-check-1') + '\n\n' + $('#rex-ckeditor-lang-strings').attr('data-lang-ckeditor-js-config-object-syntax-check-2a') + '\n' + e.message + ' ' + $('#rex-ckeditor-lang-strings').attr('data-lang-ckeditor-js-config-object-syntax-check-2b') + ' ' + e.lineNumber + '\n\n' + $('#rex-ckeditor-lang-strings').attr('data-lang-ckeditor-js-config-object-syntax-check-3'))) {
						f.preventDefault();
					}
				} else {
					throw (e);
				}
			}
		}
	});

	// smart strip
	$('form').submit(function() {
		if ($('.ckeditor-smartstrip').length) {
			for (var i in CKEDITOR.instances) {
				var data = CKEDITOR.instances[i].getData();
				var doDataUpdate = false;

				// replace &nbsp;
				if (data.indexOf("&nbsp;") != -1) {
					data = data.replace(/&nbsp;/g, "  ");
					doDataUpdate = true;
				}

				// replace multiple <br>s with a single one
				if (data.indexOf("<br />\n<br />") != -1 || data.indexOf("<br />\r\n<br />") != -1 || data.indexOf("<br /><br />") != -1) {
					data = data.replace(/(<br\s*\/?>\s*)+/igm, "<br />\n");
					doDataUpdate = true;
				}

				// replace leading <br>s
				if (data.match(/(<(?!br)(\w)[^>]*>)(\s*<br\s*\/?>\s*)+/igm)) {
					data = data.replace(/(<(?!br)(\w)[^>]*>)(\s*<br\s*\/?>\s*)+/igm, '$1');
					doDataUpdate = true;
				}

				// replace trailing <br>s
				if (data.match(/(\s*<br\s*\/?>\s*)+(<\/(?!br)(\w)>)/igm)) {
					data = data.replace(/(\s*<br\s*\/?>\s*)+(<\/(?!br)(\w)>)/igm, '$2');
					doDataUpdate = true;
				}

				// replace empty paragraphs
				if (data.match(/(<p[^>]*>(\s|&nbsp;|<br\s*\/?>)*<\/p>)/igm)) {
					data = data.replace(/(<p[^>]*>(\s|&nbsp;|<br\s*\/?>)*<\/p>)/igm, '');
					doDataUpdate = true;
				}

				if (doDataUpdate) {
					CKEDITOR.instances[i].setData(data);
				}
			}

			return true;
		}
	});

	// dialog changes
    CKEDITOR.on('dialogDefinition', function(ev) {
        var dialogName = ev.data.name;
        var dialogTabs = ev.data.definition;

        // Plugin image ///////////////////////////////////////////////////////
        if (dialogName == 'image') {
            var infoTab = dialogTabs.getContents('info');
            var urlField = infoTab.get('txtUrl');
            urlField['className'] = 'rex-url';

			infoTab.remove('htmlPreview');
			infoTab.remove('medialink');
            infoTab.add({
                type: 'button',
                id: 'medialink',
                label: 'Medienpool Link',
                align: 'center',
                style: 'display:inline-block; position: absolute; right: 23px; top: 116px;',
                onClick: function() {
                     rex_ckeditor_get_link_from_mediapool();
                }
            });
        }//endif

        // Plugin link /////////////////////////////////////////////////////////
        if (dialogName == 'link') {

            // auf das Tab 'info' bezogen
            var infoTab = dialogTabs.getContents('info');
            // Entfernen da nicht kompatibel mit Email Obfuscator
            infoTab.remove('emailSubject');
            infoTab.remove('emailBody');
            var linkType = infoTab.get('linkType');
            linkType[ 'items' ] = [// unwichtig - nur Reihenfolge geändert
                ['URL', 'url'], //###lang
                ['E-Mail', 'email'], //###lang
                ['Anker in diesem Block', 'anchor']//###lang
            ];
            var protocol = infoTab.get('protocol');
            protocol['className'] = 'rex-protocol';
            protocol[ 'items' ] = [
                ['http://\u200E', 'http://'],
                ['https://\u200E', 'https://'],
                ['<andere>', ''] //###lang
            ];
            var url = infoTab.get('url');
            url['className'] = 'rex-url';
            url[ 'onKeyUp' ] = function() {
                this.allowOnChange = false;
                var protocolCmb = this.getDialog().getContentElement('info', 'protocol'),
                        url = this.getValue(),
                        urlOnChangeProtocol = /^(http|https):\/\/(?=.)/i,
                        urlOnChangeTestOther = /^((redaxo|files)|[#\/\.\?])/i;
                var protocol = urlOnChangeProtocol.exec(url);
                if (protocol) {
                    this.setValue(url.substr(protocol[ 0 ].length));
                    protocolCmb.setValue(protocol[ 0 ].toLowerCase());
                } else if (urlOnChangeTestOther.test(url))
                    protocolCmb.setValue('');
                this.allowOnChange = true;
            };
            infoTab.remove('urlOptions');
            infoTab.add({
                type: 'vbox',
                id: 'urlOptions',
                children: [
                    {
                        type: 'hbox',
                        widths: ['25%', '75%'],
                        children: [
                            {
                                id: 'protocol',
                                type: 'select',
                                className: 'rex-protocol',
                                label: 'Protokoll', //###lang
                                'default': 'http://',
                                items: [
                                    // Force 'ltr' for protocol names in BIDI. (#5433)
                                    ['http://\u200E', 'http://'],
                                    ['https://\u200E', 'https://'],
                                    ['<andere>', '']//###lang
                                ],
                                setup: function(data) {
                                    if (data.url)
                                        this.setValue(data.url.protocol || '');
                                },
                                commit: function(data) {
                                    if (!data.url)
                                        data.url = {};

                                    data.url.protocol = this.getValue();
                                }
                            },
                            {
                                type: 'text',
                                id: 'url',
                                label: 'URL', //###lang
                                required: true,
                                className: 'rex-url',
                                onLoad: function() {
                                    this.allowOnChange = true;
                                },
                                onKeyUp: function() {
                                    this.allowOnChange = false;
                                    var protocolCmb = this.getDialog().getContentElement('info', 'protocol'),
                                            url = this.getValue(),
                                            urlOnChangeProtocol = /^(http|https):\/\/(?=.)/i,
                                            urlOnChangeTestOther = /^((redaxo|files)|[#\/\.\?])/i;

                                    var protocol = urlOnChangeProtocol.exec(url);
                                    if (protocol) {
                                        this.setValue(url.substr(protocol[ 0 ].length));
                                        protocolCmb.setValue(protocol[ 0 ].toLowerCase());
                                    } else if (urlOnChangeTestOther.test(url))
                                        protocolCmb.setValue('');

                                    this.allowOnChange = true;
                                },
                                onChange: function() {
                                    if (this.allowOnChange) // Dont't call on dialog load.
                                        this.onKeyUp();
                                },
                                validate: function() {
                                    var dialog = this.getDialog();

                                    if (dialog.getContentElement('info', 'linkType') && dialog.getValueOf('info', 'linkType') != 'url')
                                        return true;

                                    if ((/javascript\:/).test(this.getValue())) {
                                        alert('ungültiger Wert');//###lang
                                        return false;
                                    }

                                    if (this.getDialog().fakeObj) // Edit Anchor.
                                        return true;

                                    var func = CKEDITOR.dialog.validate.notEmpty('URL fehlt');//###lang
                                    return func.apply(this);
                                },
                                setup: function(data) {
                                    this.allowOnChange = false;
                                    if (data.url)
                                        this.setValue(data.url.url);
                                    this.allowOnChange = true;

                                },
                                commit: function(data) {
                                    // IE will not trigger the onChange event if the mouse has been used
                                    // to carry all the operations #4724
                                    this.onChange();

                                    if (!data.url)
                                        data.url = {};

                                    data.url.url = this.getValue();
                                    this.allowOnChange = false;
                                }
                            }
                        ],
                        setup: function(data) {
                            if (!this.getDialog().getContentElement('info', 'linkType'))
                                this.getElement().show();
                        }
                    },
                    {
                        type: 'button',
                        id: 'internallink',
                        label: 'Interner Link',
                        style: 'float : right;',
                        onClick: function() {
                           rex_ckeditor_get_link_from_linkmap();

                        }
                    },
                    {
                        type: 'button',
                        id: 'medialink',
                        label: 'Medienpool Link',
                        style: 'float : right;',
                        onClick: function() {
                             rex_ckeditor_get_link_from_mediapool();
                        }
                    }
                ]
            });
            // auf das Tab 'target' bezogen
            var targetTab = dialogTabs.getContents('target');
            var linkTargetType = targetTab.get('linkTargetType');
            linkTargetType[ 'items' ] = [
                ['normal', 'notSet'],
                ['neues Fenster', '_blank']
            ];
        }//endif
    }); // end dialogDefinition
}); // end document ready


/* ---------------------------------------------------------------------------- */

// mblock compat
// see rex:ready above for more compat code

// quick and dirty, copied from above (rex_ckeditor_init())
function rex_ckeditor_mblock_init(container) {
    // this function assumes this global js vars from profile file: ckDefaultProfileName, ckProfiles, ckSmartStripSettings, ckRexHelpPluginAvailable
    var jTextarea = $(container).find("[class*='ckeditor']");

    if (ckDefaultProfileName !== '') {
        jTextarea.each(function() {
            var $this = $(this);

            var currentEditorConfig;
            var currentProfileName;

            // set config object
            if ($this.attr('data-ckeditor-profile') && $this.attr('data-ckeditor-profile') in ckProfiles) {
                currentProfileName = $this.attr('data-ckeditor-profile');
            } else {
                currentProfileName = ckDefaultProfileName;
            }

            currentEditorConfig = ckProfiles[currentProfileName];

            // add smart strip class
            if (ckSmartStripSettings[currentProfileName] === 1) {
                $this.addClass('ckeditor-smartstrip');
            }

            // overwrite height if necessary
            if (jTextarea.attr('data-ckeditor-height')) {
                currentEditorConfig.height = $this.attr('data-ckeditor-height');
            }

            // make sure rex_help is available otherwise js error       
            if (ckRexHelpPluginAvailable) {
                currentEditorConfig.extraPlugins = currentEditorConfig.extraPlugins + ',rex_help';
            } else {
                currentEditorConfig.extraPlugins = currentEditorConfig.extraPlugins.replace(/rex_help/g,'');
            }

            // finally replace textareas
            CKEDITOR.replace(this, currentEditorConfig);
        });
    }
}

// rex:change = mblock event for move up/down
$(document).on('rex:change', function (event, container) {
	// update textareas before destroying editors
	for (var i in CKEDITOR.instances) {
		CKEDITOR.instances[i].updateElement();
	}

    rex_ckeditor_destroy_all();

	rex_ckeditor_mblock_init('.mblock_wrapper');
});

