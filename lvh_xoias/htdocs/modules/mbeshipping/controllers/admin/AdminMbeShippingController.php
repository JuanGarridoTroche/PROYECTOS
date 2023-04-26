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

use iio\libmergepdf\Driver\TcpdiDriver;
use iio\libmergepdf\Merger;
use PrestaShop\Module\Mbeshipping\Ws;

if (!defined('_PS_VERSION_')) {
    exit;
}

class AdminMbeShippingController extends ModuleAdminController
{
    private $shipping_creation_errors = [
        'SR_002' => [
            'Department is mandatory for the current MBE Online user, but not provided'
        ],
        'SR_005' => [
            'Internal error',
            'The department ID provided mismatch the user configuration',
            'Provided service code is not alligned with elink old codes setting (provided non-numeric value)',
            'elink MBE service code not found',
            'Customer address not found'
        ],
        'SR_006' => [
            'Unexpected error  [companyName: Object must not be empty, addressTo.companyName: Object must not be empty]',
            'Connection reset',
            'Unexpected error  [State or CountryName: may not be null, countryName: may not be null]',
            'SmartChoice/courier not found for the specific combination. Check the SmartChoice configuration',
            'The courier account may not be null or empty',
            'Combination of zone, service and courier not allowed  [Combination of zone, service and courier not allowed]',
            'Transport error: 401 Error: Unauthorized',
            'Unexpected error  [city: Object must not be empty, addressTo.city: Object must not be empty]',
            'Delivery address:  town could not be found',
            'The address format is wrong  [Replace ? with \']',
            'Missing extra service of return type',
            'la provincia e\'\' obbligatoria destinatario.provincia',
            'Delivery address:  postcode matches more than one town',
            'Missing good description',
            'ShipTo phone number cannot be more than 15 digits long',
            'The email format is wrong',
            'The field \'receiver.phoneNumber\' is not a valid phone number.\\n',
            '(zip code / city) doesn\'t exist.\\n',
            'The province of the address may not be null or empty',
            'Postcode not found. Expected formats: KR - 99999(5)',
            'Not allowed a shipment with one dimension 0',
            'ShipTo EmailAddress is an invalid format',
            'Missing or invalid ship to phone number',
            'Shipment profit not found',
            'Unexpected error'
        ],
        'SR_007' => [
            'Read timed out executing POST http://shipments:8080/shipments/e-link'
        ],
    ];
    private $shipping_creation_errors_translated;

    public function __construct()
    {
        $this->module = Module::getInstanceByName('mbeshipping');

        if (\Tools::getIsset('creationorder')) {
            $this->creationShipment();
        }

        if (\Tools::getIsset('returnorder')) {
            $this->creationReturnShipment();
        }

        if (\Tools::getIsset('submitAction') &&
            \Tools::getValue('submitAction') == 'generateDelivery') {
            $this->generateDelivery(\Tools::getValue('id_order'));
        }

        if (_PS_VERSION_ >= 1.7) {
            $this->translator = \Context::getContext()->getTranslator();
        }

        $dataHelper = new PrestaShop\Module\Mbeshipping\Helper\DataHelper();

        $this->bootstrap = true;
        $this->table = 'order';
        $this->className = 'Order';
        $this->lang = false;
        $this->allow_export = true;
        $this->list_no_link = true;
        $this->context = \Context::getContext();

        $this->_select = 'a.date_add, oc.tracking_number, CONCAT(c.`firstname`, \' \', c.`lastname`) AS `customer`,
        o.`reference` , o.`id_order` AS `buttons`, o.`id_order` as status, IF(mso.`id_order` IS NULL,\'null\',mso.`is_download_available`) as `is_download_available`';
        $this->_join = ' LEFT JOIN `' . _DB_PREFIX_ . 'customer` c ON (c.`id_customer` = a.`id_customer`) ';
        $this->_join .= ' LEFT JOIN `' . _DB_PREFIX_ . 'orders` o ON (o.`id_order` = a.`id_order`) ';
        //FOR LDV DOWNLOAD
        $this->_join .= ' LEFT JOIN `' . _DB_PREFIX_ . 'mbe_shipping_order` mso ON (mso.`id_order` = o.`id_order`)';
        $this->_join .= ' INNER JOIN `' . _DB_PREFIX_ . 'order_carrier` oc ON (o.`id_order` = oc.`id_order`)';

        if ($dataHelper->isEnabledCustomMapping()) {
            $customMapping = $dataHelper->getCustomMappingCarriers();
            $this->_join .= ' AND (oc.`id_carrier` IN (' . pSQL(implode(',', $customMapping)) . ') OR oc.`id_carrier` IN 
            (SELECT `id_carrier` from `' . _DB_PREFIX_ . 'carrier` where `external_module_name` = "mbeshipping"))';
        } else {
            $this->_join .= ' AND oc.`id_carrier` IN (SELECT `id_carrier` from `' . _DB_PREFIX_ . 'carrier` 
            where `external_module_name` = "mbeshipping")';
        }

        $this->_join .= ' INNER JOIN `' . _DB_PREFIX_ . 'carrier` ca ON (ca.`id_carrier` = oc.`id_carrier`)';
        $this->_where = 'AND (oc.tracking_number<>\'\' OR  o.current_state NOT IN (6))';
        $this->_defaultOrderBy = 'a.date_add';
        $this->_defaultOrderWay = 'DESC';

        $ws = new Ws();
        $mustClose = $ws->mustCloseShipments();
        if ($mustClose) {
            if (Configuration::get('shipments_closure_mode') ==
                PrestaShop\Module\Mbeshipping\Helper\DataHelper::MBE_CLOSURE_MODE_MANUALLY) {
                $this->bulk_actions = array(
                    'sended' => array('text' => $this->module->l('Close', 'AdminMbeShippingController'),
                        'confirm' => str_replace("'", "\'",
                            $this->module->l('Are you sure?', 'AdminMbeShippingController'))),
                );
            }
        }
        $this->addRowAction('detail');
        if (Configuration::get('shipments_creation_mode') ==
            PrestaShop\Module\Mbeshipping\Helper\DataHelper::MBE_CREATION_MODE_MANUALLY) {
            $this->addRowAction('creation');
            $this->bulk_actions['creation'] = [
                'text' => $this->module->l('Creation', 'AdminMbeShippingController'),
                'confirm' => str_replace("'", "\'", $this->module->l('Do you want create shipments?', 'AdminMbeShippingController'))
            ];
        }
        $this->addRowAction('return');

        $this->bulk_actions['download'] = [
            'text' => $this->module->l('Download', 'AdminMbeShippingController'),
            ''
        ];

        $this->fields_list = [];

        $this->fields_list['reference'] = [
            'title' => $this->module->l('Reference', 'AdminMbeShippingController'),
            'filter_key' => 'o!reference',
            'align' => 'text-left'
        ];
        if ($mustClose) {
            $this->fields_list['status'] = [
                'title' => $this->module->l('Status', 'AdminMbeShippingController'),
                'filter_key' => 'status',
                'callback' => 'checkClose',
                'search' => false,
                'orderby' => false,
                'align' => 'text-left'
            ];
        }
        $this->fields_list['customer'] = [
            'title' => $this->module->l('Customer', 'AdminMbeShippingController'),
            'havingFilter' => true,
            'align' => 'text-left'
        ];
        $this->fields_list['payment'] = [
            'title' => $this->module->l('Payment', 'AdminMbeShippingController'),
            'filter_key' => 'o!payment',
            'align' => 'text-left'
        ];
        $this->fields_list['date_add'] = [
            'title' => $this->module->l('Request date', 'AdminMbeShippingController'),
            'align' => 'text-right',
            'type' => 'datetime',
            'filter_key' => 'a!date_add'
        ];
        $this->fields_list['total_paid_tax_incl'] = [
            'title' => $this->module->l('Total', 'AdminMbeShippingController'),
            'filter_key' => 'o!total_paid_tax_incl',
            'align' => 'text-center'
        ];
        $this->fields_list['id_carrier'] = [
            'title' => $this->module->l('Carrier', 'AdminMbeShippingController'),
            'filter_key' => 'ca!name',
            'align' => 'text-center',
            'callback' => 'getCarrierName'
        ];
        $this->fields_list['tracking_number'] = [
            'title' => $this->module->l('Tracking', 'AdminMbeShippingController'),
            //'filter' => false,
            //'search' => false,
            'orderby' => true,
            'align' => 'text-center',
            'callback' => 'getTracking',
            'filter_key' => 'oc!tracking_number', 'AdminMbeShippingController',
        ];
        $this->fields_list['buttons'] = [
            'title' => $this->module->l('PDF', 'AdminMbeShippingController'),
            'align' => 'text-center',
            'callback' => 'printPDFIconsButton',
            'orderby' => false,
            'search' => false,
            'filter_key' => 'o!id_order',
            'remove_onclick' => true
        ];

        parent::__construct();
    }

    public function creationShipment()
    {
        $idOrder = \Tools::getValue('id_order');
        if ($idOrder) {
            /**
             * @var $order OrderCore
             */
            $helper = new PrestaShop\Module\Mbeshipping\Helper\DataHelper();
            $order = new \Order($idOrder);
            $oc = $helper->getOrderCarrier($idOrder);

            if ($oc->tracking_number != '') {
                $this->errors[] = \Tools::displayError($this->module->l('The shipment was already created',
                    'AdminMbeShippingController'));
            } else {
                $service = \Configuration::get('carrier_' . $order->id_carrier);
                if (!$service || $service === '') {
                    $carrier = new \Carrier($order->id_carrier);
                    $service = $helper->getCustomMappingService($carrier->id);
                }
                $orderHelper = new PrestaShop\Module\Mbeshipping\Helper\OrderHelper();
                $errors = $orderHelper->addShipping($order, $service);
                //if (isset($order->_errors) && is_array($order->_errors) && count($order->_errors)) {
                if (isset($errors) && is_array($errors) && count($errors)) {
                    $this->errors = $this->renderErrors();
                } else {
                    $this->confirmations[] = $this->module->l('The shipment was successfully created',
                        'AdminMbeShippingController');
                }
            }
        }
    }

    private function renderErrors()
    {
        $this->initErrors();

        $conf = \Configuration::get('MBESHIPPING_CREATE_SHIPPING_ERRORS');

        $errors = [];

        if (!empty($conf)) {
            $conf_errors = json_decode($conf, true);
            foreach ($conf_errors as $reference => $arr) {
                if (array_key_exists($arr['code'], $this->shipping_creation_errors)) {
                    if (in_array($arr['description'], $this->shipping_creation_errors[$arr['code']])) {
                        $index = array_search($arr['description'], $this->shipping_creation_errors[$arr['code']]);
                        $errors[] = $this->module->l('Order', 'AdminMbeShippingController') . ' ' . $reference . ': ' . $this->shipping_creation_errors_translated[$arr['code']][$index];
                    } else {
                        $errors[] = $this->module->l('Order', 'AdminMbeShippingController') . ' ' . $reference . ': ' . $arr['description'];
                    }
                } else {
                    $errors[] = $this->module->l('Order', 'AdminMbeShippingController') . ' ' . $reference . ': ' . $arr['description'];
                }
            }
        }

        \Configuration::deleteByName('MBESHIPPING_CREATE_SHIPPING_ERRORS');

        return $errors;
    }

    public function creationReturnShipment()
    {
        $idOrder = \Tools::getValue('id_order');
        if ($idOrder) {
            /**
             * @var $order OrderCore
             */
            $helper = new PrestaShop\Module\Mbeshipping\Helper\DataHelper();
            $order = new \Order($idOrder);
            $oc = $helper->getOrderCarrier($idOrder);

            if ($oc->tracking_number != '') {
                if (strpos($oc->tracking_number, 'RETURN') !== false) {
                    $this->confirmations[] =
                        $this->module->l('1 - Total of 1 return shipments were already created',
                            'AdminMbeShippingController');
                } else {
                    $orderHelper = new PrestaShop\Module\Mbeshipping\Helper\OrderHelper();
                    $errors = $orderHelper->addReturnShipping($order, $oc->tracking_number);
                    if (isset($errors) && is_array($errors) && count($errors)) {
                        $this->errors = $errors;
                    } else {
                        $this->confirmations[] =
                            $this->module->l('1 - Total of 1 return shipments created',
                                'AdminMbeShippingController');
                    }
                }
            }
        }
    }

    public function generateDelivery($id_order)
    {
        $helper = new PrestaShop\Module\Mbeshipping\Helper\DataHelper();
        $orderHelper = new PrestaShop\Module\Mbeshipping\Helper\OrderHelper();
        $order = new \Order((int)$id_order);
        if (!Validate::isLoadedObject($order)) {
            throw new PrestaShopException('Can\'t load Order object');
        }

        $oc = $helper->getOrderCarrier($id_order);
        $ts = explode(PrestaShop\Module\Mbeshipping\Helper\DataHelper::MBE_SHIPPING_TRACKING_SEPARATOR, $oc->tracking_number);
        $filenames = array();
        foreach ($ts as $t) {
            if (strpos($t, 'RETURN') == false) {
                $filenames[] = $helper->getMediaPath() . $orderHelper->getFileName($order, $t);
            }
        }

        $helper->generateDelivery($filenames);
    }

    public function initErrors()
    {
        $this->shipping_creation_errors_translated = [
            'SR_002' => [
                $this->module->l('Department is mandatory for the current MBE Online user, but not provided', 'AdminMbeShippingController')
            ],
            'SR_005' => [
                $this->module->l('Internal error', 'AdminMbeShippingController'),
                $this->module->l('The department ID provided mismatch the user configuration', 'AdminMbeShippingController'),
                $this->module->l('Provided service code is not alligned with elink old codes setting (provided non-numeric value)', 'AdminMbeShippingController'),
                $this->module->l('elink MBE service code not found', 'AdminMbeShippingController'),
                $this->module->l('Customer address not found', 'AdminMbeShippingController')
            ],
            'SR_006' => [
                $this->module->l('Unexpected error  [companyName: Object must not be empty, addressTo.companyName: Object must not be empty]', 'AdminMbeShippingController'),
                $this->module->l('Connection reset', 'AdminMbeShippingController'),
                $this->module->l('Unexpected error  [State or CountryName: may not be null, countryName: may not be null]', 'AdminMbeShippingController'),
                $this->module->l('SmartChoice/courier not found for the specific combination. Check the SmartChoice configuration', 'AdminMbeShippingController'),
                $this->module->l('The courier account may not be null or empty', 'AdminMbeShippingController'),
                $this->module->l('Combination of zone, service and courier not allowed  [Combination of zone, service and courier not allowed]', 'AdminMbeShippingController'),
                $this->module->l('Transport error: 401 Error: Unauthorized', 'AdminMbeShippingController'),
                $this->module->l('Unexpected error  [city: Object must not be empty, addressTo.city: Object must not be empty]', 'AdminMbeShippingController'),
                $this->module->l('Delivery address:  town could not be found', 'AdminMbeShippingController'),
                $this->module->l('The address format is wrong  [Replace ? with \']', 'AdminMbeShippingController'),
                $this->module->l('Missing extra service of return type', 'AdminMbeShippingController'),
                $this->module->l('la provincia e\'\' obbligatoria destinatario.provincia', 'AdminMbeShippingController'),
                $this->module->l('Delivery address:  postcode matches more than one town', 'AdminMbeShippingController'),
                $this->module->l('Missing good description', 'AdminMbeShippingController'),
                $this->module->l('ShipTo phone number cannot be more than 15 digits long', 'AdminMbeShippingController'),
                $this->module->l('The email format is wrong', 'AdminMbeShippingController'),
                $this->module->l('The field \'receiver.phoneNumber\' is not a valid phone number.\\n', 'AdminMbeShippingController'),
                $this->module->l('(zip code / city) doesn\'t exist.\\n', 'AdminMbeShippingController'),
                $this->module->l('The province of the address may not be null or empty', 'AdminMbeShippingController'),
                $this->module->l('Postcode not found. Expected formats: KR - 99999(5)', 'AdminMbeShippingController'),
                $this->module->l('Not allowed a shipment with one dimension 0', 'AdminMbeShippingController'),
                $this->module->l('ShipTo EmailAddress is an invalid format', 'AdminMbeShippingController'),
                $this->module->l('Missing or invalid ship to phone number', 'AdminMbeShippingController'),
                $this->module->l('Shipment profit not found', 'AdminMbeShippingController'),
                $this->module->l('Unexpected error', 'AdminMbeShippingController')
            ],
            'SR_007' => [
                $this->module->l('Read timed out executing POST http://shipments:8080/shipments/e-link', 'AdminMbeShippingController')
            ],
        ];
    }

    public function checkClose($value)
    {
        $helper = new PrestaShop\Module\Mbeshipping\Helper\DataHelper();

        if ($helper->isShippingOpen($value)) {
            $label = $this->module->l('Opened', 'AdminMbeShippingController');
        } else {
            $label = $this->module->l('Closed', 'AdminMbeShippingController');
        }
        return $label;
    }

    public function printPDFIconsButton($id_order, $tr)
    {
        static $valid_order_state = array();
        $helper = new PrestaShop\Module\Mbeshipping\Helper\DataHelper();
        $order = new \Order($id_order);
        $order_carrier = $helper->getOrderCarrier($id_order);
        if (!\Validate::isLoadedObject($order)) {
            return '';
        }

        if (!isset($valid_order_state[$order->current_state])) {
            $valid_order_state[$order->current_state] = \Validate::isLoadedObject($order->getCurrentOrderState());
        }

        if (!$valid_order_state[$order->current_state]) {
            return '';
        }

        $href = '';

        $ws = new Ws();
        $mustClose = $ws->mustCloseShipments();

        if ($mustClose) {
            if (ltrim($order_carrier->tracking_number) != '') {
                $arr = explode(PrestaShop\Module\Mbeshipping\Helper\DataHelper::MBE_SHIPPING_TRACKING_SEPARATOR,
                    ltrim($order_carrier->tracking_number));
                $t = reset($arr);
                if ($helper->getTrackingStatus($t) == PrestaShop\Module\Mbeshipping\Helper\DataHelper::MBE_SHIPMENT_STATUS_CLOSED) {
                    $files[] = $helper->getTrackingFilePath($t);
                    $href = \Context::getContext()->link->getModuleLink('mbeshipping', 'mbeaction', array('files' => $files));
                    //$href = __PS_BASE_URI__ . 'modules/mbeshipping/pdf.php?files[]=' . $helper->getTrackingFilePath($t);
                }
            }
        }

        // If it isn't available LDV Download remove Href url.
        $is_download_available = null;
        if($tr['is_download_available'] != 'null') {
            $is_download_available = $tr['is_download_available'];
        }

        $this->context->smarty->assign(array(
            'is_download_available' => $is_download_available,
            'order' => $order,
            'order_carrier' => $order_carrier,
            'href' => $href,
            'tr' => $tr,
        ));

        if (version_compare(_PS_VERSION_, '1.6', '<')) {
            return $this->createTemplate('controllers/orders/_print_pdf_icon15.tpl')->fetch();
        } else {
            return $this->createTemplate('controllers/orders/_print_pdf_icon.tpl')->fetch();
        }
    }

    public function displayDetailLink($token, $id)
    {
        $controller = "AdminOrders";
        $identifier = "id_order";
        $table = "order";

        $url = $this->context->link->getAdminLink($controller, true, [],
            ['id_order' => $id, 'vieworder' => 1]);

        if (version_compare(_PS_VERSION_, '1.7.8', '<')) {
            $url .= '&' . $identifier . '=' . $id . '&view' . $table;
        }

        $tpl = $this->createTemplate('list_action_detail.tpl');
        $tpl->assign(array(
            'href' => $url,
            'action' => $this->module->l('Show', 'AdminMbeShippingController'),
        ));

        return $tpl->fetch();
    }

    public function displayCreationLink($token, $id)
    {
        $controller = "AdminMbeShipping";
        $identifier = "id_order";
        $table = "order";

        $url = $this->context->link->getAdminLink($controller) . '&' . $identifier . '=' . $id . '&creation' . $table;

        $helper = new PrestaShop\Module\Mbeshipping\Helper\DataHelper();

        $tpl = $this->createTemplate('list_action_creation.tpl');
        $tpl->assign(array(
            'href' => $url,
            'action' => $this->module->l('Create shipment', 'AdminMbeShippingController'),
        ));

        return $tpl->fetch();
    }

    public function displayReturnLink($token, $id)
    {
        $controller = "AdminMbeShipping";
        $identifier = "id_order";
        $table = "order";

        $url = $this->context->link->getAdminLink($controller) . '&' . $identifier . '=' . $id . '&return' . $table;

        $helper = new PrestaShop\Module\Mbeshipping\Helper\DataHelper();
        $wsdl = $helper->getWsUrl();
        $isOnlineMBE = false;
        if (strpos(strtolower($wsdl), 'onlinembe') == false) {
            $tpl = $this->createTemplate('list_action_return.tpl');
            $tpl->assign(array(
                'href' => $url,
                'action' => $this->module->l('Create return shipment', 'AdminMbeShippingController')
            ));
            return $tpl->fetch();
        }
    }

    public function getTracking($value)
    {
        $values = explode(PrestaShop\Module\Mbeshipping\Helper\DataHelper::MBE_SHIPPING_TRACKING_SEPARATOR, $value);
        $html = '';
        foreach ($values as $v) {
            $html .= $v . "</br>";
        }
        return $html;
    }

    public function getShipmentStatus($value)
    {
        $carrier = new \Carrier($value);
        return $carrier->name;
    }

    public function getCarrierName($value)
    {
        $carrier = new \Carrier($value);
        return $carrier->name;
    }

    protected function processBulkCreation()
    {
        if (is_array($this->boxes) && !empty($this->boxes)) {
            $toCreationIds = array();
            $alreadyCreatedIds = array();
            foreach ($this->boxes as $idOrder) {
                $order = new \Order($idOrder);
                $oc = new \OrderCarrier($idOrder);
                if ($oc->tracking_number != '') {
                    array_push($alreadyCreatedIds, $idOrder);
                } else {
                    $service = \Configuration::get('carrier_' . $order->id_carrier);
                    if (!$service || $service === '') {
                        $helper = new PrestaShop\Module\Mbeshipping\Helper\DataHelper();
                        $carrier = new \Carrier($order->id_carrier);
                        $service = $helper->getCustomMappingService($carrier->id);
                    }
                    $orderHelper = new PrestaShop\Module\Mbeshipping\Helper\OrderHelper();
                    $errors = $orderHelper->addShipping($order, $service);
                    if (isset($errors) && is_array($errors) && count($errors)) {
                        $this->errors = $errors;
                    } else {
                        array_push($toCreationIds, $idOrder);
                    }
                }
            }

            $this->errors = $this->renderErrors();

            if (count($toCreationIds) > 0) {
                $this->confirmations[] = sprintf($this->module->l('Total of %d shipment(s) have been created.',
                    'AdminMbeShippingController'), count($toCreationIds));
            }

            if (count($alreadyCreatedIds) > 1) {
                $this->errors[] = sprintf($this->module->l('Total of %d shipment(s) was already created.',
                    'AdminMbeShippingController'), count($alreadyCreatedIds));
            }
        } else {
            $this->errors[] = \Tools::displayError($this->module->l('Please select items.',
                'AdminMbeShippingController'));
        }
    }

    protected function processBulkSended()
    {
        if (is_array($this->boxes) && !empty($this->boxes)) {
            $toClosedIds = array();
            $alreadyClosedIds = array();

            $helper = new PrestaShop\Module\Mbeshipping\Helper\DataHelper();

            $ws = new Ws();

            foreach ($this->boxes as $shipmentId) {
                if ($helper->isShippingOpen($shipmentId)) {
                    array_push($toClosedIds, $shipmentId);
                    $tracks = $helper->getTrackings($shipmentId);
                } else {
                    array_push($alreadyClosedIds, $shipmentId);
                }
            }

            $ws->closeShipping($toClosedIds);


            if (!empty($tracks)) {
                $filePath[] = $helper->getTrackingFilePath(reset($tracks));
                if (file_exists($filePath)) {
                    $url = \Context::getContext()->link->getModuleLink('mbeshipping', 'mbeaction', array('files' => $filePath));
                    $html = "<a target='_blank' href='" . $url . "'>" .
                        $this->module->l('here', 'AdminMbeShippingController') . "</a>";
                    $this->confirmations[] = sprintf($this->module->l('To download file click %s.',
                        'AdminMbeShippingController'), $html);
                }
            }

            if (count($toClosedIds) > 0) {
                $this->confirmations[] = sprintf($this->module->l('Total of %d shipment(s) have been closed.',
                    'AdminMbeShippingController'), count($toClosedIds));
            }

            if (count($alreadyClosedIds) > 1) {
                $this->confirmations[] = sprintf($this->module->l('Total of %d shipment(s) was already closed.',
                    'AdminMbeShippingController'), count($alreadyClosedIds));
            }
        } else {
            $this->errors[] = \Tools::displayError($this->module->l('Please select items.',
                'AdminMbeShippingController'));
        }
    }

    protected function processBulkDownload()
    {
        if (is_array($this->boxes) && !empty($this->boxes)) {
            $noTracking = array();
            $whitTracking = array();
            $helper = new PrestaShop\Module\Mbeshipping\Helper\DataHelper();
            $orderHelper = new PrestaShop\Module\Mbeshipping\Helper\OrderHelper();
            $filenames = array();
            foreach ($this->boxes as $shipmentId) {
                if ($helper->hasTracking($shipmentId)) {
                    array_push($whitTracking, $shipmentId);

                    $order = new \Order((int)$shipmentId);
                    if (!\Validate::isLoadedObject($order)) {
                        throw new PrestaShopException('Can\'t load Order object');
                    }

                    $oc = $helper->getOrderCarrier($shipmentId);
                    $ts = explode(PrestaShop\Module\Mbeshipping\Helper\DataHelper::MBE_SHIPPING_TRACKING_SEPARATOR, $oc->tracking_number);
                    foreach ($ts as $t) {
                        if (strpos($t, 'RETURN') == false) {
                            $filenames[] = $helper->getMediaPath() . $orderHelper->getFileName($order, $t);
                        }
                    }
                } else {
                    array_push($noTracking, $shipmentId);
                }
            }
            $labelsPdf = $helper->generateDeliveryForBulk($filenames);

            if (!empty($labelsPdf)) {
                $outputPdf = $this->combineLabelsPdf($labelsPdf);
                $outputPdfPath = $helper->getMediaPath() . getdate()[0] . rand(0, 999) . '.pdf';
                if (file_put_contents($outputPdfPath, $outputPdf) !== false) {
                    header('Content-Description: File Transfer');
                    header('Content-Type: application/pdf');
                    header("Content-Disposition: attachment; filename=mbe-labels.pdf");
                    header('Content-Transfer-Encoding: binary');
                    header('Expires: 0');
                    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
                    header('Pragma: public');
                    header('Content-Length: ' . filesize($outputPdfPath));
                    if (ob_get_length() > 0) {
                        ob_clean();
                    }
                    flush();
                    readfile($outputPdfPath);
                    if (is_file($outputPdfPath))
                        unlink($outputPdfPath);
                    // exit;
                } else {
                    $errMess = __('MBE Download shipping labels - error writing to file ' . $outputPdfPath);
                    $this->logger->log($errMess);
                }
            }
        } else {
            $this->errors[] = \Tools::displayError($this->module->l('Please select items.',
                'AdminMbeShippingController'));
        }
    }

    public function combineLabelsPdf(array $labelsContent)
    {
        $outputPdf = new Merger(new TcpdiDriver());
        foreach ($labelsContent as $item) {
            $outputPdf->addRaw($item);
        }
        return $outputPdf->merge();
    }
}
