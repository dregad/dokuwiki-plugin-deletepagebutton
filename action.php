<?php
/**
 * Delete Page Button plugin
 *
 * @copyright (c) 2020 Damien Regad
 * @license GPLv2 or later (https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
 * @author  Damien Regad
 */

// must be run within Dokuwiki
if(!defined('DOKU_INC')) die();

use dokuwiki\plugin\deletepagebutton\DeletePageButton;

/**
 * Class action_plugin_deletepagebutton
 *
 * @package dokuwiki\plugin\deletepagebutton
 */
class action_plugin_deletepagebutton extends DokuWiki_Action_Plugin {

    /**
     * Register event handlers.
     *
     * @param Doku_Event_Handler $controller The plugin controller
     */
    public function register(Doku_Event_Handler $controller) {
        $controller->register_hook('DOKUWIKI_STARTED', 'AFTER', $this, 'addJsInfo' );
        $controller->register_hook('MENU_ITEMS_ASSEMBLY', 'AFTER', $this, 'addButton' );
        $controller->register_hook('ACTION_ACT_PREPROCESS', 'BEFORE', $this, 'deletePage' );
    }

    /**
     * Hook for DOKUWIKI_STARTED event.
     *
     * Adds current template to $JSINFO
     */
    public function addJsInfo() {
        global $JSINFO, $conf;
        $JSINFO['deletepagebutton_template'] = $conf['template'];
    }

    /**
     * Hook for MENU_ITEMS_ASSEMBLY event.
     *
     * Adds 'Delete' button to DokuWiki's PageMenu.
     *
     * @param Doku_Event $event
     */
    public function addButton(Doku_Event $event) {
        global $ID;

        if (
            $event->data['view'] !== 'page'
            || !$this->canDelete($ID)
        ) {
            return;
        }

        array_splice($event->data['items'], -1, 0, array(new DeletePageButton()));
    }

    /**
     * Determines whether the Delete button should be shown.
     *
     * @param $id
     * @return bool
     */
    protected function canDelete($id) {
        global $ACT;

        return ($ACT == 'show' || empty($ACT))
            && page_exists($id)
            && auth_quickaclcheck($id) >= AUTH_EDIT
            && checklock($id) === false && !@file_exists(wikiLockFN($id));
    }

    /**
     * Hook for ACTION_ACT_PREPROCESS event.
     *
     * Handles the plugin's custom page deletion action: deletes the page and
     * redirects to page view ('show' action).
     *
     * @param Doku_Event $event
     */
    public function deletePage(Doku_Event $event) {
        global $ID, $INFO, $lang;

        // Ignore other actions
        if ($event->data != 'deletepagebutton') {
            return;
        };

        if(checkSecurityToken() && $INFO['exists']) {
            // Save the page with empty contents to delete it
            saveWikiText($ID, null, $lang['deleted']);

            // Display confirmation message
            msg($this->getLang('deleted_ok'), 1);
        }

        // Redirect to page view
        $event->data = 'redirect';
    }

}
