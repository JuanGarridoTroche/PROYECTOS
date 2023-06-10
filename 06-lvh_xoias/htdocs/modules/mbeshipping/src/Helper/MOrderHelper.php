<?php
/**
 * 2017-2022 PrestaShop
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to http://www.prestashop.com for more information.
 *
 * @author    MBE Worldwide
 * @copyright 2017-2023 MBE Worldwide
 * @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 * International Registered Trademark & Property of MBE Worldwide
 */

namespace PrestaShop\Module\Mbeshipping\Helper;

class MOrderHelper
{
    protected $_morder_table_name = 'mbe_shipping_order';

    public function installMOrderTable()
    {
        $sql = "CREATE TABLE IF NOT EXISTS `" . _DB_PREFIX_ . bqSQL($this->_morder_table_name) . "`(
                `id_mbeshipping_order` int(10) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
                `id_order` int(10) default 0 not null,
                `is_download_available` int(10) default 1 not null,
                UNIQUE KEY MBE_ORDER_MO_UNIQUE (id_order))";
        $result = \Db::getInstance()->execute($sql);
        return $result;
    }

    public function uninstallMOrderTable()
    {
        $sql = "DROP TABLE IF EXISTS `" . _DB_PREFIX_ . bqSQL($this->_morder_table_name) . "`";
        $result = \Db::getInstance()->execute($sql);
        return $result;
    }

    public function getDownloadAvailableByOrderId($id_order)
    {
        $main_table = _DB_PREFIX_ . bqSQL($this->_morder_table_name);

        $sql = "
        SELECT `is_download_available`
        FROM " . $main_table . "
        WHERE `id_order` = ".(int)$id_order;

        return \Db::getInstance()->getValue($sql);
    }

    public function insertOrder($id_order, $is_download_available)
    {
        if(!isset($id_order) || !isset($is_download_available)) {
            return false;
        }

        $sql = "INSERT INTO `" . _DB_PREFIX_ . bqSQL($this->_morder_table_name) . "` (`id_order`, `is_download_available`)
        VALUES (".(int)$id_order.", ".(int)$is_download_available.")";

        return \Db::getInstance()->execute($sql);
    }
}
