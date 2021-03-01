/**
 * Delete Page Button plugin scripts
 *
 * @copyright (c) 2020 Damien Regad
 * @license GPLv2 or later (https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
 * @author  Damien Regad
 */
jQuery(function() {
    // Get current template name, see action_plugin_deletepagebutton::addJsInfo()
    // noinspection JSUnresolvedVariable
    let template = JSINFO.deletepagebutton_template;

    // jQuery selector for the Delete Page button
    let selector;
    switch (template) {
        case 'bootstrap3':
            selector = 'li.action a.deletepagebutton';
            break;
        // Default selector (from DokuWiki default template)
        case 'dokuwiki':
        default:
            selector = '.deletepagebutton a';
    }

    let $button = jQuery(selector);
    if ($button.length === 0) {
        const urlGitHubNewIssue =
            'https://github.com/dregad/dokuwiki-plugin-deletepagebutton/issues/new'
            + "?labels=bug"
            + "&title=Confirmation+dialog+not+working+with+" + template + "+template"
            + "&body=Please+provide+sample+HTML+for+the+*Delete+Page*+button";
        console.warn(
            "DokuWiki DeletePageButton plugin: Template '" + template + "' "
            + "is not fully supported (the Confirmation dialog will not work). "
            + "Please report the problem by clicking the following URL "
            + urlGitHubNewIssue
        );
        return;
    }

    $button.on('click', function(e) {
        e.preventDefault();
        let submit_url = this.href;
        let $dialog = jQuery(
            '<div><span>'
            + LANG.plugins.deletepagebutton.confirm
            + '</span></div>'
        );
        $dialog.dialog({
            title: LANG.plugins.deletepagebutton.title,
            resizable: true,
            width: "auto",
            height: "auto",
            modal: true,
            buttons: [
                {
                    text: LANG.plugins.deletepagebutton.btn_ok,
                    click: function () {
                        $dialog.dialog("close");
                        console.log(submit_url);
                        window.location.href = submit_url
                    }
                },
                {
                    text: LANG.plugins.deletepagebutton.btn_cancel,
                    click: function () {
                        $dialog.dialog("close");
                    }
                }
            ],
            close: function () {
                // remove the dialog's HTML
                jQuery(this).remove();
                // Due to the preventDefault() call, the "Delete page" span
                // remains active when the dialog is closed, so we need to
                // manually remove focus from it.
                document.activeElement.blur();
            }
        });
    });
});
