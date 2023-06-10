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

use PrestaShop\Module\Mbeshipping\Helper;
use PrestaShop\Module\Mbeshipping\Helper\CsvHelper;
use PrestaShop\Module\Mbeshipping\Helper\DataHelper;
use PrestaShop\Module\Mbeshipping\Helper\LoggerHelper;
use PrestaShop\Module\Mbeshipping\Helper\MdpHelper;
use PrestaShop\Module\Mbeshipping\Helper\OrderHelper;
use PrestaShop\Module\Mbeshipping\Helper\PackageHelper;
use PrestaShop\Module\Mbeshipping\Helper\PackageProductHelper;
use PrestaShop\Module\Mbeshipping\Helper\RatesHelper;
use PrestaShop\Module\Mbeshipping\Helper\UpsUapHelper;
use PrestaShop\Module\Mbeshipping\Helper\MOrderHelper;
use PrestaShop\Module\Mbeshipping\Ws;

if (!defined('_PS_VERSION_')) {
    exit();
}

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/classes/AuthAPI.php';

class Mbeshipping extends CarrierModule
{
    const PREFIX = _DB_PREFIX_;
    public $carriers = array(); // not change
    public $id_carrier = null;
    protected $module_name = 'mbeshipping';
    protected $upload_dir = _PS_MODULE_DIR_ . 'mbeshipping' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;
    protected $module_url = __PS_BASE_URI__ . 'modules/mbeshipping/';
    protected $logger = null;
    private $pricesMbeLoaded = false;
    private $conf_tabs = null;
    private $last_active_tab;

    private $numeric_fields = [
        'default_width',
        'default_height',
        'default_length',
        'max_package_weight',
        'max_shipment_weight',
        'handling_fee',
        'handling_fee_rounding_amount',
        'handling_fee_rounding',
        'mbe_shipments_csv_insurance_per',
        'mbe_shipments_csv_insurance_min'
    ];

    private $numeric_field_labels;

    public function __construct()
    {
        $this->initializeLogger();

        $this->name = 'mbeshipping';
        $this->module_key = 'e127bd423c8ec24900475202bb4a131a';
        $this->tab = 'shipping_logistics';
        $this->version = '2.0.5';
        $this->author = 'MBE Worldwide S.p.A.';

        $this->bootstrap = true;

        $this->ps_versions_compliancy['min'] = '1.6';

        parent::__construct();

        $this->displayName = $this->l('MBE eShip Plugin');
        $this->description = $this->l(
            'MBE eShip automatically creates the shipments for the products sold through your e-commerce. It also offers the possibility to create shipping labels, avoiding the need to use different platform to download and print them. All the shipments’ data will be accompanied by a tracking number.'
        );

        if (!file_exists($this->upload_dir)) {
            mkdir($this->upload_dir, 0777, true);  //create directory if not exist
        }
    }

    ###########################################################################
    ## Installation
    ###########################################################################

    public function initializeLogger()
    {
        if (!class_exists('LoggerHelper')) {
            require_once _PS_MODULE_DIR_ . 'mbeshipping' . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . 'Helper'. DIRECTORY_SEPARATOR .'LoggerHelper.php';
        }
        $this->logger = new LoggerHelper();
    }

    public function initNumericFieldLabels()
    {
        $this->numeric_field_labels = [
            'default_width' => $this->l('Standard package width'),
            'default_height' => $this->l('Standard package height'),
            'default_length' => $this->l('Standard package length'),
            'max_package_weight' => $this->l('Maximum package weight'),
            'max_shipment_weight' => $this->l('Maximum shipping weight'),
            'handling_fee' => $this->l('Amount'),
            'handling_fee_rounding_amount' => $this->l('Rounding amount (in €)'),
            'handling_fee_rounding' => $this->l('Rounding application'),
            'mbe_shipments_csv_insurance_per' => $this->l('Custom Shipping Prices (CSV) - Percentage for insurance price calculation'),
            'mbe_shipments_csv_insurance_min' => $this->l('Custom Shipping Prices (CSV) - Minimum price for insurance')
        ];

        foreach ($this->renderFreeShippingThresholdsAndServicesDescriptions() as $input) {
            if (substr($input['name'], 0, 9) === 'mbelimit_') {
                $this->numeric_field_labels[$input['name']] = $input['label'];
            }
        }
    }

    public function install()
    {
        if (!parent::install() || !$this->installTab() || !$this->installOverride()
            || !$this->installHook() || !$this->installRatesTable() || !$this->installCsvPackageTable()
            || !$this->installCsvPackageProductTable() || !$this->installMdpTable()
            || !$this->installMOrderTable()) {
            return false;
        }

        if (file_exists(_PS_ROOT_DIR_ . '/cache/class_index.php')) {
            unlink(_PS_ROOT_DIR_ . '/cache/class_index.php');
        }

        $this->presetValues();

        $this->fixCarrierOverride();

        return true;
    }

    private function fixCarrierOverride()
    {
        $find = "require_once(_PS_MODULE_DIR_ . 'mbeshipping' . DIRECTORY_SEPARATOR . 'classes' . DIRECTORY_SEPARATOR . 'custom' . DIRECTORY_SEPARATOR . 'Ws.php');";
        $replace = "\nuse PrestaShop\Module\Mbeshipping\Lib\MbeWs;\nuse PrestaShop\Module\Mbeshipping\Helper\DataHelper;\nuse PrestaShop\Module\Mbeshipping\Helper\RatesHelper;\n";

        $file = _PS_OVERRIDE_DIR_ . '/classes/Carrier.php';
        if (!file_exists($file)) {
            return;
        }

        $file_content = Tools::file_get_contents($file);
        if (strpos($file_content, $find) === false) {
            return;
        }

        file_put_contents($file, str_replace($find, $replace, $file_content));
    }

    public function installTab()
    {
        // AdminMbeShipping
        $tab = new Tab();
        $tab->active = 1;
        $tab->class_name = 'AdminMbeShipping';
        $tab->name = [];
        foreach (Language::getLanguages(true) as $lang) {
            $tab->name[$lang['id_lang']] = $this->l('MBE shipments list');
        }
        if (_PS_VERSION_ >= 1.5) {
            $tab->id_parent = (int)Tab::getIdFromClassName('AdminParentShipping');
        } else {
            $tab->id_parent = (int)Tab::getIdFromClassName('AdminShipping');
        }
        $tab->module = $this->name;

        // AdminMbePackageHelperController
        $tab2 = new Tab();
        $tab2->active = 1;
        $tab2->class_name = 'AdminMbePackageHelper';
        $tab2->name = [];
        foreach (Language::getLanguages(true) as $lang) {
            $tab2->name[$lang['id_lang']] = $this->l('Manage packages');
        }
        $tab2->id_parent = -1;
        $tab2->module = $this->name;

        // AdminMbePackageProductHelperController
        $tab3 = new Tab();
        $tab3->active = 1;
        $tab3->class_name = 'AdminMbePackageProductHelper';
        $tab3->name = [];
        foreach (Language::getLanguages(true) as $lang) {
            $tab3->name[$lang['id_lang']] = $this->l('Manage product packages');
        }
        $tab3->id_parent = -1;
        $tab3->module = $this->name;

        // AdminMbeChecklistController
        $tab4 = new Tab();
        $tab4->active = 1;
        $tab4->class_name = 'AdminMbeChecklist';
        $tab4->name = [];
        foreach (Language::getLanguages(true) as $lang) {
            $tab4->name[$lang['id_lang']] = $this->l('Check module functionality');
        }
        $tab4->id_parent = -1;
        $tab4->module = $this->name;

        return $tab->add() && $tab2->add() && $tab3->add() && $tab4->add();
    }

    public function installOverride()
    {
        return true;
    }

    public function installHook()
    {
        if (!$this->registerHook('actionOrderStatusPostUpdate')) {
            return false;
        }

        /*ACCESS POINT*/
        if (version_compare(_PS_VERSION_, '1.7', '<')) {
            if (!$this->registerHook('extraCarrier')) {
                return false;
            }
        } else {
            if (!$this->registerHook('displayCarrierExtraContent')) {
                return false;
            }
        }

        if (!$this->registerHook('actionValidateOrder')) {
            return false;
        }

        if (!$this->registerHook('actionDispatcher')) {
            return false;
        }
        /**/

        return true;
    }

    public function installRatesTable()
    {
        $helper = new RatesHelper();
        return $helper->installRatesTable();
    }

    public function installCsvPackageTable()
    {
        $helper = new PackageHelper();
        return $helper->installCsvPackageTable();
    }

    public function installCsvPackageProductTable()
    {
        $helper = new PackageProductHelper();
        return $helper->installCsvPackageProductTable();
    }

    public function installMdpTable()
    {
        $helper = new MdpHelper();
        return $helper->installMdpTable();
    }

    public function installMOrderTable()
    {
        $helper = new MOrderHelper();
        return $helper->installMOrderTable();
    }

    public function presetValues()
    {
        Configuration::updateValue('MBESHIPPING_INITIAL_CONF', 1);
        Configuration::updateValue('default_width', 10);
        Configuration::updateValue('default_height', 10);
        Configuration::updateValue('default_length', 10);
        Configuration::updateValue('max_package_weight', 0.5);
        Configuration::updateValue('max_shipment_weight', 0.5);
    }

    ################################################################################
    ## Uninstallation
    #################################################################################

    public function uninstall()
    {
        if (!parent::uninstall() || !$this->uninstallTab() || !$this->deleteCarriers()
            || !$this->uninstallRatesTable() || !$this->uninstallCsvPackageTable()
            || !$this->uninstallCsvPackageProductTable() || !$this->uninstallMdpTable()
            || !$this->uninstallMOrderTable()) {
            return false;
        }
        $this->uninstallOverride();

        /*ACCESS POINT*/
        if (version_compare(_PS_VERSION_, '1.7', '<')) {
            if (!$this->unregisterHook('extraCarrier')) {
                return false;
            }
        } else {

            if (!$this->unregisterHook('displayCarrierExtraContent')) {
                return false;
            }
        }
        /**/

        $this->clearConfigs();

        return true;
    }

    public function uninstallTab()
    {
        $result = true;

        $id_tab = (int)Tab::getIdFromClassName('AdminMbeShipping');
        if ($id_tab) {
            $tab = new Tab($id_tab);
            $result &= $tab->delete();
        }

        $id_tab2 = (int)Tab::getIdFromClassName('AdminMbePackageHelper');
        if ($id_tab2) {
            $tab2 = new Tab($id_tab2);
            $result &= $tab2->delete();
        }

        $id_tab3  = (int)Tab::getIdFromClassName('AdminMbePackageProductHelper');
        if ($id_tab3) {
            $tab3 = new Tab($id_tab3);
            $result &= $tab3->delete();
        }

        $id_tab4  = (int)Tab::getIdFromClassName('AdminMbeChecklist');
        if ($id_tab4) {
            $tab4 = new Tab($id_tab4);
            $result &= $tab4->delete();
        }

        return $result;
    }

    protected function deleteCarriers()
    {
        $result = true;
        $results = Db::getInstance()->executeS('SELECT id_carrier FROM `' . _DB_PREFIX_ .
            'carrier` where external_module_name = "' . pSQL($this->module_name) . '"');
        $idCarriers = array();
        foreach ($results as $r) {
            $idCarriers[] = $r['id_carrier'];
        }
        if (!empty($idCarriers)) {
            $result &= Db::getInstance()->execute('DELETE FROM `' . _DB_PREFIX_ .
                'carrier` where id_carrier IN (' . pSQL(implode(',', array_map('intval', $idCarriers))) . ')');
            $result &= Db::getInstance()->execute('DELETE FROM `' . _DB_PREFIX_ .
                'carrier_zone` where id_carrier IN (' . pSQL(implode(',', array_map('intval', $idCarriers))) . ')');
            $result &= Db::getInstance()->execute('DELETE FROM `' . _DB_PREFIX_ .
                'delivery` where id_carrier IN (' . pSQL(implode(',', array_map('intval', $idCarriers))) . ')');
            $result &= Db::getInstance()->execute('DELETE FROM `' . _DB_PREFIX_ .
                'range_price` where id_carrier IN (' . pSQL(implode(',', array_map('intval', $idCarriers))) . ')');
            $result &= Db::getInstance()->execute('DELETE FROM `' . _DB_PREFIX_ .
                'range_weight` where id_carrier IN (' . pSQL(implode(',', array_map('intval', $idCarriers))) . ')');
        }
        return $result;
    }

    public function uninstallRatesTable()
    {
        $helper = new RatesHelper();
        return $helper->uninstallRatesTable();
    }

    public function uninstallCsvPackageTable()
    {
        $helper = new PackageHelper();
        return $helper->uninstallCsvPackageTable();
    }

    public function uninstallCsvPackageProductTable()
    {
        $helper = new PackageProductHelper();
        return $helper->uninstallCsvPackageProductTable();
    }

    public function uninstallMdpTable()
    {
        $helper = new MdpHelper();
        return $helper->uninstallMdpTable();
    }

    public function uninstallMOrderTable()
    {
        $helper = new MOrderHelper();
        return $helper->uninstallMOrderTable();
    }

    public function uninstallOverride()
    {
        $result = true;
        if (file_exists(_PS_ROOT_DIR_ . '/cache/class_index.php')) {
            unlink(_PS_ROOT_DIR_ . '/cache/class_index.php');
        }
        return $result;
    }

    private function clearConfigs()
    {
        $this->clearAuth();
        Configuration::deleteByName('MBESHIPPING_INITIAL_CONF');
    }

    ###########################################################################
    ## Plugin configuration
    ###########################################################################

    public function clearAuth()
    {
        Configuration::deleteByName('MBECustomer');
        Configuration::deleteByName('username');
        Configuration::deleteByName('password');
        Configuration::deleteByName('url');
        Configuration::deleteByName('mbecountry');
    }

    public function getContent()
    {
        $this->initNumericFieldLabels();

        $result = $this->postProcess();

        // + Check auth credentials
        $ws = new Ws();
        $customer = $ws->getCustomer(true);

        $output = '';
        if (empty($customer)) {
            $output .= $this->displayError($this->l('The credentials entered are incorrect'));
        }

        Configuration::updateValue('MBECustomer', json_encode($customer));
        // - Check auth credentials

        $this->updateJsDefs();

        return $output.$this->displayConfiguration($result . $this->checkConfiguration());
    }

    public function postProcess()
    {
        // download logs
        if (Tools::getIsset('downloadlogs') && Tools::getValue('downloadlogs') === "1") {
            $this->last_active_tab = 'debug_settings';

            $this->downloadLogs();
        }

        // delete logs
        if (Tools::getIsset('deletelogs') && Tools::getValue('deletelogs') === "1") {
            $this->last_active_tab = 'debug_settings';

            $this->clearLogs();
            return $this->displayConfirmation($this->l('Debug logs have been cleared.'));
        }

        // tab1 - login
        if (Tools::isSubmit('mbeLogin')) {
            return $this->processAuth();
        }

        // tab1 - advanced login
        if (Tools::isSubmit('mbeAdvAuth')) {
            Configuration::updateValue('MBESHIPPING_ADVANCED_AUTH_CONF', 1);
        }

        // tab1 - auth reset
        if (Tools::isSubmit('mbeAuthReset')) {
            Configuration::updateValue('MBESHIPPING_ADVANCED_AUTH_CONF', 0);
            $this->clearAuth();
            return $this->displayWarning($this->l('Authentication has been cleared'));
        }

        // tab1 - save adv auth settings
        if (Tools::isSubmit('submitAdvAuth')) {
            return $this->processAdvancedAuth();
        }

        // tab1 settings
        if (Tools::isSubmit('submitTab1')) {
            Configuration::updateValue('mbe_active', Tools::getValue('mbe_active'));
            return $this->displayConfirmation($this->l('Configuration updated successfully'));
        }

        // tab2 - change conf mode
        if (Tools::isSubmit('mbeChangeConfigMode')) {
            $this->last_active_tab = 'couriers_services_settings';

            $this->clearConfigsTab2();
            $configMode = (int)Tools::getValue('mbe_couriers_services_mode');
            if (Configuration::updateValue('MBESHIPPING_COURIERS_SERVICES_CONF_MODE', $configMode)) {
                switch ($configMode) {
                    case 1:
                        Configuration::updateValue('shipments_csv_mode', DataHelper::MBE_CSV_MODE_TOTAL);
                        Configuration::updateValue('mbe_enable_custom_mapping', 0);
                        break;
                    case 2:
                        Configuration::updateValue('shipments_csv_mode', DataHelper::MBE_CSV_MODE_DISABLED);
                        Configuration::updateValue('mbe_enable_custom_mapping', 1);
                        break;
                    case 3:
                        Configuration::updateValue('shipments_csv_mode', DataHelper::MBE_CSV_MODE_DISABLED);
                        Configuration::updateValue('mbe_enable_custom_mapping', 0);
                        break;
                }
            }
        }

        // tab2 - option 1
        if (Tools::isSubmit('submitConf1Tab2')) {
            $this->last_active_tab = 'couriers_services_settings';

            $output = null;

            // allowed shipment services
            $mbe_allowed_shipment_services = Tools::getValue('mbe_allowed_shipment_services_1');
            Configuration::updateValue('allowed_shipment_services', implode('-', $mbe_allowed_shipment_services));

            // shipments csv upload
            if ($_FILES['shipments_csv'] && $_FILES['shipments_csv']['name'] && $_FILES['shipments_csv']['tmp_name']) {
                $path = $_FILES['shipments_csv']['name'];
                $ext = pathinfo($path, PATHINFO_EXTENSION);
                if ($ext == "csv") {
                    $nowDate = new DateTime();
                    $fileName = $nowDate->format('Y-m-d_H-i-s') . '_' . 'mbe_csv.csv';
                    $filePath = $this->upload_dir . $fileName;

                    if (!file_exists($this->upload_dir)) {
                        if (!mkdir($this->upload_dir, 0777, true)) {
                            $output .= $this->displayError($this->l('The "upload" folder is not created'));
                        }
                    }

                    move_uploaded_file($_FILES['shipments_csv']['tmp_name'], $filePath);

                    // VALIDATE AND INSERT FILE
                    $this->validateCsvFileAndInsert($filePath, $output);

                    //save configuration containing the file uploaded and saved into database
                    Configuration::updateValue("shipments_csv", $fileName);

                } else {
                    $output .= $this->displayError($this->l('File upload error: only CSV format is allowed'));
                }
            }

            // csv mode
            $mbe_shipments_csv_mode = Tools::getValue('shipments_csv_mode');
            Configuration::updateValue('shipments_csv_mode', $mbe_shipments_csv_mode);

            // insurance minimum price
            $mbe_shipments_csv_insurance_min = Tools::getValue('mbe_shipments_csv_insurance_min');
            if (!is_numeric($mbe_shipments_csv_insurance_min)) {
                $output .= $this->displayError($this->numeric_field_labels['mbe_shipments_csv_insurance_min'] . ': ' . $this->l('please enter only numbers 0-9'));
            } else {
                Configuration::updateValue('mbe_shipments_csv_insurance_min', $mbe_shipments_csv_insurance_min);
            }

            // insurance percentage
            $mbe_shipments_csv_insurance_per = Tools::getValue('mbe_shipments_csv_insurance_per');
            if (!is_numeric($mbe_shipments_csv_insurance_per)) {
                $output .= $this->displayError($this->numeric_field_labels['mbe_shipments_csv_insurance_per'] . ': ' . $this->l('please enter only numbers 0-9'));
            } else {
                Configuration::updateValue('mbe_shipments_csv_insurance_per', $mbe_shipments_csv_insurance_per);
            }

            // insurance mode
            $mbe_shipments_ins_mode = Tools::getValue('mbe_shipments_ins_mode');
            Configuration::updateValue('mbe_shipments_ins_mode', $mbe_shipments_ins_mode);

            if (empty($output)) {
                $output .= $this->displayConfirmation($this->l('Settings updated'));
            }

            return $output;
        }

        // tab2 - option 2
        if (Tools::isSubmit('submitConf2Tab2')) {
            $this->last_active_tab = 'couriers_services_settings';

            $output = null;

            $mbe_allowed_shipment_services = Tools::getValue('mbe_allowed_shipment_services_2');
            Configuration::updateValue('allowed_shipment_services', implode('-', $mbe_allowed_shipment_services));

            foreach ($this->getCarrierIds() as $id_carrier) {
                Configuration::updateValue('mbe_custom_mapping_' . $id_carrier, Tools::getValue('mbe_custom_mapping_' . $id_carrier));
            }

            if (empty($output)) {
                $output .= $this->displayConfirmation($this->l('Settings updated'));
            }

            return $output;
        }

        // tab2 - option 3
        if (Tools::isSubmit('submitConf3Tab2')) {
            $this->last_active_tab = 'couriers_services_settings';

            $output = null;

            $mbe_allowed_shipment_services = Tools::getValue('mbe_allowed_shipment_services_3');
            $allowed_shipment_services = is_array($mbe_allowed_shipment_services) ? implode('-', $mbe_allowed_shipment_services) : '';
            Configuration::updateValue('allowed_shipment_services', $allowed_shipment_services);

            foreach ((new Ws)->getAllowedShipmentServices() as $service) {
                $id_service = Tools::strtolower(str_replace('+', 'p', $service['value']));
                Configuration::updateValue('mbe_custom_label_' . $id_service, Tools::getValue('mbe_custom_label_' . $id_service));
                Configuration::updateValue('mbe_tax_rule_' . $id_service, (int)Tools::getValue('mbe_tax_rule_' . $id_service));
                $this->updateCarrierTaxRulesGroup(Tools::getValue('mbe_custom_label_' . $id_service), (int)Tools::getValue('mbe_tax_rule_' . $id_service));
            }

            if (empty($output)) {
                $output .= $this->displayConfirmation($this->l('Settings updated'));
            }

            return $output;
        }

        // tab3 - Standard packages
        if (Tools::isSubmit('submitForm1Tab3')) {
            $this->last_active_tab = 'packages_settings';

            $output = '';

            foreach ($this->getForm1Tab3()['form']['input'] as $input) {
                $val = Tools::getValue($input['name']);
                if (in_array($input['name'], $this->numeric_fields) && !is_numeric($val)) {
                    $output .= $this->displayError($this->numeric_field_labels[$input['name']] . ': ' . $this->l(' please enter only numbers 0-9'));
                } else {
                    Configuration::updateValue($input['name'], $val);
                }
            }

            if ((int)Configuration::get('mbe_shipping_use_packages_csv')) {
                Configuration::updateValue('shipment_configuration_mode', 2);
            }

            if (empty($output)) {
                $output .= $this->displayConfirmation($this->l('Settings updated'));
            }

            return $output;
        }

        // tab3 - Standard packages CSV
        if (Tools::isSubmit('submitForm2Tab3')) {
            $this->last_active_tab = 'packages_settings';

            $output = '';

            Configuration::updateValue('mbe_shipping_use_packages_csv', Tools::getValue('mbe_shipping_use_packages_csv'));

            if (array_key_exists('mbe_shipping_packages_csv', $_FILES) && $_FILES['mbe_shipping_packages_csv'] &&
                $_FILES['mbe_shipping_packages_csv']['name'] && $_FILES['mbe_shipping_packages_csv']['tmp_name']) {
                $path = $_FILES['mbe_shipping_packages_csv']['name'];
                $ext = pathinfo($path, PATHINFO_EXTENSION);
                if ($ext == "csv") {
                    $fileName = date('Y-m-d_H-i-s') . '_' . 'mbe_shipping_packages_csv.csv';
                    $filePath = $this->upload_dir . $fileName;

                    if (!file_exists($this->upload_dir)) {
                        if (!mkdir($this->upload_dir, 0777, true)) {
                            $output .= $this->displayError($this->l('The "upload" folder is not created'));
                        }
                    }

                    move_uploaded_file($_FILES['mbe_shipping_packages_csv']['tmp_name'], $filePath);

                    // VALIDATE AND INSERT FILE
                    $this->validateCsvPackageFileAndInsert($filePath, $output);

                    //save configuration containing the file uploaded and saved into database
                    Configuration::updateValue("mbe_shipping_packages_csv", $fileName);

                } else {
                    $output .= $this->displayError($this->l('File upload error: only CSV format is allowed'));
                }
            }

            if (array_key_exists('mbe_shipping_packages_product_csv', $_FILES) &&
                $_FILES['mbe_shipping_packages_product_csv'] && $_FILES['mbe_shipping_packages_product_csv']['name'] &&
                $_FILES['mbe_shipping_packages_product_csv']['tmp_name']) {
                $path = $_FILES['mbe_shipping_packages_product_csv']['name'];
                $ext = pathinfo($path, PATHINFO_EXTENSION);
                if ($ext == "csv") {
                    $fileName = date('Y-m-d_H-i-s') . '_' . 'mbe_shipping_packages_product_csv.csv';
                    $filePath = $this->upload_dir . $fileName;

                    if (!file_exists($this->upload_dir)) {
                        if (!mkdir($this->upload_dir, 0777, true)) {
                            $output .= $this->displayError($this->l('The "upload" folder is not created'));
                        }
                    }

                    move_uploaded_file($_FILES['mbe_shipping_packages_product_csv']['tmp_name'], $filePath);

                    // VALIDATE AND INSERT FILE
                    $this->validateCsvPackageProductFileAndInsert($filePath, $output);

                    //save configuration containing the file uploaded and saved into database
                    Configuration::updateValue("mbe_shipping_packages_product_csv", $fileName);

                } else {
                    $output .= $this->displayError($this->l('File upload error: only CSV format is allowed'));
                }
            }

            if (empty($output)) {
                $output .= $this->displayConfirmation($this->l('Settings updated'));
            }

            return $output;
        }

        // tab4 - Shipping
        if (Tools::isSubmit('submitTab4')) {
            $this->last_active_tab = 'shipping_settings';

            $output = '';

            foreach ($this->getFormTab4()['form']['input'] as $input) {
                if (in_array($input['name'], $this->numeric_fields)) {
                    $val = Tools::getValue($input['name']);
                    if (!is_numeric($val)) {
                        $output .= $this->displayError($this->numeric_field_labels[$input['name']] . ': ' . $this->l(' please enter only numbers 0-9'));
                    } else {
                        Configuration::updateValue($input['name'], Tools::getValue($input['name']));
                    }
                } else {
                    if ($input['name'] === 'specificcountry[]') {
                        $specificcountry = Tools::getValue('specificcountry', '');
                        $specificcountry = is_array($specificcountry) ? implode('-', $specificcountry) : '';
                        Configuration::updateValue('specificcountry', $specificcountry);
                    } else {
                        Configuration::updateValue($input['name'], Tools::getValue($input['name']));
                    }
                }
            }

            if (empty($output)) {
                $output .= $this->displayConfirmation($this->l('Settings updated'));
            }

            return $output;
        }

        // tab5 - Recharge settings
        if (Tools::isSubmit('submitForm1Tab5')) {
            $this->last_active_tab = 'recharge_settings';

            $output = '';

            foreach ($this->getForm1Tab5()['form']['input'] as $input) {
                if (in_array($input['name'], $this->numeric_fields)) {
                    $val = Tools::getValue($input['name']);
                    if (!is_numeric($val)) {
                        $output .= $this->displayError($this->numeric_field_labels[$input['name']] . ': ' . $this->l(' please enter only numbers 0-9'));
                    } else {
                        Configuration::updateValue($input['name'], Tools::getValue($input['name']));
                    }
                } else {
                    Configuration::updateValue($input['name'], Tools::getValue($input['name']));
                }
            }

            if (empty($output)) {
                $output .= $this->displayConfirmation($this->l('Settings updated'));
            }

            return $output;
        }

        // tab5 - MBE Shipments
        if (Tools::isSubmit('submitForm2Tab5')) {
            $this->last_active_tab = 'recharge_settings';

            $output = '';

            foreach ($this->getForm2Tab5()['form']['input'] as $input) {
                if (substr($input['name'], 0, 9) === 'mbelimit_') {
                    $val = Tools::getValue($input['name']);
                    if (!empty($val) && !is_numeric($val)) {
                        $output .= $this->displayError($this->numeric_field_labels[$input['name']] . ': ' . $this->l(' please enter only numbers 0-9'));
                    } else {
                        Configuration::updateValue($input['name'], Tools::getValue($input['name']));
                    }
                } else {
                    Configuration::updateValue($input['name'], Tools::getValue($input['name']));
                }
            }

            if (empty($output)) {
                $output .= $this->displayConfirmation($this->l('Settings updated'));
            }

            return $output;
        }

        // tab6 - Debug
        if (Tools::isSubmit('submitTab6')) {
            $this->last_active_tab = 'debug_settings';

            Configuration::updateValue('mbe_debug', Tools::getValue('mbe_debug'));
            return $this->displayConfirmation($this->l('Settings updated'));
        }

        return '';
    }

    private function downloadLogs()
    {
        $logs_path = $this->local_path . 'log/';
        $path = $logs_path . 'compressed.zip';
        if (file_exists($path)) {
            unlink($path);
        }
        $values = array();
        $files = glob($logs_path . '/*');
        foreach ($files as $f) {
            $paths = explode('/', $f);
            $values[] = end($paths);
        }
        chdir($logs_path);
        $archive = new PclZip($path);
        $response = $archive->create($values);
        if ($response == 0) {
            die("[ERROR] PclZip : " . $archive->errorInfo(true));
        }

        if (headers_sent()) {
            echo 'HTTP header already sent';
        } else {
            if (!is_file($path)) {
                header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found');
                echo 'File not found';
            } else {
                if (!is_readable($path)) {
                    header($_SERVER['SERVER_PROTOCOL'] . ' 403 Forbidden');
                    echo 'File not readable';
                } else {
                    header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK');
                    header("Content-Type: application/zip");
                    header("Content-Transfer-Encoding: Binary");
                    header("Content-Length: " . filesize($path));
                    header("Content-Disposition: attachment; filename=\"" . basename($path) . "\"");
                    ob_clean();
                    flush();
                    readfile($path);
                    exit;
                }
            }
        }
        die;
    }

    private function clearLogs()
    {
        $keepFiles = ['index.php', '.htaccess'];

        $logs_path = $this->local_path . 'log/';
        $files = glob($logs_path . '/*');
        foreach ($files as $file) {
            if (is_file($file) && !in_array(basename($file), $keepFiles)) {
                unlink($file);
            }
        }
    }

    public function processAuth()
    {
        Configuration::updateValue('MBESHIPPING_INITIAL_CONF', 0);
        Configuration::updateValue('MBESHIPPING_ADVANCED_AUTH_CONF', 0);

        $mbe_credentials['mbecountry'] = Tools::getValue('mbecountry');
        $mbe_credentials['mbe_user'] = Tools::getValue('mbe_user');
        $mbe_credentials['mbe_pass'] = Tools::getValue('mbe_pass');

        Configuration::updateValue('MBESHIPPING_CREDENTIALS', json_encode($mbe_credentials));

        $api = new AuthAPI();
        if ($api->retrieveAPIKeys() === true) {
            return $this->displayConfirmation($this->l('Login successful'));
        }

        return $this->displayError($this->l('Login error, please check your credentials'));
    }

    public function processAdvancedAuth()
    {
        Configuration::updateValue('MBESHIPPING_INITIAL_CONF', 0);
        Configuration::updateValue('username', Tools::getValue('username'));
        Configuration::updateValue('password', Tools::getValue('password'));
        Configuration::updateValue('mbecountry', Tools::getValue('mbecountry'));
        Configuration::updateValue('url', Tools::getValue('url'));

        return $this->displayConfirmation($this->l('Settings updated'));
    }

    public function clearConfigsTab2()
    {
        $config_list = [
            'shipments_csv',
            'shipments_csv_mode',
            'mbe_shipments_csv_insurance_min',
            'mbe_shipments_csv_insurance_per',
            'mbe_shipments_ins_mode',
        ];

        foreach ($this->renderCouriersServicesMapping() as $carrier) {
            $config_list[] = $carrier['name'];
        }

        foreach ($this->renderServicesCustomDescription() as $service) {
            $config_list[] = $service['name'];
        }

        foreach ($config_list as $config) {
            Configuration::deleteByName($config);
        }
    }

    private function getCarrierIds() {
        return array_map(function ($carrier) {
            return (int)$carrier['id_carrier'];
         }, Carrier::getCarriers($this->context->language->id));
    }

    private function updateCarrierTaxRulesGroup($carrier_name, $id_tax_rules_group)
    {
        $id_carrier = (int)Db::getInstance()->getValue('SELECT `id_carrier` FROM `' . _DB_PREFIX_ . 'carrier` where name = "' . pSQL($carrier_name) . '" AND deleted="0"');
        if ($id_carrier > 0) {
            $carrier = new Carrier($id_carrier);
            $carrier->setTaxRulesGroup($id_tax_rules_group);
            foreach (Language::getLanguages() as $lang) {
                if (empty($carrier->delay[$lang['id_lang']])) {
                    $carrier->delay[$lang['id_lang']] = ' ';
                }
            }
            $carrier->save();
        }
    }

    public function renderCouriersServicesMapping()
    {
        $result = [];
        foreach (Carrier::getCarriers($this->context->language->id) as $carrier) {
            $result[] = [
                'type' => 'select',
                'label' => $this->l('Custom mapping for') . ' "' . $carrier['name'] . '"',
                'name' => 'mbe_custom_mapping_' . Tools::strtolower($carrier['id_carrier']),
                'required' => true,
                'options' => $this->getServiceOptions(),
                'desc' => $this->l('Select the custom mapping for the default shipping method') . '. ' . $this->l('Leave blank if you don\'t want to map it'),
            ];
        }
        return $result;
    }

    public function getServiceOptions()
    {
        $ws = new Ws();
        $availableShipping = $ws->getAllowedShipmentServices();
        if ($ws->isCustomerActive()) {
            if ($availableShipping) {
                $result = [];
                foreach ($availableShipping as $key => $array) {
                    $result[$key] = ['id_option' => $array['value'], 'name' => $array['label']];
                }
                array_unshift($result, ['id_option' => ' ', 'name' => ' ']);
                return ['query' => $result, 'id' => 'id_option', 'name' => 'name'];
            } else {
                return [
                    'query' => [
                        ['id_option' => 'express', 'name' => $this->l('Set ws parameters and save to retrieve available shipment types')]
                    ],
                    'id' => 'id_option',
                    'name' => 'name',
                ];
            }
        }

        return [
            'query' => [
                ['id_option' => '', 'name' => $this->l('Your user is not active')]
            ],
            'id' => 'id_option',
            'name' => 'name',
        ];
    }

    public function renderServicesCustomDescription()
    {
        $ws = new Ws();
        $available_services = $ws->getAllowedShipmentServices();

        $result = [];
        foreach ($available_services as $service) {
            array_push($result,
                [
                    'type' => 'text',
                    'label' => $this->l('Custom description for service') . ' "' . $service['label'] . '"',
                    'id' => 'mbe_custom_label_' .
                        Tools::strtolower(str_replace('+', 'p', $service['value'])),
                    'name' => 'mbe_custom_label_' .
                        Tools::strtolower(str_replace('+', 'p', $service['value'])),
                    'required' => true,
                    'class' => 'fixed-width-xxl',
                    'desc' => $this->l('Insert the custom name for the shipment method. Leave blank if you don\'t want to change the default value'),
                ],
                [
                    'type' => 'select',
                    'label' => $this->l('VAT for') . ' "' . $service['label'] . '"',
                    'name' => 'mbe_tax_rule_' . Tools::strtolower(str_replace('+', 'p', $service['value'])),
                    'required' => true,
                    'options' => [
                        'query' => TaxRulesGroup::getTaxRulesGroups(),
                        'id' => 'id_tax_rules_group',
                        'name' => 'name',
                        'default' => [
                            'label' => $this->l('No tax'),
                            'value' => 0,
                        ],
                    ],
                    'desc' => $this->l('Select the tax to be applied for the shipping method'),
                ]);
        }
        return $result;
    }

    public function validateCsvFileAndInsert($filePath, &$output)
    {
        $helper = new CsvHelper();

        $rates = $helper->readFile($filePath);

        //VALIDATE

        $errors = false;
        $i = 1;

        $allowedShipmentServices = Configuration::get('allowed_shipment_services');
        $allowedShipmentServicesArray = explode('-', $allowedShipmentServices);
        $maxShipmentWeight = Configuration::get('max_shipment_weight');


        foreach ($rates as $rate) {
            if (Tools::strlen($rate["country"]) > 2) {
                $output .= $this->displayError(sprintf($this->l('File upload error: row %d: "%s", COUNTRY column. 
                Use destination Country in 2 character ISO format (e.g. IT for Italy, ES for Spain, DE for Germany)"'),
                    $i, $rate["country"]));
                $errors = true;
            }

            if (!in_array($rate["delivery_type"], $allowedShipmentServicesArray)) {
                $output .= $this->displayError(sprintf($this->l('File upload error: row %d: "%s", 
                SHIPMENT TYPE column. Input code is not a valid MBE Service'), $i, $rate["delivery_type"]));
                $errors = true;
            }

            if ($maxShipmentWeight) {
                if ($rate["weight_from"] > $maxShipmentWeight) {
                    $output .= $this->displayError(sprintf($this->l('File upload error: row %d: "%s", 
                    WEIGHT column. Input weight exceeds allowed'), $i, $rate["weight_from"]));
                    $errors = true;
                }
                if ($rate["weight_to"] > $maxShipmentWeight) {
                    $output .= $this->displayError(sprintf($this->l('File upload error: row %d: "%s", 
                    WEIGHT column. Input weight exceeds allowed'), $i, $rate["weight_to"]));
                    $errors = true;
                }
            }
            $i++;
        }

        if ($errors) {
            return false;
        }

        //INSERT
        $ratesHelper = new RatesHelper();
        $truncateResult = $ratesHelper->truncate();

        if (!$truncateResult) {
            $this->displayError($this->l('Error executing truncate query '));
        }

        foreach ($rates as $rate) {
            $insertResult = $ratesHelper->insertRate($rate["country"], $rate["region"], $rate["city"], $rate["zip"],
                $rate["zip_to"], $rate["weight_from"], $rate["weight_to"], $rate["price"], $rate["delivery_type"]);

            if (!$insertResult) {
                $this->displayError($this->l('Error executing query '));
            }
        }

    }

    public function validateCsvPackageFileAndInsert($filePath, &$output)
    {
        $helper = new CsvHelper();

        $packages = $helper->readFile($filePath);

        $PackageHelper = new PackageHelper();
        $truncateResult = $PackageHelper->truncate();

        if (!$truncateResult) {
            $this->displayError($this->l('Error executing truncate query '));
        }

        foreach ($packages as $package) {
            $insertResult = $PackageHelper->insertCsvPackage($package["max_weight"], $package["length"],
                $package["width"], $package["height"], $package["package_label"], $package["package_code"]);

            if (!$insertResult) {
                $this->displayError($this->l('Error executing query '));
            }
        }
    }

    public function validateCsvPackageProductFileAndInsert($filePath, &$output)
    {
        $helper = new CsvHelper();

        $packageProducts = $helper->readFile($filePath);

        $PackageProductHelper = new PackageProductHelper();
        $truncateResult = $PackageProductHelper->truncate();

        if (!$truncateResult) {
            $this->displayError($this->l('Error executing truncate query '));
        }

        foreach ($packageProducts as $packageProduct) {
            $insertResult = $PackageProductHelper->insertCsvPackageProduct($packageProduct["custom_package"],
                $packageProduct["single_parcel"], $packageProduct["product_sku"], $packageProduct["package_code"]);

            if (!$insertResult) {
                $this->displayError($this->l('Error executing query '));
            }
        }
    }

    public function getFormTab4()
    {
        $ws = new Ws();
        $customer = $ws->getCustomer();

        $shipmentTypeOptions = [
            'query' => [
                ['id_option' => 'GENERIC', 'name' => $this->l('Generic')]],
            'id' => 'id_option',
            'name' => 'name',
        ];

        if ($customer && $customer->Permissions->canChooseMBEShipType) {
            $shipmentTypeOptions['query'][] = ['id_option' => 'ENVELOPE',
                'name' => $this->l('Envelope')];
        }

        $closureModeOptions = [
            'query' => [
                ['id_option' => DataHelper::MBE_CLOSURE_MODE_AUTOMATICALLY,
                    'name' => $this->l('Automatically')],
                ['id_option' => DataHelper::MBE_CLOSURE_MODE_MANUALLY,
                    'name' => $this->l('Manually')],
            ],
            'id' => 'id_option',
            'name' => 'name',
        ];

        $creationModeOptions = [
            'query' => [
                ['id_option' => DataHelper::MBE_CREATION_MODE_AUTOMATICALLY,
                    'name' => $this->l('Automatically')],
                ['id_option' => DataHelper::MBE_CREATION_MODE_MANUALLY,
                    'name' => $this->l('Manually')],
            ],
            'id' => 'id_option',
            'name' => 'name',
        ];

        return [
            'form' => [
                'legend' => [
                    'title' => $this->l('Shipping'),
                ],
                'input' => [
                    [
                        'type' => 'select',
                        'label' => $this->l('Shipping countries'),
                        'name' => 'sallowspecific',
                        'options' => [
                            'query' => [
                                ['id_option' => '0', 'name' => $this->l('All countries available')],
                                ['id_option' => '1', 'name' => $this->l('Specific countries')]],
                            'id' => 'id_option',
                            'name' => 'name',
                        ],
                        'required' => true,
                        'desc' => $this->l('Choose the countries in which you want to enable shipping')
                    ],
                    [
                        'type' => 'select',
                        'label' => $this->l('Countries'),
                        'name' => 'specificcountry[]',
                        'required' => false,
                        'default_value' => (int)$this->context->country->id,
                        'options' => [
                            'query' => Country::getCountries($this->context->language->id),
                            'id' => 'iso_code',
                            'name' => 'name',
                        ],
                        'multiple' => true,
                        'desc' => $this->l('Choose at least one of the countries listed above')
                    ],
                    [
                        'type' => 'select',
                        'label' => $this->l('Choose a default mode'),
                        'name' => 'shipment_configuration_mode',
                        'options' => [
                            'query' => [
                                // array('id_option' => '1', 'name' => $this->l('Create one Shipment per Item')),
                                ['id_option' => '2', 'name' => $this->l('Create one Shipment per shopping cart (parcels calculated based on weight)')],
                                ['id_option' => '3', 'name' => $this->l('Create one Shipment per shopping cart with one parcel per Item')]],
                            'id' => 'id_option',
                            'name' => 'name',
                        ],
                        'disabled' => (int)Configuration::get('mbe_shipping_use_packages_csv'),
                        'required' => true,
                        'desc' => $this->l('WARNING: Using the option "A different shipment for each product in the cart", in the case of cash on delivery, the total amount to be paid will be divided evenly on each shipment (i.e. based on the number of items in the cart and not according to their value)')
                    ],
                    [
                        'type' => 'select',
                        'label' => $this->l('Default goods type'),
                        'name' => 'default_shipment_type',
                        'options' => $shipmentTypeOptions,
                        'required' => true,
                        'desc' => $this->l('Select at least one of the types of goods available')
                    ],
                    [
                        'type' => 'select',
                        'label' => $this->l('End of Day process of shipment - Methods'),
                        'name' => 'shipments_closure_mode',
                        'required' => false,
                        'options' => $closureModeOptions,
                        'desc' => $this->l('To close the shipments, select the preferred method')
                    ],
                    [
                        'type' => 'select',
                        'label' => $this->l('Creating shipments - Methods'),
                        'name' => 'shipments_creation_mode',
                        'required' => false,
                        'options' => $creationModeOptions,
                        'desc' => $this->l('To create the shipments, select the preferred method')
                    ],
                    [
                        'type' => 'select',
                        'label' => $this->l('Automatically set as shipped'),
                        'name' => 'mbe_auto_change_order_status',
                        'options' => [
                            'query' => [
                                ['id_option' => 1, 'name' => $this->l('Yes')],
                                ['id_option' => 0, 'name' => $this->l('No')]
                            ],
                            'id' => 'id_option',
                            'name' => 'name',
                        ],
                        'required' => false,
                        'desc' => $this->l('At the MBE shipment closure, if the order is in the status of "Payment accepted" will automatically be set as "Shipped" and the notification will be sent to the customer')
                    ],
                ],
                'submit' => [
                    'title' => $this->l('Save')
                ]
            ]
        ];
    }

    public function getForm1Tab5()
    {
        return [
            'form' => [
                'legend' => [
                    'title' => $this->l('Recharge'),
                ],
                'input' => [
                    [
                        'type' => 'select',
                        'label' => $this->l('Calculation method'),
                        'name' => 'handling_type',
                        'options' => [
                            'query' => [
                                ['id_option' => 'P', 'name' => $this->l('Percentage')],
                                ['id_option' => 'F', 'name' => $this->l('Fixed amount')]],
                            'id' => 'id_option',
                            'name' => 'name',
                        ],
                        'required' => true,
                        'desc' => $this->l('Select one of the preferred methods for applying the markup on the shipping price')
                    ],
                    [
                        'type' => 'select',
                        'label' => $this->l('Applied for'),
                        'name' => 'handling_action',
                        'options' => [
                            'query' => [
                                ['id_option' => 'S', 'name' => $this->l('Shipment')],
                                ['id_option' => 'P', 'name' => $this->l('Parcel')]],
                            'id' => 'id_option',
                            'name' => 'name',
                        ],
                        'required' => true,
                        'desc' => $this->l('Indicate whether to apply the markup for the entire shipment or for a single parcel shipped')
                    ],
                    [
                        'type' => 'text',
                        'label' => $this->numeric_field_labels['handling_fee'],
                        'name' => 'handling_fee',
                        'required' => true,
                        'class' => 'fixed-width-xl',
                        'desc' => $this->l('Indicate the value to be applied as a possible markup on the shipment to the customer')
                    ],
                    [
                        'type' => 'select',
                        'label' => $this->numeric_field_labels['handling_fee_rounding'],
                        'name' => 'handling_fee_rounding',
                        'options' => [
                            'query' => [
                                ['id_option' => '1', 'name' => $this->l('No rounding')],
                                ['id_option' => '2', 'name' => $this->l('Round up or down automatically')],
                                ['id_option' => '3', 'name' => $this->l('Always round down')],
                                ['id_option' => '4', 'name' => $this->l('Always round up')]],
                            'id' => 'id_option',
                            'name' => 'name',
                        ],
                        'required' => true,
                        'desc' => $this->l('Select the rounding method to apply to the shipping price')
                    ],
                    [
                        'type' => 'select',
                        'label' => $this->numeric_field_labels['handling_fee_rounding_amount'],
                        'name' => 'handling_fee_rounding_amount',
                        'options' => [
                            'query' => [
                                ['id_option' => '1', 'name' => '1'],
                                ['id_option' => '2', 'name' => '0.5']],
                            'id' => 'id_option',
                            'name' => 'name',
                        ],
                        'required' => true,
                        'desc' => $this->l('Select the maximum rounding unit applied, choosing between €0.5 and €1')
                    ],
                ],
                'submit' => [
                    'name' => 'submitForm1Tab5',
                    'title' => $this->l('Save')
                ]
            ]
        ];
    }

    public function getForm2Tab5()
    {
        return [
            'form' => [
                'legend' => [
                    'title' => $this->l('MBE Shipments - Free shipping thresholds & Service description'),
                ],
                'input' => $this->renderFreeShippingThresholdsAndServicesDescriptions(),
                'submit' => [
                    'name' => 'submitForm2Tab5',
                    'title' => $this->l('Save')
                ]
            ]
        ];
    }

    public function renderFreeShippingThresholdsAndServicesDescriptions()
    {
        $ws = new Ws();
        $available_services = $ws->getAllowedShipmentServices();

        $result = [];
        $active_services = explode('-', Configuration::get('allowed_shipment_services'));
        foreach ($available_services as $service) {
            if (in_array($service['value'], $active_services)) {
                $val = str_replace('+', 'plus', $service['value']);
                $result[] = [
                    'type' => 'text',
                    'label' => $service['label'] . ' ' . $this->l('free shipping threshold') . ' ' . $this->l('Domestic'),
                    'placeholder' => $this->l('ex. 1'),
                    'name' => 'mbelimit_' . Tools::strtolower($val), 'required' => true,
                    'class' => 'fixed-width-xl',
                    //'desc' => $this->l('Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do elusmod tempor incidunt ut labore et dolore magna aliqua.')
                ];
                $result[] = [
                    'type' => 'text',
                    'label' => $service['label'] . ' ' . $this->l('free shipping threshold') . ' ' . $this->l('Rest of the world'),
                    'placeholder' => $this->l('ex. 1'),
                    'name' => 'mbelimit_' . Tools::strtolower($val) . '_ww', 'required' => true,
                    'class' => 'fixed-width-xl',
                    //'desc' => $this->l('Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do elusmod tempor incidunt ut labore et dolore magna aliqua.')
                ];
                foreach (Language::getLanguages() as $lang) {
                    $result[] = [
                        'type' => 'text',
                        'label' => $service['label'] . ' ' . $this->l('Delay') . ' ' . $lang['name'],
                        'placeholder' => $this->l('ex. 1-3 working days'),
                        'name' => 'mbeshippingdelay_' . Tools::substr(md5($service['label'] . '_' .
                                $lang['iso_code']), 0, 15),
                        'required' => true,
                        'class' => 'fixed-width-xl',
                        'max-length' => 128,
                        //'desc' => $this->l('Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do elusmod tempor incidunt ut labore et dolore magna aliqua.')
                    ];
                }
            }
        }

        return $result;
    }

    public function updateJsDefs()
    {
        Media::addJsDef(
            [
                'mbe_ajax_check_version_error' => $this->transJsString('The module is not compatible with your PrestaShop\'s version. The plugin is not guaranteed to work for this version.'),
                'mbe_ajax_check_generic_error' => $this->transJsString('The module does not appear to be installed correctly, try reinstalling the plugin'),
                'mbe_ajax_check_controller_url' => $this->context->link->getAdminLink('AdminMbeChecklist'),
                'tab2_conf_mode' => (string)Configuration::get('MBESHIPPING_COURIERS_SERVICES_CONF_MODE'),
                'active_tab' => $this->last_active_tab
            ]
        );
    }

    public function displayConfiguration($result = '')
    {
        $this->context->controller->addJS($this->_path . 'views/js/select2.min.js');
        $this->context->controller->addJS($this->_path . 'views/js/back.js');
        $this->context->controller->addCSS($this->_path . 'views/css/select2.min.css');
        $this->context->controller->addCSS($this->_path . 'views/css/common.css');
        if (version_compare(_PS_VERSION_, '1.7.8', '<')) {
            $this->context->controller->addCSS($this->_path . 'views/css/back_16.css');
        } else {
            $this->context->controller->addCSS($this->_path . 'views/css/back.css');
        }

        $links = $this->getLinks();
        $this->conf_tabs = [];
        if ((int)Configuration::get('MBESHIPPING_INITIAL_CONF')) {
            $this->context->smarty->assign([
                'banner_elink' => $links['banner_elink'],
                'banner_packing' => $links['banner_packing'],
                'link_contact' => $links['contact'],
            ]);

            $this->conf_tabs['welcome'] = [
                'id' => 'welcome',
                'label' => $this->l('Welcome'),
                'icon_class' => '',
                'content' => $this->context->smarty->fetch(_PS_MODULE_DIR_ . $this->name . '/views/templates/admin/welcome.tpl'),
                'show_this' => true,
            ];
        }
        $this->conf_tabs['general_settings'] = [
            'id' => 'general_settings',
            'label' => $this->l('General'),
            'icon_class' => '',
            'content' => $this->displayTab1(),
            'show_this' => !(int)Configuration::get('MBESHIPPING_INITIAL_CONF'),
        ];
        $this->conf_tabs['couriers_services_settings'] = [
            'id' => 'couriers_services_settings',
            'label' => $this->l('Couriers and services'),
            'icon_class' => '',
            'content' => $this->displayTab2(),
            'show_this' => false,
            'desc' => $this->l('In this section you can configure your MBE services and associate them with the relative couriers')
        ];
        $this->conf_tabs['packages_settings'] = [
            'id' => 'packages_settings',
            'label' => $this->l('Packages'),
            'icon_class' => '',
            'content' => $this->displayTab3(),
            'show_this' => false,
            'desc' => $this->l('In this section you will have the possibility to define and configure your favorite packages, in order to assign the relative reference package to each product')
        ];
        $this->conf_tabs['shipping_settings'] = [
            'id' => 'shipping_settings',
            'label' => $this->l('Shipping'),
            'icon_class' => '',
            'content' => $this->displayTab4(),
            'show_this' => false,
            //'desc' => $this->l('In this section you will have the possibility to define and configure your favorite packages, in order to assign the relative reference package to each product')
        ];
        $this->conf_tabs['recharge_settings'] = [
            'id' => 'recharge_settings',
            'label' => $this->l('Recharge'),
            'icon_class' => '',
            'content' => $this->displayTab5(),
            'show_this' => false,
            'desc' => $this->l('In this section you can define the markup to be made to shipments, both for the entire shipment and for the single package, and any rounding')
        ];
        $this->conf_tabs['debug_settings'] = [
            'id' => 'debug_settings',
            'label' => $this->l('Debug'),
            'icon_class' => '',
            'content' => $this->displayTab6(),
            'show_this' => false,
        ];
        $this->conf_tabs['checkup_settings'] = [
            'id' => 'checkup_settings',
            'label' => $this->l('Check-up'),
            'icon_class' => 'icon-caret-right',
            'content' => $this->displayTab7(),
            'show_this' => false,
        ];

        $this->context->smarty->assign([
            'banner_elink' => $links['banner_elink'],
            'banner_packing' => $links['banner_packing'],
            'link_info' => $links['info'],
            'link_guide' => $links['guide'],
            'link_contact' => $links['contact'],
            'link_support' => $links['support'],
            'link_portal' => $links['portal'],
            'conf_tabs' => $this->conf_tabs,
            'module_version' => $this->version,
            'module_dir' => _PS_BASE_URL_ . __PS_BASE_URI__ . '/modules/' . $this->name,
            'result' => $result
        ]);

        Media::addJsDef([
            'text_signing_in' => $this->transJsString('Signing in...'),
            'url_field_not_valid' => $this->transJsString('The field must be a valid URL')
        ]);

        $conf_header = $this->context->smarty->fetch(_PS_MODULE_DIR_ . $this->name . '/views/templates/admin/configuration_header.tpl');
        $conf_tabs = $this->context->smarty->fetch(_PS_MODULE_DIR_ . $this->name . '/views/templates/admin/configuration.tpl');

        return $conf_header . $conf_tabs;
    }

    public function displayTab1()
    {
        $helper = new HelperForm();

        $helper->show_toolbar = false;
        $helper->table = $this->table;
        $helper->module = $this;
        $helper->default_form_language = $this->context->language->id;
        $helper->allow_employee_form_lang = Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG', 0);

        $helper->identifier = $this->identifier;
        $helper->submit_action = 'submitTab1';
        $helper->currentIndex = $this->context->link->getAdminLink('AdminModules', false)
            . '&configure=' . $this->name . '&tab_module=' . $this->tab . '&module_name=' . $this->name;
        $helper->token = Tools::getAdminTokenLite('AdminModules');

        $helper->tpl_vars = array(
            'fields_value' => $this->getValuesTab1(),
            'languages' => $this->context->controller->getLanguages(),
            'id_language' => $this->context->language->id,
        );

        return $helper->generateForm([
            $this->getForm1Tab1(),
            $this->getForm2Tab1(),
        ]);
    }

    public function getValuesTab1()
    {
        $inputs = $this->getInitializedInputValues(
            $this->getForm1Tab1(),
            $this->getForm2Tab1()
        );

        $mbe_credentials = json_decode(Configuration::get('MBESHIPPING_CREDENTIALS'));

        if (!AuthAPI::isAuthenticated()) {
            $inputs['mbe_user'] = isset($mbe_credentials->mbe_user) ? $mbe_credentials->mbe_user : '';
            $inputs['mbe_pass'] = isset($mbe_credentials->mbe_pass) ? $mbe_credentials->mbe_pass : '';
            $inputs['mbe_active'] = Configuration::get('mbe_active');
        } else {
            $inputs['mbecountry'] = Configuration::get('mbecountry');
            $inputs['url'] = Configuration::get('url');
            $inputs['username'] = Configuration::get('username');
            $inputs['password'] = Configuration::get('password');
            $inputs['mbe_active'] = Configuration::get('mbe_active');
        }

        return $inputs;
    }

    public function getForm1Tab1()
    {
        $is_advanced = (int)Configuration::get('MBESHIPPING_ADVANCED_AUTH_CONF');

        if (!AuthAPI::isAuthenticated() && !$is_advanced) {
            $form = [
                'form' => [
                    'legend' => [
                        'title' => $this->l('MBE Services'),
                    ],
                    'input' => [
                        [
                            'type' => 'access_form',
                            'name' => 'mbe_access_form',
                            'text1' => $this->l('The MBE e-LINK module, free, easy to install and configure, connects directly to your e-commerce, allowing you to offer different types of shipping and service levels to your customers, all characterized by the quality of Mail Boxes Etc.'),
                            'text2' => $this->l('Enter your credentials to be able to access the plug-in configuration.'),
                            'select' => [
                                'label' => $this->l('Country'),
                                'name' => 'mbecountry',
                                'options' => [
                                    'query' => [
                                        ['id_option' => 'IT', 'name' => $this->l('Italy')],
                                        ['id_option' => 'ES', 'name' => $this->l('Spain')],
                                        ['id_option' => 'DE', 'name' => $this->l('Germany')],
                                        ['id_option' => 'FR', 'name' => $this->l('France')],
                                        ['id_option' => 'AT', 'name' => $this->l('Austria')],
                                        ['id_option' => 'PL', 'name' => $this->l('Poland')],
                                        ['id_option' => 'HR', 'name' => $this->l('Croatia')],
                                    ],
                                    'id' => 'id_option',
                                    'name' => 'name',
                                ],
                                'required' => true,
                            ]
                        ],
                    ]
                ],
            ];
        } else {
            if (!$is_advanced) {
                $form = [
                    'form' => [
                        'legend' => [
                            'title' => $this->l('MBE Services'),
                        ],
                        'input' => [
                            [
                                'type' => 'select',
                                'label' => $this->l('Country'),
                                'id' => 'mbecountry',
                                'name' => 'mbecountry',
                                'options' => [
                                    'query' => [
                                        ['id_option' => 'IT', 'name' => $this->l('Italy')],
                                        ['id_option' => 'ES', 'name' => $this->l('Spain')],
                                        ['id_option' => 'DE', 'name' => $this->l('Germany')],
                                        ['id_option' => 'FR', 'name' => $this->l('France')],
                                        ['id_option' => 'AT', 'name' => $this->l('Austria')],
                                        ['id_option' => 'PL', 'name' => $this->l('Poland')],
                                        ['id_option' => 'HR', 'name' => $this->l('Croatia')]
                                    ],
                                    'id' => 'id_option',
                                    'name' => 'name',
                                ],
                                'disabled' => true,
                            ],
                            [
                                'type' => 'text',
                                'label' => $this->l('URL Web-Service MBE'),
                                'name' => 'url',
                                'disabled' => true,
                                'class' => 'fixed-width-xxl',
                            ],
                            [
                                'type' => 'text',
                                'label' => $this->l('Login MBE eShip'),
                                'name' => 'username',
                                'disabled' => true,
                                'class' => 'fixed-width-xxl',
                            ],
                            [
                                'type' => 'text',
                                'label' => $this->l('Passphrase MBE eShip'),
                                'name' => 'password',
                                'disabled' => true,
                                'class' => 'fixed-width-xxl',
                            ],
                            [
                                'type' => 'auth_reset',
                                'name' => 'mbe_auth_reset',
                                'btn_name' => 'mbeAuthReset',
                                'isAdvanced' => 0
                            ]
                        ],
                    ],
                ];
            } else {
                $form = [
                    'form' => [
                        'legend' => [
                            'title' => $this->l('MBE Services'),
                        ],
                        'input' => [
                            [
                                'type' => 'select',
                                'label' => $this->l('Country'),
                                'id' => 'mbecountry',
                                'name' => 'mbecountry',
                                'options' => [
                                    'query' => [
                                        ['id_option' => 'IT', 'name' => $this->l('Italy')],
                                        ['id_option' => 'ES', 'name' => $this->l('Spain')],
                                        ['id_option' => 'DE', 'name' => $this->l('Germany')],
                                        ['id_option' => 'FR', 'name' => $this->l('France')],
                                        ['id_option' => 'AT', 'name' => $this->l('Austria')],
                                        ['id_option' => 'PL', 'name' => $this->l('Poland')],
                                        ['id_option' => 'HR', 'name' => $this->l('Croatia')]
                                    ],
                                    'id' => 'id_option',
                                    'name' => 'name',
                                ],
                            ],
                            [
                                'type' => 'text',
                                'label' => $this->l('URL Web-Service MBE'),
                                'name' => 'url',
                                'class' => 'fixed-width-xxl',
                                'desc' => $this->l('The address to be used is standard for the entire MBE network')
                            ],
                            [
                                'type' => 'text',
                                'label' => $this->l('Login MBE eShip'),
                                'name' => 'username',
                                'class' => 'fixed-width-xxl',
                                'desc' => $this->l('Enter the username/login used to access MBE Online, provided by the reference MBE Center')
                            ],
                            [
                                'type' => 'text',
                                'label' => $this->l('Passphrase MBE eShip'),
                                'name' => 'password',
                                'class' => 'fixed-width-xxl',
                                'desc' => $this->l('Enter the passphrase provided by the reference MBE Center or generated on your MBE Online platform')
                            ],
                            [
                                'type' => 'auth_reset',
                                'name' => 'mbe_auth_reset',
                                'btn_name' => 'mbeAuthReset',
                                'isAdvanced' => 1
                            ]
                        ],
                        'submit' => [
                            'name' => 'submitAdvAuth',
                            'title' => $this->l('Save')
                        ]
                    ],
                ];
            }
        }

        return $form;
    }

    public function getForm2Tab1()
    {
        return [
            'form' => [
                'legend' => [
                    'title' => $this->l('Configuration preferences'),
                ],
                'input' => [
                    [
                        'type' => 'switch',
                        'label' => $this->l('Enabled'),
                        'name' => 'mbe_active',
                        'desc' => $this->l('Setting to "Enabled" will enable MBE shipping options for the buyers of your eCommerce.'),
                        'values' => [
                            [
                                'id' => 'active_on',
                                'value' => true,
                            ],
                            [
                                'id' => 'active_off',
                                'value' => false,
                            ],
                        ],
                        'required' => true,
                    ]
                ],
                'submit' => [
                    'name' => 'submitTab1',
                    'icon' => 'icon-save',
                    'title' => $this->l('Save'),
                ]
            ]
        ];
    }

    public function displayTab2()
    {
        $helper = new HelperForm();

        $helper->show_toolbar = false;
        $helper->table = $this->table;
        $helper->module = $this;
        $helper->default_form_language = $this->context->language->id;
        $helper->allow_employee_form_lang = Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG', 0);

        $helper->identifier = $this->identifier;
        $helper->currentIndex = $this->context->link->getAdminLink('AdminModules', false)
            . '&configure=' . $this->name . '&tab_module=' . $this->tab . '&module_name=' . $this->name;
        $helper->token = Tools::getAdminTokenLite('AdminModules');

        $helper->tpl_vars = array(
            'fields_value' => $this->getValuesTab2(),
            'languages' => $this->context->controller->getLanguages(),
            'id_language' => $this->context->language->id,
        );

        return $helper->generateForm([
            $this->selectConfTab2(),
            $this->getConf1Tab2(),
            $this->getConf2Tab2(),
            $this->getConf3Tab2(),
        ]);
    }

    public function getValuesTab2()
    {
        $inputs = $this->getInitializedInputValues(
            $this->selectConfTab2(),
            $this->getConf1Tab2(),
            $this->getConf2Tab2(),
            $this->getConf3Tab2()
        );

        $inputs['mbe_allowed_shipment_services_1[]'] = explode('-', Configuration::get('allowed_shipment_services'));
        $inputs['mbe_allowed_shipment_services_2[]'] = explode('-', Configuration::get('allowed_shipment_services'));
        $inputs['mbe_allowed_shipment_services_3[]'] = explode('-', Configuration::get('allowed_shipment_services'));
        $inputs['shipments_csv'] = Configuration::get('shipments_csv');
        $inputs['shipments_csv_mode'] = Configuration::get('shipments_csv_mode');
        $inputs['mbe_shipments_csv_insurance_min'] = Configuration::get('mbe_shipments_csv_insurance_min');
        $inputs['mbe_shipments_csv_insurance_per'] = Configuration::get('mbe_shipments_csv_insurance_per');
        $inputs['mbe_shipments_ins_mode'] = Configuration::get('mbe_shipments_ins_mode');

        foreach ($this->getCarrierIds() as $id_carrier) {
            $inputs['mbe_custom_mapping_' . $id_carrier] = Configuration::get('mbe_custom_mapping_' . $id_carrier);
        }

        foreach ((new Ws)->getAllowedShipmentServices() as $service) {
            $id_service = Tools::strtolower(str_replace('+', 'p', $service['value']));
            $inputs['mbe_custom_label_' . $id_service] = Configuration::get('mbe_custom_label_' . $id_service);
            $inputs['mbe_tax_rule_' . $id_service] = Configuration::get('mbe_tax_rule_' . $id_service);
        }

        return $inputs;
    }

    public function selectConfTab2()
    {
        return [
            'form' => [
                'legend' => [
                    'title' => $this->l('Couriers and services'),
                ],
                'input' => [
                    [
                        'type' => 'custom_text',
                        'name' => 'mbe_couriers_services_description',
                        'text' => $this->l('For the plugin to work correctly, at least one option must be selected, and the services available are those set by the MBE Center on the MOL user page on HUB. Subsequently, it is possible to define a custom name for each MBE service selected in the field seen above. This set of fields is automatically generated dynamically, based on the values selected in the "Enabled MBE Services" list')
                    ],
                    [
                        'type' => 'select',
                        'label' => $this->l('Configuration mode'),
                        'id' => 'mbe_couriers_services_mode',
                        'name' => 'mbe_couriers_services_mode',
                        'options' => [
                            'query' => [
                                ['id_option' => 'default', 'name' => $this->l('--- Select a mode ---')],
                                ['id_option' => 1, 'name' => $this->l('Custom pricing (CSV file)')],
                                ['id_option' => 2, 'name' => $this->l('Mapping of Couriers and Shipping services')],
                                ['id_option' => 3, 'name' => $this->l('MBE services recovery')],
                            ],
                            'id' => 'id_option',
                            'name' => 'name',
                        ],
                        'required' => true,
                        'class' => 'fixed-width-xxl',
                        'desc' => $this->l('Select the desired configuration mode')
                    ],
                    [
                        'type' => 'change_conf_mode',
                        'name' => 'mbe_change_conf_mode',
                        'btn_name' => 'mbeChangeConfigMode',
                        'text' => $this->l('You\'re about to change configuration mode. Please confirm to proceed.')
                    ]
                ]
            ],
        ];
    }

    public function getConf1Tab2()
    {
        return [
            'form' => [
                'legend' => [
                    'title' => $this->l('Configuration preferences'),
                ],
                'input' => [
                    [
                        'type' => 'select',
                        'label' => $this->l('Select one or more services you intend to offer for shipping'),
                        'id' => 'mbe_allowed_shipment_services_1',
                        'name' => 'mbe_allowed_shipment_services_1[]',
                        'options' => $this->getServiceOptions(),
                        'multiple' => true,
                        'required' => true,
                        'class' => 'fixed-width-xxl',
                        'desc' => $this->l('Select all MBE services that you intend to offer to the buyers of your eCommerce for shipping. For the plugin to work correctly, at least one option must be selected')
                    ],
                    [
                        'type' => 'file',
                        'label' => $this->l('Custom prices loaded from CSV files'),
                        'name' => 'shipments_csv',
                        'required' => false,
                        'files' => Configuration::get("mbe_shipments_csv") ? [
                            'file' => Configuration::get("mbe_shipments_csv"),
                            'download_url' => $this->module_url . 'uploads/' . Configuration::get("mbe_shipments_csv"),
                        ] : [],
                        'desc' => $this->l('You can upload your packages informations directly here via a CSV file.'),
                        'desc_link' => [
                            'url' => $this->module_url . 'uploads/mbe_csv_template.csv',
                            'text' => $this->l('Download template file (click here)')
                        ],
                        'col' => 8
                    ],
                    [
                        'type' => 'select',
                        'label' => $this->l('Custom Pricing (CSV) - File Usage Mode'),
                        'name' => 'shipments_csv_mode',
                        'required' => false,
                        'options' => [
                            'query' => [
                                ['id_option' => DataHelper::MBE_CSV_MODE_TOTAL, 'name' => $this->l('Total')],
                                ['id_option' => DataHelper::MBE_CSV_MODE_PARTIAL, 'name' => $this->l('Partial')],
                            ],
                            'id' => 'id_option',
                            'name' => 'name',
                        ],
                        'desc' => $this->l('Indicate how to use the file by choosing one of the options above'),
                        'col' => 8
                    ],
                    [
                        'type' => 'text',
                        'label' => $this->numeric_field_labels['mbe_shipments_csv_insurance_min'],
                        'name' => 'mbe_shipments_csv_insurance_min',
                        'required' => false,
                        'class' => 'fixed-width-xxl',
                        'desc' => $this->l('Specify the minimum value of the surcharge for this service')
                    ],
                    [
                        'type' => 'text',
                        'label' => $this->numeric_field_labels['mbe_shipments_csv_insurance_per'],
                        'name' => 'mbe_shipments_csv_insurance_per',
                        'required' => false,
                        'class' => 'fixed-width-xxl',
                        'desc' => $this->l('Specify the percentage value that you intend to use for the calculation of the surcharge for this service')
                    ],
                    [
                        'type' => 'select',
                        'label' => $this->l('Insurance - Declared value'),
                        'name' => 'mbe_shipments_ins_mode',
                        'required' => false,
                        'class' => 'fixed-width-xxl',
                        'options' => [
                            'query' => [
                                ['id_option' => DataHelper::MBE_INSURANCE_WITH_TAXES,
                                    'name' => $this->l('With Taxes')],
                                ['id_option' => DataHelper::MBE_INSURANCE_WITHOUT_TAXES,
                                    'name' => $this->l('Without Taxes')],
                            ],
                            'id' => 'id_option',
                            'name' => 'name',
                        ],
                        'desc' => $this->l('Choose whether to indicate the amount of the order including VAT or excluding VAT as the value of the goods')
                    ],
                ],
                'submit' => [
                    'name' => 'submitConf1Tab2',
                    'title' => $this->l('Save')
                ]
            ]
        ];
    }

    public function getConf2Tab2()
    {
        return [
            'form' => [
                'legend' => [
                    'title' => $this->l('Configuration preferences'),
                ],
                'input' => array_merge(
                    [
                        [
                            'type' => 'select',
                            'label' => $this->l('Select one or more services you intend to offer for shipping'),
                            'id' => 'mbe_allowed_shipment_services_2',
                            'name' => 'mbe_allowed_shipment_services_2[]',
                            'options' => $this->getServiceOptions(),
                            'multiple' => true,
                            'required' => true,
                            'desc' => $this->l('Select all MBE services that you intend to offer to the buyers of your eCommerce for shipping. For the plugin to work correctly, at least one option must be selected')
                        ]
                    ],
                    $this->renderCouriersServicesMapping()
                ),
                'submit' => [
                    'name' => 'submitConf2Tab2',
                    'title' => $this->l('Save')
                ]
            ],
        ];
    }

    public function getConf3Tab2()
    {
        return [
            'form' => [
                'legend' => [
                    'title' => $this->l('Configuration preferences'),
                ],
                'input' => array_merge(
                    [
                        [
                            'type' => 'custom_text',
                            'name' => 'mbe_shipments_description',
                            'text' => $this->l('Introductory description of MBE shipments:'),
                            'list' => [
                                $this->l('MBE Standard: is a service that offers you the possibility to ship in Italy and throughout Europe and is the ideal solution for individuals and companies who want to guarantee their customers reliability and punctuality.'),
                                $this->l('MBE Express: is a service that guarantees the delivery of your shipments, in Italy, on average in two working days (within 48 hours of collection)'),
                                $this->l('MBE Delivery Point: it is a service that allows you to send objects, packages, documents and much more, in a convenient and fast way from an MBE Center of your choice, to one of the many authorized and authorized collection points, both in Italy than abroad.')
                            ],
                        ],
                        [
                            'type' => 'select',
                            'label' => $this->l('Select one or more services you intend to offer for shipping'),
                            'id' => 'mbe_allowed_shipment_services_3',
                            'name' => 'mbe_allowed_shipment_services_3[]',
                            'options' => $this->getServiceOptions(),
                            'multiple' => true,
                            'required' => true,
                            'desc' => $this->l('Select all MBE services that you intend to offer to the buyers of your eCommerce for shipping. For the plugin to work correctly, at least one option must be selected')
                        ]
                    ],
                    $this->renderServicesCustomDescription()
                ),
                'submit' => [
                    'name' => 'submitConf3Tab2',
                    'title' => $this->l('Save')
                ]
            ]
        ];
    }

    public function displayTab3()
    {
        $helper = new HelperForm();

        $helper->show_toolbar = false;
        $helper->table = $this->table;
        $helper->module = $this;
        $helper->default_form_language = $this->context->language->id;
        $helper->allow_employee_form_lang = Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG', 0);

        $helper->identifier = $this->identifier;
        $helper->currentIndex = $this->context->link->getAdminLink('AdminModules', false)
            . '&configure=' . $this->name . '&tab_module=' . $this->tab . '&module_name=' . $this->name;
        $helper->token = Tools::getAdminTokenLite('AdminModules');

        $helper->tpl_vars = array(
            'fields_value' => $this->getValuesTab3(),
            'languages' => $this->context->controller->getLanguages(),
            'id_language' => $this->context->language->id,
        );

        $forms = [
            $this->getForm1Tab3()
        ];

        if ((int)Configuration::get('mbe_shipping_use_packages_csv')) {
            $forms[] = $this->getForm2Tab3();
            $forms[] = $this->getAdvancedConfTab3();
        }

        return $helper->generateForm($forms);
    }

    public function getValuesTab3()
    {
        $inputs = $this->getInitializedInputValues(
            $this->getForm1Tab3(),
            $this->getForm2Tab3(),
            $this->getAdvancedConfTab3()
        );

        foreach ($this->getForm1Tab3()['form']['input'] as $input) {
            $inputs[$input['name']] = Configuration::get($input['name']);
        }

        foreach ($this->getForm2Tab3()['form']['input'] as $input) {
            $inputs[$input['name']] = Configuration::get($input['name']);
        }

        return $inputs;
    }

    public function getForm1Tab3()
    {
        return [
            'form' => [
                'legend' => [
                    'title' => $this->l('Standard configuration'),
                ],
                'input' => [
                    [
                        'type' => 'text',
                        'label' => $this->numeric_field_labels['default_length'] . ' (cm)',
                        'placeholder' => $this->l('ex. 20'),
                        'name' => 'default_length',
                        'required' => true,
                        'class' => 'fixed-width-xl',
                        'desc' => $this->l('Refer to the average length of shipments normally made. It can contain decimal numbers')
                    ],
                    [
                        'type' => 'text',
                        'label' => $this->numeric_field_labels['default_width'] . ' (cm)',
                        'placeholder' => $this->l('ex. 20'),
                        'name' => 'default_width',
                        'required' => true,
                        'class' => 'fixed-width-xl',
                        'desc' => $this->l('Refer to the average width of shipments normally made. It can contain decimal numbers')
                    ],
                    [
                        'type' => 'text',
                        'label' => $this->numeric_field_labels['default_height'] . ' (cm)',
                        'placeholder' => $this->l('ex. 20'),
                        'name' => 'default_height',
                        'required' => true,
                        'class' => 'fixed-width-xl',
                        'desc' => $this->l('Refer to the average height of shipments normally made. It can contain decimal numbers')
                    ],
                    [
                        'type' => 'text',
                        'label' => $this->numeric_field_labels['max_package_weight'] . ' (kg)',
                        'placeholder' => $this->l('ex. 1.5'),
                        'name' => 'max_package_weight',
                        'required' => true,
                        'class' => 'fixed-width-xl',
                        'desc' => $this->l('Indicate the maximum weight in kg of each package to be shipped and check any limitations with your MBE Center')
                    ],
                    [
                        'type' => 'text',
                        'label' => $this->numeric_field_labels['max_shipment_weight'] . ' (kg)',
                        'placeholder' => $this->l('ex. 1.5'),
                        'name' => 'max_shipment_weight',
                        'required' => true,
                        'class' => 'fixed-width-xl',
                        'desc' => $this->l('Indicate the maximum weight of the shipment in kg, intended as the sum of the weights of all packages shipped. In case of Envelope shipping, a default value will be applied 0.5 kg (not editable).')
                    ],
                    [
                        'type' => 'switch',
                        'label' => $this->l('Use advanced configuration'),
                        'id' => 'mbe_shipping_use_packages_csv',
                        'name' => 'mbe_shipping_use_packages_csv',
                        'values' => [
                            [
                                'id' => 'active_on',
                                'value' => true,
                            ],
                            [
                                'id' => 'active_off',
                                'value' => false,
                            ],
                        ],
                        // 'desc' => $this->l('Load the standard packages via CSV file'),
                    ],
                ],
                'submit' => [
                    'name' => 'submitForm1Tab3',
                    'title' => $this->l('Save')
                ]
            ]
        ];
    }

    public function getForm2Tab3()
    {
        if ((int)Configuration::get('mbe_shipping_use_packages_csv')) {
            $csvPackageFiles = null;
            if (Configuration::get("mbe_shipping_packages_csv")) {
                $csvPackageFiles[] = [
                    'file' => Configuration::get("mbe_shipping_packages_csv"),
                    'download_url' => $this->module_url . 'uploads/' . Configuration::get("mbe_shipping_packages_csv"),
                ];
            }

            $csvPackageProductFiles = null;
            if (Configuration::get("mbe_shipping_packages_product_csv")) {
                $csvPackageProductFiles[] = [
                    'file' => Configuration::get("mbe_shipping_packages_product_csv"),
                    'download_url' => $this->module_url . 'uploads/' .
                        Configuration::get("mbe_shipping_packages_product_csv"),
                ];
            }

            return [
                'form' => [
                    'legend' => [
                        'title' => $this->l('Standard packages CSV'),
                    ],
                    'input' => [
                        [
                            'type' => 'file',
                            'label' => $this->l('Packages CSV'),
                            'name' => 'mbe_shipping_packages_csv',
                            'required' => false,
                            'files' => $csvPackageFiles,
                            'desc' => $this->l('You can upload your package information directly here via a CSV file.'),
                            'desc_link' => [
                                'url' => $this->module_url . 'uploads/mbe_package_csv_template.csv',
                                'text' => $this->l('Download template file (click here)')
                            ]
                        ],
                        [
                            'type' => 'file',
                            'label' => $this->l('Product packages CSV'),
                            'name' => 'mbe_shipping_packages_product_csv',
                            'required' => false,
                            'files' => $csvPackageProductFiles,
                            'desc' => $this->l('You can upload your package information directly here via a CSV file.'),
                            'desc_link' => [
                                'url' => $this->module_url . 'uploads/mbe_package_product_csv_template.csv',
                                'text' => $this->l('Download template file (click here)')
                            ]
                        ],
                    ],
                    'submit' => [
                        'name' => 'submitForm2Tab3',
                        'title' => $this->l('Save')
                    ]
                ]
            ];
        }

        return [
            'form' => [
                'legend' => [
                    'title' => $this->l('Standard packages CSV'),
                ],
                'input' => [
                    [
                        'type' => 'switch',
                        'label' => $this->l('Use CSV for standard packages'),
                        'id' => 'mbe_shipping_use_packages_csv',
                        'name' => 'mbe_shipping_use_packages_csv',
                        'values' => [
                            [
                                'id' => 'active_on',
                                'value' => true,
                            ],
                            [
                                'id' => 'active_off',
                                'value' => false,
                            ],
                        ],
                        //'desc' => $this->l('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo maximus lacinia.'),
                        'required' => true,
                    ]
                ],
                'submit' => [
                    'name' => 'submitForm2Tab3',
                    'title' => $this->l('Save')
                ]
            ]
        ];
    }

    public function getAdvancedConfTab3()
    {
        return [
            'form' => [
                'legend' => [
                    'title' => $this->l('Advanced configuration'),
                ],
                'input' => [
                    [
                        'type' => 'custom_text',
                        'name' => 'mbe_advanced_configuration_description',
                        'text' => $this->l('In this section it is possible to configure the CSV files for your standard packages and for your products and also download the template for the configuration.'),
                    ],
                    [
                        'type' => 'advanced_conf',
                        'name' => 'mbe_advanced_conf',
                        'admin_package' => $this->context->link->getAdminLink('AdminMbePackageHelper'),
                        'admin_product_package' => $this->context->link->getAdminLink('AdminMbePackageProductHelper'),
                    ],
                ]
            ]
        ];
    }

    public function displayTab4()
    {
        $helper = new HelperForm();

        $helper->show_toolbar = false;
        $helper->table = $this->table;
        $helper->module = $this;
        $helper->default_form_language = $this->context->language->id;
        $helper->allow_employee_form_lang = Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG', 0);

        $helper->identifier = $this->identifier;
        $helper->submit_action = 'submitTab4';
        $helper->currentIndex = $this->context->link->getAdminLink('AdminModules', false)
            . '&configure=' . $this->name . '&tab_module=' . $this->tab . '&module_name=' . $this->name;
        $helper->token = Tools::getAdminTokenLite('AdminModules');

        $helper->tpl_vars = array(
            'fields_value' => $this->getValuesTab4(),
            'languages' => $this->context->controller->getLanguages(),
            'id_language' => $this->context->language->id,
        );

        return $helper->generateForm([
            $this->getFormTab4(),
        ]);
    }

    public function getValuesTab4()
    {
        $inputs = $this->getInitializedInputValues(
            $this->getFormTab4()
        );

        foreach ($this->getFormTab4()['form']['input'] as $input) {
            if ($input['name'] === 'specificcountry[]') {
                $inputs[$input['name']] = explode('-', Configuration::get('specificcountry'));
            } else {
                $inputs[$input['name']] = Configuration::get($input['name']);
            }
        }

        return $inputs;
    }

    public function displayTab5()
    {
        $helper = new HelperForm();

        $helper->show_toolbar = false;
        $helper->table = $this->table;
        $helper->module = $this;
        $helper->default_form_language = $this->context->language->id;
        $helper->allow_employee_form_lang = Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG', 0);

        $helper->identifier = $this->identifier;
        $helper->currentIndex = $this->context->link->getAdminLink('AdminModules', false)
            . '&configure=' . $this->name . '&tab_module=' . $this->tab . '&module_name=' . $this->name;
        $helper->token = Tools::getAdminTokenLite('AdminModules');

        $helper->tpl_vars = array(
            'fields_value' => $this->getValuesTab5(),
            'languages' => $this->context->controller->getLanguages(),
            'id_language' => $this->context->language->id,
        );


        $ws = new Ws();
        $available_services = $ws->getAllowedShipmentServices();

        if (!empty($available_services)) {
            return $helper->generateForm([
                $this->getForm1Tab5(),
                $this->getForm2Tab5(),
            ]);
        }

        return $helper->generateForm([
            $this->getForm1Tab5()
        ]);
    }

    public function getValuesTab5()
    {
        $inputs = $this->getInitializedInputValues(
            $this->getForm1Tab5(),
            $this->getForm2Tab5()
        );

        foreach ($this->getForm1Tab5()['form']['input'] as $input) {
            $inputs[$input['name']] = Configuration::get($input['name']);
        }

        foreach ($this->getForm2Tab5()['form']['input'] as $input) {
            $inputs[$input['name']] = Configuration::get($input['name']);
        }

        return $inputs;
    }

    public function displayTab6()
    {
        $helper = new HelperForm();

        $helper->show_toolbar = false;
        $helper->table = $this->table;
        $helper->module = $this;
        $helper->default_form_language = $this->context->language->id;
        $helper->allow_employee_form_lang = Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG', 0);

        $helper->identifier = $this->identifier;
        $helper->submit_action = 'submitTab6';
        $helper->currentIndex = $this->context->link->getAdminLink('AdminModules', false)
            . '&configure=' . $this->name . '&tab_module=' . $this->tab . '&module_name=' . $this->name;
        $helper->token = Tools::getAdminTokenLite('AdminModules');

        $helper->tpl_vars = array(
            'fields_value' => $this->getValuesTab6(),
            'languages' => $this->context->controller->getLanguages(),
            'id_language' => $this->context->language->id,
        );

        return $helper->generateForm([
            $this->getFormTab6()
        ]);
    }

    public function getValuesTab6()
    {
        $inputs = $this->getInitializedInputValues(
            $this->getFormTab6()
        );

        $inputs['mbe_debug'] = Configuration::get('mbe_debug');

        return $inputs;
    }

    public function getFormTab6()
    {
        return [
            'form' => [
                'legend' => [
                    'title' => $this->l('Debug'),
                ],
                'input' => [
                    [
                        'type' => 'switch',
                        'label' => $this->l('Debug'),
                        'name' => 'mbe_debug',
                        'values' => [
                            [
                                'id' => 'active_on',
                                'value' => true,
                            ],
                            [
                                'id' => 'active_off',
                                'value' => false,
                            ],
                        ],
                        'desc' => $this->l('This feature is used to collect logs of problems generated during application crashes.'),
                    ],
                    [
                        'type' => 'link_button',
                        'label' => $this->l('Download'),
                        'name' => 'download',
                        'link' => $this->context->link->getAdminLink('AdminModules') . '&configure=' . $this->name . '&downloadlogs=1',
                        'text' => $this->l('Download log files'),
                        'icon' => 'icon-download',
                        'desc' => $this->l('To download the crash log files, click here'),
                        'class' => 'btn btn-primary'
                    ],
                    [
                        'type' => 'link_button',
                        'label' => $this->l('Delete'),
                        'name' => 'delete',
                        'link' => $this->context->link->getAdminLink('AdminModules') . '&configure=' . $this->name . '&deletelogs=1',
                        'text' => $this->l('Delete log files'),
                        'icon' => 'icon-remove-circle',
                        'desc' => $this->l('To delete the crash log files, click here'),
                        'class' => 'btn btn-primary'
                    ]
                ],
                'submit' => [
                    'title' => $this->l('Save')
                ]
            ]
        ];
    }

    public function displayTab7()
    {
        $helper = new HelperForm();

        $helper->show_toolbar = false;
        $helper->table = $this->table;
        $helper->module = $this;
        $helper->default_form_language = $this->context->language->id;
        $helper->allow_employee_form_lang = Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG', 0);

        $helper->identifier = $this->identifier;
        $helper->currentIndex = $this->context->link->getAdminLink('AdminModules', false)
            . '&configure=' . $this->name . '&tab_module=' . $this->tab . '&module_name=' . $this->name;
        $helper->token = Tools::getAdminTokenLite('AdminModules');

        $helper->tpl_vars = array(
            'fields_value' => '',
            'languages' => $this->context->controller->getLanguages(),
            'id_language' => $this->context->language->id,
        );

        return $helper->generateForm([
            $this->getFormTab7()
        ]);
    }

    public function getFormTab7()
    {
        return [
            'form' => [
                'legend' => [
                    'title' => $this->l('Check-up'),
                ],
                'input' => [
                    [
                        'type' => 'checklist',
                        'name' => 'mbe_checklist'
                    ]
                ]
            ],
        ];
    }

    public function getLinks()
    {
        $base_url_banners = Tools::getHttpHost(true) . __PS_BASE_URI__ . 'modules/' . $this->name . '/views/img/banners/';
        $links = [
            'it' => [
                'banner_elink' => $base_url_banners . 'elink_it.jpg',
                'banner_packing' => $base_url_banners . 'packing_it.jpg',
                'info' => 'https://www.mbe.it/it/mbe-plugin-ecommerce',
                'guide' => 'https://www.mbe.it/downloads/3233/353/353_readme_it.pdf',
                'contact' => 'https://www.mbe.it/it/mbe-plugin-ecommerce',
                'support' => 'https://www.mbe.it/it/mbe-plugin-ecommerce',
                'portal' => 'https://www.mbe.it/it/mbe-plugin-ecommerce'
            ],
            'en' => [
                'banner_elink' => $base_url_banners . 'elink_en.jpg',
                'banner_packing' => $base_url_banners . 'packing_en.jpg',
                'info' => 'https://www.mbe.it/en/mbe-plugin-ecommerce',
                'guide' => 'https://www.mbe.it/downloads/3233/354/354_readme_en.pdf',
                'contact' => 'https://www.mbe.it/en/mbe-plugin-ecommerce',
                'support' => 'https://www.mbe.it/en/mbe-plugin-ecommerce',
                'portal' => 'https://www.mbe.it/en/mbe-plugin-ecommerce'
            ],
            'fr' => [
                'banner_elink' => $base_url_banners . 'elink_fr.jpg',
                'banner_packing' => $base_url_banners . 'packing_fr.jpg',
                'info' => 'https://www.mbefrance.fr/fr/solutions-e-commerce',
                'guide' => 'https://www.mbefrance.fr/downloads/3435/14/14_MBE%20eShip%20v.%202.0%20-%20PrestaShop%20-%20%20Installation%20Guide%20FR.pdf',
                'contact' => 'https://www.mbefrance.fr/fr/solutions-e-commerce',
                'support' => 'https://www.mbefrance.fr/fr/solutions-e-commerce',
                'portal' => 'https://www.mbefrance.fr/fr/solutions-e-commerce'
            ],
            'de' => [
                'banner_elink' => $base_url_banners . 'elink_de.jpg',
                'banner_packing' => $base_url_banners . 'packing_de.jpg',
                'info' => 'https://www.mbe.de/de/mbe-e-link-automatisierte-versandl%C3%B6sung-f%C3%BCr-e-commerce',
                'guide' => 'https://docs.google.com/document/d/e/2PACX-1vTGafJ75ILLYxma2GL-y7dKqz6NISx3J6fxLFwR2rRGp1BK0UfhIkxNFtBcsZOgMw/pub',
                'contact' => 'https://www.mbe.de/de/mbe-e-link-automatisierte-versandl%C3%B6sung-f%C3%BCr-e-commerce',
                'support' => 'https://www.mbe.de/de/mbe-e-link-automatisierte-versandl%C3%B6sung-f%C3%BCr-e-commerce',
                'portal' => 'https://www.mbe.de/de/mbe-e-link-automatisierte-versandl%C3%B6sung-f%C3%BCr-e-commerce'
            ],
            'es' => [
                'banner_elink' => $base_url_banners . 'elink_es.jpg',
                'banner_packing' => $base_url_banners . 'packing_es.jpg',
                'info' => 'https://www.mbe.es/es/mbe-plugin-ecommerce',
                'guide' => 'https://www.mbe.es/downloads/6846/43/43_MBE%20eShip%20v.%202.0%20-%20PrestaShop%20-%20%20Gu%C3%ADa%20Instalaci%C3%B3n_ESP.docx.pdf',
                'contact' => 'https://www.mbe.es/es/mbe-plugin-ecommerce',
                'support' => 'https://www.mbe.es/es/mbe-plugin-ecommerce',
                'portal' => 'https://www.mbe.es/es/mbe-plugin-ecommerce'
            ],
            'pl' => [
                'banner_elink' => $base_url_banners . 'elink_pl.jpg',
                'banner_packing' => $base_url_banners . 'packing_pl.jpg',
                'info' => 'https://www.mbe.pl/pl/mbe-elink-plugin-ecommerce',
                'guide' => 'https://www.mbe.it/downloads/3233/354/354_readme_en.pdf',
                'contact' => 'https://www.mbe.pl/pl/mbe-elink-plugin-ecommerce',
                'support' => 'https://www.mbe.pl/pl/mbe-elink-plugin-ecommerce',
                'portal' => 'https://www.mbe.pl/pl/mbe-elink-plugin-ecommerce'
            ]
        ];

        if (array_key_exists($this->context->language->iso_code, $links)) {
            return $links[$this->context->language->iso_code];
        }

        return $links['en'];
    }

    public function checkConfiguration()
    {
        $warnings = [];
        $auth_configurations = [
            'mbecountry' => Configuration::get('mbecountry'),
            'url' => Configuration::get('url'),
            'username' => Configuration::get('username'),
            'password' => Configuration::get('password'),
        ];

        foreach ($auth_configurations as $conf) {
            if (empty($conf)) {
                $warnings[] = ($this->l('General') . ' > ' . $this->l('MBE Services') . ': ' . $this->l('please log in or proceed with advanced configuration'));
                break;
            }
        }

        if (empty(Configuration::get('MBESHIPPING_COURIERS_SERVICES_CONF_MODE'))) {
            $warnings[] = $this->l('Couriers and services') . ': ' . $this->l('please choose a configuration mode');
        } else {
            if (empty(explode('-', Configuration::get('allowed_shipment_services')))) {
                $warnings[] = $this->l('Couriers and services') . ' > ' . $this->l('Configuration preferences') . ': ' . $this->l('please choose one or more services');
            }
        }

        if (!(int)Configuration::get('mbe_shipping_use_packages_csv')) {
            foreach ($this->getForm1Tab3()['form']['input'] as $input) {
                if (in_array($input['name'], $this->numeric_fields)) {
                    if (empty(Configuration::get($input['name']))) {
                        $warnings[] = $this->l('Packages') . ' > ' . $this->l('Standard configuration') . ': ' . $this->l('please submit your configuration');
                        break;
                    }
                }
            }
        }

        if (!empty($warnings)) {
            return $this->displayConfigurationWarnings($warnings);
        }

        return '';
    }

    public function displayConfigurationWarnings($warning)
    {
        $this->context->smarty->assign([
            'warning_title' => $this->l('In order to use this module, you must complete the following steps:'),
            'warning_content' => $warning
        ]);

        return $this->context->smarty->fetch(_PS_MODULE_DIR_ . $this->name . '/views/templates/admin/configuration_warning.tpl');
    }

    ###################################################################
    ## Price management
    ###################################################################

    public function getOrderShippingCostExternal($cart)
    {
        return $this->getOrderShippingCost($cart, 0);
    }

    public function getOrderShippingCost($cart, $shipping_cost)
    {
        //maybe use cache
        //$cache_id = spl_object_hash($cart);
        if (!$this->pricesMbeLoaded) {
            $this->getPricesMbe($cart);
            $this->pricesMbeLoaded = true;
        }
        $result = 0;
        if (!empty($this->carriers)) {
            if (array_key_exists($this->id_carrier, $this->carriers)) {
                $price_in_euro = $this->carriers[(string)$this->id_carrier]['price'];
                $currency = new Currency($cart->id_currency);
                $result = Tools::convertPriceFull($price_in_euro, null, $currency);
            } else
                return false;
        }
        return $result;

    }

    public function getPricesMbe($cart)
    {
        if (!isset($_SESSION['loggedin']) && (isset($cart->id_address_delivery) ||
                isset($cart['cart']) && isset($cart['cart']->id_address_delivery))) {

            $carriers = Carrier::getCarriers($this->context->language->id, false, false, false,
                null, CarrierCore::PS_CARRIERS_ONLY, $cart);

            foreach ($carriers as $carrier) {
                $this->carriers[$carrier['id_carrier']] = $carrier;
            }
            return true;
        }
    }

    public function hookPostUpdateOrderStatus($params)
    {
        $this->hookActionOrderStatusPostUpdate($params);
    }

    public function hookActionOrderStatusPostUpdate($params)
    {
        // 2 è lo stato del pagamento accettato. (Inserire qui altri stati) todo: fix with constant if exists
        $helper = new DataHelper();

        if ($helper->isEnabled() &&
            Configuration::get('shipments_creation_mode') ==
            DataHelper::MBE_CREATION_MODE_AUTOMATICALLY) {
            $order_id = (int)$params['id_order'];
            $order = new Order($order_id);


            $cashOnDeliveryModuleName = $helper->getCashOnDeliveryModuleName();
            if ((in_array($params['newOrderStatus']->id, array(2)) && $order->module != $cashOnDeliveryModuleName) ||
                (in_array($params['newOrderStatus']->id, array(3)) && $order->module == $cashOnDeliveryModuleName)) {
                $cart = new Cart($order->id_cart);
                $carrier = new Carrier($order->id_carrier);

                if ($helper->isMbeShipping($order)) {
                    $this->getPricesMbe($cart);
                    $carrierCheck = $this->carriers[$order->id_carrier];
                    if (is_array($carrierCheck)) {
                        $service = Configuration::get('carrier_' . $order->id_carrier);
                        //$service empty custom mapping is enabled. Get the service by ctsom mapping
                        if (!$service || $service === '') {
                            $service = $helper->getCustomMappingService($carrier->id);
                        }
                        $orderHelper = new OrderHelper();
                        $orderHelper->addShipping($order, $service);
                    }
                }

            }
        }
    }

    private function getInitializedInputValues(...$arrays){
        $result = [];

        foreach ($arrays as $array) {
            foreach ($array['form']['input'] as $input) {
                if (isset($input['name'])) {
                    $result[$input['name']] = '';
                }
            }
        }

        return $result;
    }

    private function transJsString($string) {
        return Translate::getModuleTranslation(
            $this,
            $string,
            $this->name,
            null,
            true
        );
    }

    /*ACCESS POINT*/

    public function hookDisplayCarrierExtraContent($params)
    {
        $this->createContent($params);
        return $this->display(__FILE__, 'mbe_access_point_shipping.tpl');
    }

    private function createContent($params)
    {
        try {
            $helper = new DataHelper();
            $dataHelper = new DataHelper();

            $context = $this->context;

            $cart = isset($params['cart']) ? $params['cart'] : $context->cart;

            $carrier = isset($params['carrier']) ? $params['carrier'] : new Carrier($cart->id_carrier);

            if (version_compare(_PS_VERSION_, '1.7', '<')) {
                $carrierName = $carrier->name;
                $carrierId = $carrier->id;
            } else {
                $carrierName = $carrier['name'];
                $carrierId = $carrier['id'];
            }

            $uapList = null;
            $mbe_uap = false;

            if (strpos(Tools::strtolower($carrierName), '(mdp)') !== false ||
                $helper->isMBEDeliveryPoint($carrierName)) {
                $address = new Address($cart->id_address_delivery);
                $iso_code = Country::getIsoById($address->id_country);
                $mbe_uap = true;
                $uapList = UpsUapHelper::getUapList(array(
                    'AddressLine1' => $address->address1,
                    'PostcodePrimaryLow' => $address->postcode,
                    'PoliticalDivision2' => $address->city,
                    'PoliticalDivision1' => State::getNameById($address->id_state),
                    'CountryCode' => $iso_code,
                    'language' => 'IT',
                    'MaximumListSize' => '20',
                    'SearchRadius' => '20'
                ));
            }

            $this->context->smarty->assign(
                array(
                    'mbe_uap' => $mbe_uap,
                    'uapList' => $uapList,
                    'carrierId' => $carrierId,
                    'suap' => base64_encode($dataHelper->doSerialize($uapList))
                ));
        } catch (Exception $e) {
            //$this->log('CREATE CONTENT SMARTY EXCEPTION');
            //$this->log($e->getMessage());
        }
    }

    public function hookExtraCarrier($params)
    {
        $this->createContent($params);
        return $this->display(__FILE__, 'mbe_access_point_shipping-16.tpl');
    }

    public function hookActionValidateOrder($params)
    {
        $this->logger->logDebug('VALIDATE ORDER');
        $dataHelper = new DataHelper();

        try {

            $cart = isset($params['cart']) ? $params['cart'] : null;

            if ($cart != null)
                $this->logger->logDebug($cart->id, 'ID CART');
            else
                $this->logger->logDebug('CART NOT FOUND');

            $helper = new MdpHelper();
            $mbeUapDB = $helper->getMdpByCartId($cart->id);

            if ($mbeUapDB != null && count($mbeUapDB) > 0) {
                $mbeUap = $dataHelper->doUnserialize(base64_decode($mbeUapDB[0]["mdp"]));

                $cart = isset($params['cart']) ? $params['cart'] : null;
                $order = isset($params['order']) ? $params['order'] : null;
                //$carrier = new Carrier($cart->id_carrier);
                $service = Configuration::get('carrier_' . $cart->id_carrier);

                if ($service && $service == 'MDP') {
                    $this->logger->logDebug('IS MDP');
                    $this->logger->logDebug(base64_decode($mbeUapDB[0]["mdp"]), 'DELIVERY POINT SELECTED');

                    $address_delivery = new Address($cart->id_address_delivery);

                    $uapOrderAddress = clone $address_delivery;
                    $uapOrderAddress->id = null;
                    //$uapOrderAddress=new Address();//
                    //$uapOrderAddress->id_customer = $address_delivery->id_customer;//
                    $uapOrderAddress->company = $mbeUap['ConsigneeName'];
                    $uapOrderAddress->address1 = str_replace("\n", " ", $mbeUap['AddressLine']);
                    $uapOrderAddress->city = $mbeUap['PoliticalDivision2'];
                    //$uapOrderAddress->id_state = $address_delivery->id_state;//
                    //$uapOrderAddress->id_country = $address_delivery->id_country;//
                    $uapOrderAddress->postcode = $mbeUap['PostcodePrimaryLow'];
                    $uapOrderAddress->other = 'UAP';


                    //$uapOrderAddress->firstname = $address_delivery->firstname;//
                    //$uapOrderAddress->lastname = $address_delivery->lastname;//

                    $uapOrderAddress->phone = strlen($address_delivery->phone) > 0 ? $address_delivery->phone : $address_delivery->phone_mobile;

                    $uapOrderAddress->alias = 'UAP-' . $mbeUap['PublicAccessPointID'] . '-Cart' . $cart->id;

                    $uapOrderAddress->save();

                    $this->logger->logDebug($dataHelper->doSerialize($uapOrderAddress), 'NEW ADDRESS SAVED');

                    $cart->id_address_delivery = $uapOrderAddress->id;
                    $cart->update();

                    $this->logger->logDebug('NEW ADDRESS ASSIGNET TO CART');

                    $order->id_address_delivery = $uapOrderAddress->id;
                    $order->update();

                    $this->logger->logDebug('NEW ADDRESS ASSIGNET TO ORDER');

                    $uapOrderAddress->delete();

                    $this->logger->logDebug('NEW ADDRESS DELETED');
                } else {
                    $this->logger->logDebug('NON MDP SERVICES SELECTED');
                }
            }
        } catch (Exception $e) {
            $this->logger->logDebug('VALIDATE ORDER EXCEPTION');
            $this->logger->logDebug($e->getMessage());
        }
    }

    public function hookActionDispatcher($params)
    {
        if ($params["controller_class"] == "AdminCarrierWizardController") {
            $id_carrier = Tools::getValue('id_carrier');
            $carrier = new Carrier($id_carrier);

            if ($carrier->external_module_name == 'mbeshipping') {
                //Tools::redirectAdmin($this->context->link->getAdminLink('AdminModules') . '&configure=' . Tools::safeOutput("mbeshipping"));
                Tools::redirectAdmin($this->context->link->getAdminLink('AdminModules') . '&configure=' . $this->name);
            }
        }
    }
}
