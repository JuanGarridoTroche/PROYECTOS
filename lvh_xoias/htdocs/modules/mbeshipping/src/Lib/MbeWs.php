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

namespace PrestaShop\Module\Mbeshipping\Lib;

use PrestaShop\Module\Mbeshipping\Helper\LoggerHelper;

class MbeWs
{

//    private $_logPath;
//    private $_logFileName = 'mbe_ws.log';
    private $_log = true;

    public function __construct()
    {
        $this->logger = new LoggerHelper();
    }

    public function getCustomer($ws, $username, $password, $system)
    {
        $this->log('GET CUSTOMER');
        $result = false;

        try {
            $soapClient = new MbeSoapClient($ws, array('encoding' => 'utf-8', 'trace' => 1), $username, $password);

            $internalReferenceID = $this->generateRandomString();

            //WS ARGS
            $args = new \stdClass;
            $args->RequestContainer = new \stdClass;

            $args->RequestContainer->Action = "GET";

            $args->RequestContainer->SystemType = $system;

            $args->RequestContainer->Customer = new \stdClass;
            $args->RequestContainer->Customer->Login = "";

            $args->RequestContainer->Credentials = new \stdClass;
            $args->RequestContainer->Credentials->Username = $username;
            $args->RequestContainer->Credentials->Passphrase = $password;


            $args->RequestContainer->InternalReferenceID = $internalReferenceID;

            $args->RequestContainer->Action = "GET";

            $this->logVar('GET CUSTOMER ARGS');
            $this->logVar($args);
            $soapResult = $soapClient->__soapCall("ManageCustomerRequest", array($args));

            $lastResponse = $soapClient->__getLastResponse();
            $this->logVar('GET CUSTOMER RESPONSE');
            $this->logVar($lastResponse);

            if (isset($soapResult->RequestContainer->Errors)) {
                $this->logVar('GET CUSTOMER ERRORS');
                $this->logVar($soapResult->RequestContainer->Errors);
            }

            if (isset($soapResult->RequestContainer->Status) && $soapResult->RequestContainer->Status == "OK") {
                //if (isset($soapResult->RequestContainer->InternalReferenceID) && $soapResult->RequestContainer->InternalReferenceID == $internalReferenceID) {
                $result = $soapResult->RequestContainer->Customer;
                //}
            }
        } catch (Exception $e) {
            $this->log('GET CUSTOMER EXCEPTION');
            $this->log($e->getMessage());
        }
        $this->logVar('GET CUSTOMER RESULT');
        $this->logVar($result);
        return $result;
    }

    private function log($message)
    {
        if ($this->_log) {
            $row = date_format(new \DateTime(), 'Y-m-d\TH:i:s\Z');
            $row .= " - ";
            $row .= $message . "\n";
            $this->logger->logDebug($row);
        }
    }

    function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = \Tools::strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public function logVar($var, $message = null)
    {
        if ($this->_log) {
            if ($message) {
                $this->log($message);
            }
            $this->log(print_r($var, true));
        }
    }

    public function estimateShipping($ws, $username, $password, $shipmentType, $system, $country, $region, $postCode, $items, $insurance = false, $insuranceValue = 0.00)
    {
        $this->log('ESTIMATE SHIPPING');
        $result = false;

        try {

            $soapClient = new MbeSoapClient($ws, array('encoding' => 'utf-8', 'trace' => 1), $username, $password);
            $internalReferenceID = $this->generateRandomString();

            //WS ARGS
            $args = new \stdClass;
            $args->RequestContainer = new \stdClass;
            $args->RequestContainer->System = $system;

            $args->RequestContainer->Credentials = new \stdClass;
            $args->RequestContainer->Credentials->Username = $username;
            $args->RequestContainer->Credentials->Passphrase = $password;

            $args->RequestContainer->InternalReferenceID = $internalReferenceID;


            $args->RequestContainer->ShippingParameters = new \stdClass;

            $args->RequestContainer->ShippingParameters->DestinationInfo = new \stdClass;

            $args->RequestContainer->ShippingParameters->DestinationInfo->ZipCode = $postCode;
            $args->RequestContainer->ShippingParameters->DestinationInfo->City = $region;
            //$args->RequestContainer->ShippingParameters->DestinationInfo->State = $region;
            $args->RequestContainer->ShippingParameters->DestinationInfo->Country = $country;
            //$args->RequestContainer->ShippingParameters->DestinationInfo->idSubzone = "";

            $args->RequestContainer->ShippingParameters->ShipType = "EXPORT";

            $args->RequestContainer->ShippingParameters->PackageType = $shipmentType;

            $args->RequestContainer->ShippingParameters->Items = $items;

            $args->RequestContainer->ShippingParameters->Insurance = $insurance;
            if ($insurance) {
                $args->RequestContainer->ShippingParameters->InsuranceValue = $insuranceValue;
            }


            $this->logVar('ESTIMATE SHIPPING ARGS');
            $this->logVar($args);

            $soapResult = $soapClient->__soapCall("ShippingOptionsRequest", array($args));

            $lastResponse = $soapClient->__getLastResponse();
            $this->logVar('ESTIMATE SHIPPING RESPONSE');
            $this->logVar($lastResponse);

            if (isset($soapResult->RequestContainer->Errors)) {
                $this->logVar('ESTIMATE SHIPPING ERRORS');
                $this->logVar($soapResult->RequestContainer->Errors);
            }

            if (isset($soapResult->RequestContainer->Status) && $soapResult->RequestContainer->Status == "OK") {
                if (isset($soapResult->RequestContainer->InternalReferenceID) && $soapResult->RequestContainer->InternalReferenceID == $internalReferenceID) {
                    if (isset($soapResult->RequestContainer->ShippingOptions->ShippingOption)) {
                        if (is_array($soapResult->RequestContainer->ShippingOptions->ShippingOption)) {
                            $result = $soapResult->RequestContainer->ShippingOptions->ShippingOption;

                        } else {
                            $result = array($soapResult->RequestContainer->ShippingOptions->ShippingOption);
                        }
                    }
                }
            }

        } catch (Exception $e) {
            $this->log('ESTIMATE SHIPPING EXCEPTION');
            $this->log($e->getMessage());
        }
        $this->logVar('ESTIMATE SHIPPING RESULT');
        $this->logVar($result);
        return $result;
    }

    public function createShipping($ws, $username, $password, $shipmentType, $service, $system, $notes, $firstName, $lastName, $companyName, $address, $phone, $city, $state, $country, $postCode, $email, $items, $products, $shipperType = 'MBE', $goodsValue = 0.0, $reference = "", $isCod = false, $codValue = 0.0, $insurance = false, $insuranceValue = 0.0, $uap = false, $uapID = -1)
    {
        $this->log('CREATE SHIPPING');

        $this->logVar('CREATE SHIPPING');
        $this->logVar(func_get_args());

        $result = false;


        try {
            $soapClient = new MbeSoapClient($ws, array('encoding' => 'utf-8', 'trace' => 1), $username, $password);
            $internalReferenceID = $this->generateRandomString();

            //WS ARGS
            $args = new \stdClass;
            $args->RequestContainer = new \stdClass;
            $args->RequestContainer->System = $system;
            //$args->RequestContainer->Customer = new stdClass;
            //$args->RequestContainer->Customer->Login = "";

            $args->RequestContainer->Credentials = new \stdClass;
            $args->RequestContainer->Credentials->Username = $username;
            $args->RequestContainer->Credentials->Passphrase = $password;

            $args->RequestContainer->InternalReferenceID = $internalReferenceID;

            //RequestContainer -> Recipient
            $args->RequestContainer->Recipient = new \stdClass;

            $recipientName = $firstName . " " . $lastName;
            $RecipientCompanyName = $companyName;
            $recipientName = mb_substr($recipientName, 0, 35, 'utf8');
            $RecipientCompanyName = mb_substr($RecipientCompanyName, 0, 35, 'utf8');
            if (empty($RecipientCompanyName)) {
                $RecipientCompanyName = $recipientName;
            }
            $args->RequestContainer->Recipient->Name = $recipientName;
            //$args->RequestContainer->Recipient->LastName = $lastName;
            $args->RequestContainer->Recipient->CompanyName = $RecipientCompanyName;
            $args->RequestContainer->Recipient->Address = $address;
            $args->RequestContainer->Recipient->Phone = $phone;
            $args->RequestContainer->Recipient->ZipCode = $postCode;
            $args->RequestContainer->Recipient->City = $city;
            $args->RequestContainer->Recipient->State = $state;
            $args->RequestContainer->Recipient->Country = $country;
            $args->RequestContainer->Recipient->Email = $email;
            //$args->RequestContainer->Recipient->SubzoneId = $subZone;

            //RequestContainer -> Shipment
            $args->RequestContainer->Shipment = new \stdClass;

            $args->RequestContainer->Shipment->ShipperType = $shipperType;//"MBE";//COURIERLDV - MBE
            $args->RequestContainer->Shipment->Description = "ECOMMERCE SHOP PURCHASE";
            $args->RequestContainer->Shipment->COD = $isCod;
            //$args->RequestContainer->Shipment->CODValue =0;
            //$args->RequestContainer->Shipment->MethodPayment ="CASH";//CASH - CHECK
            if ($isCod) {
                $args->RequestContainer->Shipment->CODValue = $codValue;
                $args->RequestContainer->Shipment->MethodPayment = "CASH";//CASH - CHECK
            }

            $args->RequestContainer->Shipment->Insurance = $insurance;
            //$args->RequestContainer->Shipment->InsuranceValue = 0;
            if ($insurance) {
                $args->RequestContainer->Shipment->InsuranceValue = $insuranceValue;
            }
            $args->RequestContainer->Shipment->Service = $service;//SEE /SSE

            //$args->RequestContainer->Shipment->Courier = "";
            //$args->RequestContainer->Shipment->CourierService = "SEE";
            //$args->RequestContainer->Shipment->CourierAccount = "";
            $args->RequestContainer->Shipment->PackageType = $shipmentType;
            //$args->RequestContainer->Shipment->Value = 0;
            $args->RequestContainer->Shipment->Referring = $reference;

            $args->RequestContainer->Shipment->Items = $items;

            $request_products = array();
            $request_proforma = array();
            foreach ($products as $item) {
                $product = new \stdClass;
                $product->SKUCode = $item->SKUCode;
                $product->Description = $item->Description;
                $product->Quantity = $item->Quantity;
                array_push($request_products, $product);

                $proforma = new \stdClass;
                $proforma->Amount = $item->Quantity;
                $proforma->Currency = "EUR";
                $proforma->Value = $item->Price;
                $proforma->Unit = "PCS";
                $proforma->Description = $item->Description;
                array_push($request_proforma, $proforma);
            }

            $args->RequestContainer->Shipment->Products = $request_products;

            $args->RequestContainer->Shipment->ProformaInvoice = new \stdClass;
            $args->RequestContainer->Shipment->ProformaInvoice->ProformaDetail = $request_proforma;

            $args->RequestContainer->Shipment->Value = $goodsValue;

            if ($uap) {
                // Set new UAP object for API
                $args->RequestContainer->RecipientDeliveryPoint = clone $args->RequestContainer->Recipient;
                $args->RequestContainer->RecipientDeliveryPoint->DeliveryPointId = $uapID;
            }

            $args->RequestContainer->Shipment->Notes = mb_substr($notes, 0, 50, 'utf8');

            $args->RequestContainer->Shipment->ShipmentOrigin = "MBE eShip Prestashop 2.0.5";

            $this->logVar('CREATE SHIPPING ARGS');
            $this->logVar($args);

            $soapResult = $soapClient->__soapCall("ShipmentRequest", array($args));


            $lastResponse = $soapClient->__getLastResponse();
            $this->logVar('CREATE SHIPPING RESPONSE');
            $this->logVar($lastResponse);

            if (isset($soapResult->RequestContainer->Errors)) {
                $this->logVar('CREATE SHIPPING ERRORS');
                $this->logVar($soapResult->RequestContainer->Errors);
                $this->updateShippingErrors($reference, $soapResult->RequestContainer->Errors);
            }
            if (isset($soapResult->RequestContainer->Status) && $soapResult->RequestContainer->Status == "OK") {
                if (isset($soapResult->RequestContainer->InternalReferenceID) && $soapResult->RequestContainer->InternalReferenceID == $internalReferenceID) {
                    $result = $soapResult->RequestContainer;
                }
            }

        } catch (Exception $e) {
            $this->log('CREATE SHIPPING EXCEPTION');
            $this->log($e->getMessage());
        }
        $this->logVar('CREATE SHIPPING RESULT');
        $this->logVar($result);
        return $result;
    }

    private function updateShippingErrors($reference, $errors)
    {
        $conf = \Configuration::get('MBESHIPPING_CREATE_SHIPPING_ERRORS');

        if (empty($conf)) {
            $error_data = [];

            if (!empty($errors) && $errors instanceof \stdClass) {
                $error_data[$reference] = [
                    'code' => $errors->Error->ErrorCode,
                    'description' => $errors->Error->Description
                ];
                \Configuration::updateValue('MBESHIPPING_CREATE_SHIPPING_ERRORS', json_encode($error_data));
            }
            return;
        }

        if (!empty($errors) && $errors instanceof \stdClass) {
            $errors_arr = json_decode($conf, true);
            $errors_arr[$reference] = [
                'code' => $errors->Error->ErrorCode,
                'description' => $errors->Error->Description
            ];
            \Configuration::updateValue('MBESHIPPING_CREATE_SHIPPING_ERRORS', json_encode($errors_arr));
        }
    }

    public function closeShipping($ws, $username, $password, $system, $trackings)
    {
        $this->log('CLOSE SHIPPING');


        $result = false;


        try {
            $soapClient = new MbeSoapClient($ws, array('encoding' => 'utf-8', 'trace' => 1), $username, $password);
            $internalReferenceID = $this->generateRandomString();

            //WS ARGS
            $args = new \stdClass;
            $args->RequestContainer = new \stdClass;
            $args->RequestContainer->SystemType = $system;

            $args->RequestContainer->Credentials = new \stdClass;
            $args->RequestContainer->Credentials->Username = $username;
            $args->RequestContainer->Credentials->Passphrase = $password;

            $args->RequestContainer->InternalReferenceID = $internalReferenceID;

            $masterTrackingsMBE = array();
            foreach ($trackings as $track) {
                array_push($masterTrackingsMBE, $track);
            }


            $args->RequestContainer->MasterTrackingsMBE = $masterTrackingsMBE;

            $this->logVar('CLOSE SHIPPING ARGS');
            $this->logVar($args);


            $soapResult = $soapClient->__soapCall("CloseShipmentsRequest", array($args));

            $lastResponse = $soapClient->__getLastResponse();

            $this->logVar('CLOSE SHIPPING RESPONSE');
            $this->logVar($lastResponse);

            if (isset($soapResult->RequestContainer->Errors)) {
                $this->logVar('CLOSE SHIPPING ERRORS');
                $this->logVar($soapResult->RequestContainer->Errors);
            }

            if (isset($soapResult->RequestContainer->Status) && $soapResult->RequestContainer->Status == "OK") {
                $result = $soapResult->RequestContainer;
            }

        } catch (Exception $e) {
            $this->log('CLOSE SHIPPING EXCEPTION');
            $this->log($e->getMessage());
        }
        $this->logVar('CLOSE SHIPPING RESULT');
        $this->logVar($result);
        return $result;
    }

    public function createReturnShipping($ws, $username, $password, $system, $tracking)
    {
        $this->log('CREATE RETURN SHIPPING');

        $this->logVar('CREATE RETURN SHIPPING');
        $this->logVar(func_get_args());

        $result = false;

        try {
            $soapClient = new MbeSoapClient($ws, array('encoding' => 'utf-8', 'trace' => 1), $username, $password);
            $internalReferenceID = $this->generateRandomString();

            //WS ARGS
            $args = new \stdClass;
            $args->RequestContainer = new \stdClass;
            $args->RequestContainer->System = $system;

            $args->RequestContainer->Credentials = new \stdClass;
            $args->RequestContainer->Credentials->Username = $username;
            $args->RequestContainer->Credentials->Passphrase = $password;

            $args->RequestContainer->InternalReferenceID = $internalReferenceID;

            $args->RequestContainer->MbeTracking = $tracking;
            $args->RequestContainer->CustomerAsReceiver = true;
            $args->RequestContainer->ShipmentOrigin = "MBE eShip Prestashop 2.0.5";
            $args->RequestContainer->Referring = '';

            $this->logVar($args, 'RETURN SHIPPING ARGS');

            $soapResult = $soapClient->__soapCall("ShipmentReturnRequest", array($args));

            $lastResponse = $soapClient->__getLastResponse();
            $this->logVar('CREATE SHIPPING RESPONSE');
            $this->logVar($lastResponse);

            if (isset($soapResult->RequestContainer->Errors)) {
                $this->logVar('RETURN SHIPPING ERRORS');
                $this->logVar($soapResult->RequestContainer->Errors);
            }
            if (isset($soapResult->RequestContainer->Status) && $soapResult->RequestContainer->Status == "OK") {
                if (isset($soapResult->RequestContainer->InternalReferenceID) && $soapResult->RequestContainer->InternalReferenceID == $internalReferenceID) {
                    $result = $soapResult->RequestContainer;
                }
            }

        } catch (Exception $e) {
            $this->log('RETURN SHIPPING EXCEPTION');
            $this->log($e->getMessage());
        }
        $this->logVar('RETURN SHIPPING RESULT');
        $this->logVar($result);
        return $result;
    }

}
