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

namespace PrestaShop\Module\Mbeshipping;

use PrestaShop\Module\Mbeshipping\Helper\DataHelper;
use PrestaShop\Module\Mbeshipping\Helper\LoggerHelper;
use PrestaShop\Module\Mbeshipping\Helper\OrderHelper;
use PrestaShop\Module\Mbeshipping\Lib\MbeWs;

class Ws
{
    private $helper;
    protected $logger = null;
    private $ws;

    public function __construct()
    {
        $this->helper = new DataHelper();
        $this->logger = new LoggerHelper();

        $wsLogPath = _PS_MODULE_DIR_ . 'mbeshipping' . DIRECTORY_SEPARATOR . 'log';
        $this->ws = new MbeWs($wsLogPath);
    }

    public function getCustomer($forceUpdate = false)
    {
        if ($forceUpdate || is_null(\Configuration::get('MBECustomer')) || !\Configuration::get('MBECustomer')) {
            $result = false;

            $wsUrl = $this->helper->getWsUrl();
            $wsUsername = $this->helper->getWsUsername();
            $wsPassword = $this->helper->getWsPassword();
            $system = $this->helper->getCountry();

            $this->logger->logDebug('Customer not found in cache');
            if ($wsUrl && $wsUsername && $wsPassword) {
                $result = $this->ws->getCustomer($wsUrl, $wsUsername, $wsPassword, $system);
                $this->logger->logDebug($result, 'WS getCustomer');
            }

            return $result;
        } else {
            return json_decode(\Configuration::get('MBECustomer'));
        }
    }

    public function getCustomerPermission($permissionName)
    {
        $result = null;
        $customer = $this->getCustomer();
        if ($customer) {
            $result = $customer->Permissions->$permissionName;
        }

        return $result;
    }

    public function getAvailableOptions()
    {
        $wsUrl = $this->helper->getWsUrl();
        $wsUsername = $this->helper->getWsUsername();
        $wsPassword = $this->helper->getWsPassword();
        $result = false;
        if ($wsUrl && $wsUsername && $wsPassword) {
            $result = $this->ws->getAvailableOptions($wsUrl, $wsUsername, $wsPassword);
        }

        return $result;
    }

    public function getAllowedShipmentServices()
    {
        $result = array();
        $customer = $this->getCustomer();
        if ($customer && $customer->Enabled) {
            if (isset($customer->Permissions->enabledServices)) {
                $enabledServices = $customer->Permissions->enabledServices;
                $enabledServicesDesc = $customer->Permissions->enabledServicesDesc;

                $enabledServicesArray = explode(",", $enabledServices);
                $enabledServicesDescArray = explode(",", $enabledServicesDesc);

                for ($i = 0; $i < count($enabledServicesArray); $i++) {
                    $service = $enabledServicesArray[$i];
                    $serviceDesc = $enabledServicesDescArray[$i];

                    $serviceDesc .= ' (' . $service . ')';

                    $currentShippingType = array(
                        'value' => $service,
                        'label' => $serviceDesc,
                    );

                    if (!in_array($currentShippingType, $result)) {
                        array_push($result, $currentShippingType);
                    }

                    //SHIPPING WITH INSURANCE
                    if (isset($customer->Permissions->canSpecifyInsurance) &&
                        $customer->Permissions->canSpecifyInsurance) {
                        $currentShippingWithInsuranceType = array(
                            'value' => $this->helper->convertShippingCodeWithInsurance($service),
                            'label' => $this->helper->convertShippingLabelWithInsurance($serviceDesc),
                        );
                        if (!in_array($currentShippingWithInsuranceType, $result)) {
                            array_push($result, $currentShippingWithInsuranceType);
                        }
                    }
                }
            }
        }
        return $result;
    }

    public function getLabelFromShipmentType($shipmentCode)
    {
        $result = $shipmentCode;
        $allowedShipmentServices = $this->getAllowedShipmentServices();
        foreach ($allowedShipmentServices as $allowedShipmentService) {
            if ($allowedShipmentService["value"] == $shipmentCode) {
                $result = $allowedShipmentService["label"];
                break;
            }
        }
        return $result;
    }

    private function convertInsuranceShipping($shippingList)
    {
        $result = false;
        if ($shippingList) {
            $newShippingList = array();
            foreach ($shippingList as $shipping) {
                if ($shipping->InsuranceAvailable) {
                    $newShipping = $shipping;
                    $newShipping->Service = $this->helper->convertShippingCodeWithInsurance($newShipping->Service);
                    $newShipping->ServiceDesc =
                        $this->helper->convertShippingLabelWithInsurance($newShipping->ServiceDesc);
                    array_push($newShippingList, $newShipping);
                }
            }
            if (!empty($newShippingList)) {
                $result = $newShippingList;
            }
        }
        return $result;
    }

    public function estimateShipping(
        $country,
        $region,
        $postCode,
        $weight,
        $boxes,
        $insuranceValue,
        $allowedShipmentServicesArray
    ) {
        $this->logger->logDebug('ESTIMATESHIPPING');
        $wsUrl = $this->helper->getWsUrl();
        $wsUsername = $this->helper->getWsUsername();
        $wsPassword = $this->helper->getWsPassword();
        $system = $this->helper->getCountry();

        $result = false;

        if ($wsUrl && $wsUsername && $wsPassword) {
            $length = $this->helper->getDefaultLength();
            $width = $this->helper->getDefaultWidth();
            $height = $this->helper->getDefaultHeight();

            $shipmentType = $this->helper->getDefaultShipmentType();

            $items = $this->setItems($weight);


            $this->logger->logDebug($items, 'ESTIMATESHIPPING ITEMS');

            //Shipping without insurance
            $resultWithoutInsurance = $this->ws->estimateShipping(
                $wsUrl,
                $wsUsername,
                $wsPassword,
                $shipmentType,
                $system,
                $country,
                $region,
                $postCode,
                $items,
                false,
                $insuranceValue
            );

            //Shipping with insurance
            if (preg_match("/INSURANCE/", var_export($allowedShipmentServicesArray, true))) {
                $resultWithInsurance = $this->ws->estimateShipping(
                    $wsUrl,
                    $wsUsername,
                    $wsPassword,
                    $shipmentType,
                    $system,
                    $country,
                    $region,
                    $postCode,
                    $items,
                    true,
                    $insuranceValue
                );
                $resultWithInsurance = $this->convertInsuranceShipping($resultWithInsurance);
            } else {
                $resultWithInsurance = null;
            }

            if ($resultWithInsurance && $resultWithoutInsurance) {
                $result = array_merge($resultWithInsurance, $resultWithoutInsurance);
            } else {
                if ($resultWithInsurance) {
                    $result = $resultWithInsurance;
                }
                if ($resultWithoutInsurance) {
                    $result = $resultWithoutInsurance;
                }
            }
        }
        return $result;
    }


    public function createShipping(
        $country,
        $region,
        $postCode,
        $weight,
        $boxes,
        $products,
        $service,
        $notes,
        $firstName,
        $lastName,
        $companyName,
        $address,
        $phone,
        $city,
        $email,
        $goodsValue = 0.0,
        $reference = "",
        $isCod = false,
        $codValue = 0.0,
        $insurance = false,
        $insuranceValue = 0.0,
        $uap = false,
        $uapID = -1
    ) {
        $this->logger->logDebug('CREATE SHIPPING');
        $wsUrl = $this->helper->getWsUrl();
        $wsUsername = $this->helper->getWsUsername();
        $wsPassword = $this->helper->getWsPassword();
        $system = $this->helper->getCountry();
        $result = false;
        if ($wsUrl && $wsUsername && $wsPassword) {
            $length = $this->helper->getDefaultLength();
            $width = $this->helper->getDefaultWidth();
            $height = $this->helper->getDefaultHeight();

            $shipmentType = $this->helper->getDefaultShipmentType();

            $items = $this->setItems($weight);

            $this->logger->logDebug('CREATE SHIPPING ITEMS');
            $this->logger->logDebug($items);

            $shipperType = $this->getShipperType();
            $notes = mb_substr($notes, 0, 50, 'utf8');
            $result = $this->ws->createShipping(
                $wsUrl,
                $wsUsername,
                $wsPassword,
                $shipmentType,
                $service,
                $system,
                $notes,
                $firstName,
                $lastName,
                $companyName,
                $address,
                $phone,
                $city,
                $region,
                $country,
                $postCode,
                $email,
                $items,
                $products,
                $shipperType,
                $goodsValue,
                $reference,
                $isCod,
                $codValue,
                $insurance,
                $insuranceValue,
                $uap,
                $uapID
            );
        }
        return $result;
    }

    public function getShipperType()
    {
        //COURIERLDV or MBE
        $customer = $this->getCustomer();
        $shipperType = "MBE";
        if ($customer->Permissions->canCreateCourierWaybill) {
            $shipperType = "COURIERLDV";
        }

        return $shipperType;
    }

    public function mustCloseShipments()
    {
        $result = true;
        $customer = $this->getCustomer();
        if ($customer->Permissions->canCreateCourierWaybill) {
            $result = false;
        }
        return $result;
    }

    public function getCustomerMaxParcelWeight()
    {
        $customer = $this->getCustomer();
        return $customer->Permissions->maxParcelWeight;
    }

    public function getCustomerMaxShipmentWeight()
    {
        $customer = $this->getCustomer();
        return $customer->Permissions->maxShipmentWeight;
    }

    public function isCustomerActive()
    {
        $result = false;
        $customer = $this->getCustomer();
        if ($customer) {
            $result = $customer->Enabled;
        }
        return $result;
    }

    public function closeShipping(array $shipmentIds)
    {
        $orderHelper =  new OrderHelper();
        $trackingNumbers = array();

        foreach ($shipmentIds as $shipmentId) {
            $shipment = new \Order((int)$shipmentId);
            $oc = $this->helper->getOrderCarrier((int)$shipmentId);

            $tracks = array_filter(
                explode(
                    DataHelper::MBE_SHIPPING_TRACKING_SEPARATOR,
                    $oc->tracking_number
                ),
                function ($value) {
                    return $value !== '';
                }
            );
            foreach ($tracks as $track) {
                if (strpos($track, 'RETURN') == false) {
                    array_push($trackingNumbers, $track);
                }
            }
            $order = new \Order($shipmentId);
            $orderHelper->setOrderShipped($order);
        }
        $this->closeTrackingNumbers($trackingNumbers);
    }

    public function closeTrackingNumbers(array $trackingNumbers)
    {
        $this->logger->logDebug('CLOSE SHIPPING');

        $wsUrl = $this->helper->getWsUrl();
        $wsUsername = $this->helper->getWsUsername();
        $wsPassword = $this->helper->getWsPassword();
        $system = $this->helper->getCountry();

        $result = false;

        if ($wsUrl && $wsUsername && $wsPassword) {
            $result = $this->ws->closeShipping($wsUrl, $wsUsername, $wsPassword, $system, $trackingNumbers);

            if ($result) {
                foreach ($trackingNumbers as $trackingNumber) {
                    $filePath = $this->helper->getTrackingFilePath($trackingNumber);
                    if (base64_encode(base64_decode($result->Pdf, true)) === $result->Pdf) {
                        $fileStream = base64_decode($result->Pdf);
                    } else {
                        $fileStream = $result->Pdf;
                    }
                    file_put_contents($filePath, $fileStream);
                }
            }
        }

        return $result;
    }

    public function setItems($boxesWeight)
    {
        $items = [];
        foreach ($boxesWeight as $box) {
            foreach ($box['weight'] as $weight) {
                $item = new \stdClass;
                $item->Weight = $weight;
                $item->Dimensions = new \stdClass;
                $item->Dimensions->Lenght = $box['dimensions']['length'];
                $item->Dimensions->Height = $box['dimensions']['height'];
                $item->Dimensions->Width = $box['dimensions']['width'];
                $items[] = $item;
            }
        }
        return $items;
    }

    public function createReturnShipping($tracking)
    {
        $this->logger->logDebug('CREATE RETURN SHIPPING');

        $wsUrl = $this->helper->getWsUrl();
        $wsUsername = $this->helper->getWsUsername();
        $wsPassword = $this->helper->getWsPassword();
        $system = $this->helper->getCountry();
        $result = false;
        if ($wsUrl && $wsUsername && $wsPassword) {
            $result = $this->ws->createReturnShipping($wsUrl, $wsUsername, $wsPassword, $system, $tracking);
        }
        return $result;
    }
}
