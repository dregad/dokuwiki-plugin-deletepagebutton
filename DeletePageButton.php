<?php
/**
 * Delete Page Button plugin
 *
 * @copyright (c) 2020 Damien Regad
 * @license GPLv2 or later (https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
 * @author  Damien Regad
 */

namespace dokuwiki\plugin\deletepagebutton;
use dokuwiki\Menu\Item\AbstractItem;

/**
 * Class DeletePageButton
 *
 * Implements the plugin's Delete button for DokuWiki's menu system
 *
 * @package dokuwiki\plugin\deletepagebutton
 */
class DeletePageButton extends AbstractItem {

    /** @var string icon file */
    protected $svg = __DIR__ . '/images/trash-can-outline.svg';

    /** @inheritdoc */
    public function __construct() {
        parent::__construct();
        $this->params['sectok'] = getSecurityToken();
    }

    /**
     * Get label from plugin language file
     *
     * @return string
     */
    public function getLabel() {
        $plugin = plugin_load('action', $this->type);
        return $plugin->getLang('menu_item');
    }

}
