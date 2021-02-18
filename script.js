/**
 * Delete Page Button plugin scripts
 *
 * @copyright (c) 2020 Damien Regad
 * @license GPLv2 or later (https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
 * @author  Damien Regad
 */
jQuery(function() {
    // Get current template name from DOKU_TPL which contains its path
    let template = DOKU_TPL.replace(/[\\/]$/, "").split(/[\\/]/).pop();

    // jQuery selector for the Delete Page button
    let selector;
    switch (template) {
        // Default selector (from DokuWiki default template)
        case 'dokuwiki':
        default:
            selector = '.deletepagebutton a';
    }

    let $button = jQuery(selector);

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
