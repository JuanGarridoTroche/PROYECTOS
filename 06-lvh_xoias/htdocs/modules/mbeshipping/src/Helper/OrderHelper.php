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

use PrestaShop\Module\Mbeshipping\Ws;

if (version_compare(_PS_VERSION_, '1.7.0.0', '>=')) {
    include_once(dirname(__FILE__) . '/../../../../config/config.inc.php');
    include_once(dirname(__FILE__) . '/../../../../init.php');
} else {
    define('PS_MBE_DIR', getcwd());

    include_once(dirname(__FILE__) . '/../../../../config/config.inc.php');
    //include_once(dirname(__FILE__) . '/../../../../../init.php');
}

class OrderHelper
{
    public static function getCarrierName($value)
    {
        $carrier = new \Carrier($value);
        return $carrier->name;
    }

    public static function checkClose($value)
    {
        $helper = new DataHelper();
        return $helper->isShippingOpen($value) ? 'Opened' : 'Closed';
    }

    public function addShipping($order, $service)
    {
        $errors = array();
        $helper = new DataHelper();
        $logger = new LoggerHelper();

        $insurance = $helper->isShippingWithInsurance($service);
        if ($insurance) {
            $service = $helper->convertShippingCodeWithoutInsurance($service);
        }

        $isCod = false;

        $orderTotal = $order->getTotalPaid();

        $cashOnDeliveryModuleName = $helper->getCashOnDeliveryModuleName();
        if ($order->module == $cashOnDeliveryModuleName) {
            $isCod = true;
        }

        $shipmentConfigurationMode = $helper->getShipmentConfigurationMode();

        if ($shipmentConfigurationMode == RatesHelper::SHIPMENT_CONFIGURATION_MODE_ONE_SHIPMENT_PER_ITEM) {
            $productsAmount = 0;
            foreach ($order->getProducts() as $item) {
                $productsAmount += $item['product_quantity'];
            }

            $codValue = $orderTotal / $productsAmount;

            foreach ($order->getProducts() as $item) {
                $itemWeight = $item['weight'];
                $itemWeight = $helper->convertWeight($itemWeight);

                $boxesDimensionWeight = [];
                $boxesSingleParcelDimensionWeight = [];

                // Retrieve the product info using the new box structure
                $helper->getBoxesArray(
                    $boxesDimensionWeight,
                    $boxesSingleParcelDimensionWeight,
                    $itemWeight,
                    $helper->getPackageInfo($item['reference'])
                );

                $products = array();
                $product = new \stdClass;
                $product->SKUCode = $item["product_reference"];
                $product->Description = $item["product_name"];
                $product->Quantity = 1;
                $product->Price = $item['product_price'];
                array_push($products, $product);

                //TODO: use the correct price with or without taxes
                $goodsValue = $item["product_price"];

                if (\Configuration::get('mbe_shipments_ins_mode') ==
                    DataHelper::MBE_INSURANCE_WITH_TAXES) {
                    $insuranceValue = $item["product_price_wt"];
                } else {
                    $insuranceValue = $item["product_price"];
                }

                for ($i = 1; $i <= $item['product_quantity']; $i++) {
                    $logger->logDebug($item['product_price'], "Goods Value");
                    $errors = $this->createSingleShipment($order, $service, $boxesDimensionWeight, $products, 1,
                        $insurance, $insuranceValue, $goodsValue, $isCod, $codValue);
                }
            }
        } elseif ($shipmentConfigurationMode ==
            RatesHelper::SHIPMENT_CONFIGURATION_MODE_ONE_SHIPMENT_PER_SHOPPING_CART_SINGLE_PARCEL) {
            $boxesDimensionWeight = [];
            $boxesSingleParcelDimensionWeight = [];

            $boxesWeights = array();
            $products = array();
            $goodsValue = 0.0;
            $insuranceValue = 0.0;
            $codValue = $orderTotal;
            foreach ($order->getProducts() as $item) {
                $product = new \stdClass;
                $product->SKUCode = $item["product_reference"];
                $product->Description = $item["product_name"];
                $product->Quantity = $item["product_quantity"];
                $product->Price = $item['product_price'];
                array_push($products, $product);

                $packageInfo = $helper->getPackageInfo($item['reference']);
                $itemWeight = $helper->convertWeight($item['weight']);
                $itemQty = $item['product_quantity'];
                for ($i = 1; $i <= $itemQty; $i++) {

                    $boxesDimensionWeight = $helper->getBoxesArray(
                        $boxesDimensionWeight,
                        $boxesSingleParcelDimensionWeight,
                        $itemWeight,
                        $packageInfo
                    );
                }
                $goodsValue += $item['total_price'];
                $insuranceValue += $this->getSubtotalForInsurance($item);
            }
            $boxesDimensionWeight = $helper->mergeBoxesArray(
                $boxesDimensionWeight,
                $boxesSingleParcelDimensionWeight
            );

            $numBoxes = $helper->countBoxesArray($boxesDimensionWeight);
            $logger->logDebug($numBoxes, "boxes amount");
            $logger->logDebug($boxesWeights, "boxes weights");
            $errors = $this->createSingleShipment($order, $service, $boxesDimensionWeight, $products, $numBoxes,
                $insurance, $insuranceValue, $goodsValue, $isCod, $codValue);
        } elseif ($shipmentConfigurationMode ==
            RatesHelper::SHIPMENT_CONFIGURATION_MODE_ONE_SHIPMENT_PER_SHOPPING_CART_MULTI_PARCEL) {
            $boxesWeights = array();
            $products = array();
            $numBoxes = 0;
            $goodsValue = 0.0;
            $insuranceValue = 0.0;
            $codValue = $orderTotal;
            foreach ($order->getProducts() as $item) {
                $product = new \stdClass;
                $product->SKUCode = $item["product_reference"];
                $product->Description = $item["product_name"];
                $product->Quantity = $item["product_quantity"];
                $product->Price = $item['product_price'];
                array_push($products, $product);

                $insuranceValue += $this->getSubtotalForInsurance($item);
                $goodsValue += $item['total_price'];

                $itemWeight = $helper->convertWeight($item['weight']);
                $packageInfo = $helper->getPackageInfo($item['reference'], true);
                $numBoxes += $item['product_quantity'];
                for ($i = 1; $i <= $item['product_quantity']; $i++) {
                    $helper->getBoxesArray(
                        $boxesDimensionWeight,
                        $boxesSingleParcelDimensionWeight,
                        $itemWeight,
                        $packageInfo
                    );
                }
            }
            $logger->logDebug($numBoxes, "boxes amount");
            $logger->logDebug($boxesWeights, "boxes weights");
            $errors = $this->createSingleShipment($order, $service, $boxesSingleParcelDimensionWeight, $products,
                $numBoxes, $insurance, $insuranceValue, $goodsValue, $isCod, $codValue);
        }
        return $errors;
    }

    public function createSingleShipment($order, $service, $weight, $products, $boxes, $insurance, $insuranceValue,
                                         $goodsValue = 0.0, $isCod = false, $codValue = 0.0)
    {
        $errors = array();
        $logger = new LoggerHelper();

        try {
            $ws = new Ws();

            $shippingAddress = new \Address((int)$order->id_address_delivery);
            $notes = $order->getFirstMessage();
            if ($notes) {
                $notes .= " ";
            }
            $notes .= $shippingAddress->other;

            $firstName = $shippingAddress->firstname;
            $lastName = $shippingAddress->lastname;
            $companyName = $shippingAddress->company;
            $addressArray = array($shippingAddress->address1, $shippingAddress->address2);
            $address = implode(" ", $addressArray);
            $phone = \Tools::strlen($shippingAddress->phone) > 0 ? $shippingAddress->phone :
                $shippingAddress->phone_mobile;
            $city = $shippingAddress->city;
            $country = new \Country((int)($shippingAddress->id_country));
            $countryId = $country->iso_code;
            $uap = false;
            $uapID = -1;
            if ($shippingAddress->other === 'UAP') {
                $uap = true;
                $uapID = explode("-", $shippingAddress->alias)[1];
            }

            $region = $shippingAddress->id_state;
            if ($region == 0) {
                $region = null;
            } else {
                $state = new \State((int)($shippingAddress->id_state));
                $region = $state->iso_code;
            }

            $postCode = $shippingAddress->postcode;
            $customer = new \Customer($shippingAddress->id_customer);
            $email = $customer->email;

            $reference = $order->reference;

            $mbeShipment = $ws->createShipping($countryId, $region, $postCode, $weight, $boxes, $products, $service,
                $notes, $firstName, $lastName, $companyName, $address, $phone, $city, $email, $goodsValue, $reference,
                $isCod, $codValue, $insurance, $insuranceValue, $uap, $uapID);
            $logger->logDebug("MBE SHIPMENT", $mbeShipment);

            if ($mbeShipment) {
                $trackingNumber = $mbeShipment->MasterTrackingMBE;
                $fileName = $this->getFilename($order, $trackingNumber);
                $label = $mbeShipment->Labels->Label;

                // Check for available labels
                $isLabelAvailable = 0;
                if (is_array($label)) {
                    foreach ($label as $l) {
                        if (isset($l->Stream)) {
                            $isLabelAvailable = 1;
                            break;
                        }
                    }
                } else {
                    if (isset($label->Stream)) {
                        $isLabelAvailable = 1;
                    }
                }
                // Check for available labels

                if (!$isLabelAvailable) {
                    // Save Specific LDV Download
                    $isDownloadAvailable = 1;
                    if (!isset($mbeShipment->CourierMasterTrk)) {
                        $isDownloadAvailable = 0;
                    }
                    $this->saveDownloadAvailable($order->id, $isDownloadAvailable);
                    // Save Specific LDV Download
                } else {
                    $this->saveDownloadAvailable($order->id);
                }

                if (is_array($label)) {
                    $i = 1;
                    foreach ($label as $l) {
                        $this->saveShipmentDocument($l->Type, $l->Stream, $fileName . '_' . $i);
                        $i++;
                    }
                } else {
                    $this->saveShipmentDocument($label->Type, $label->Stream, $fileName);
                }

                $this->setWsShippingNumber($order, $trackingNumber);

                $shipperType = $ws->getShipperType();
                if ($shipperType === "COURIERLDV") {
                    $this->setOrderShipped($order);
                }
            } else {
                //$order->_errors[] = Tools::displayError('Error creating tracking number.');
                $errors[] = 'Error creating tracking number.';
            }
        } catch (Exception $e) {
            $logger->logDebug($e->getMessage());
        }

        return $errors;
    }

    public function getFileName($order, $trackingNumber)
    {
        return 'MBE_' . $order->id . '_' . $trackingNumber;
    }

    public function saveShipmentDocument($type, $content, $filename)
    {
        $helper = new DataHelper();
        $logger = new LoggerHelper();

        $ext = "txt";
        if ($type == "HTML") {
            $ext = "html";
        } elseif ($type == "PDF") {
            $ext = "pdf";
        } elseif ($type == "GIF") {
            $ext = "gif";
        }
        $filePath = $helper->getShipmentFilePath($filename, $ext);

        $saveResult = file_put_contents($filePath, $content);

        $message = "Saving shipping document :" . $filePath;

        if ($saveResult) {
            $message .= " OK";
        } else {
            $message .= " FAILURE";
        }

        $logger->logDebug($message);
    }

    public function setWsShippingNumber($order, $shipping_number)
    {
        $id_order_carrier = \Db::getInstance()->getValue('
			SELECT `id_order_carrier`
			FROM `' . _DB_PREFIX_ . 'order_carrier`
			WHERE `id_order` = ' . (int)$order->id);
        if ($id_order_carrier) {
            $order_carrier = new \OrderCarrier($id_order_carrier);
            $old = $order_carrier->tracking_number;
            if ($old) {
                $order_carrier->tracking_number = trim($old .
                    DataHelper::MBE_SHIPPING_TRACKING_SEPARATOR . $shipping_number);
            } else {
                $order_carrier->tracking_number = trim($shipping_number);
            }
            $order_carrier->update();
        } else {
            $old = $order->shipping_number;
            if ($old) {
                $order->shipping_number = trim($old . DataHelper::MBE_SHIPPING_TRACKING_SEPARATOR .
                    $shipping_number);
            } else {
                $order->shipping_number = trim($shipping_number);
            }
            $order->update();
        }
        return true;
    }

    /*public static function printPDFIconsButton($id_order, $tr)
    {
        $order = new Order($id_order);
        //$orderState = OrderHistory::getLastOrderState($id_order);
        //if (!Validate::isLoadedObject($orderState) or !Validate::isLoadedObject($order))
        if (!Validate::isLoadedObject($order)) {
            echo '&nbsp;';
            return false;
        }
        echo '<span style="width:20px; margin-right:5px;">';
        if ($order->shipping_number && str_replace(' ', '', $order->shipping_number) != '') {
            $shipLink = 'index.php?tab=AdminMbeShipping&submitAction=generateDelivery&id_order=' . $order->id;
            echo '<a target="_blank" href="' . $shipLink .
                '"><img src="../img/admin/delivery.gif" alt="delivery" /></a>';
        }
        echo '</span>';

        $ws = new MbeShippingModelWs();
        $mustClose = $ws->mustCloseShipments();
        if ($mustClose) {
            $helper = new MbeShippingHelperData();

            if (ltrim($order->shipping_number) != '') {
                $arr = explode(' ', ltrim($order->shipping_number));
                $t = end($arr);
                if (!$helper->isShippingOpen($id_order)) {
                    if ($helper->getTrackingStatus($t)) {
                        $href = __PS_BASE_URI__ . 'modules/mbeshipping/pdf.php?files[]=' .
                            $helper->getTrackingFilePath($t);
                        echo '<span style="width:20px;">';
                        echo '<a target="_blank" href="' . $href .
                            '"><img src="../img/admin/tab-invoice.gif" alt="delivery" /></a>';
                        echo '</span>';
                    }
                }
            }
        }
    }*/

    public function setOrderShipped($order)
    {
        try {
            $helper = new DataHelper();
            if ($helper->getAutoChangeOrderStatus()) {
                //Cambio lo stato solo se l'ordine è nello stato pagamento accettato (2)
                if ($order->current_state == 2) {
                    $history = new \OrderHistory();
                    $history->id_order = (int)$order->id;
                    $history->changeIdOrderState(4, $order);
                    $history->addWithemail();
                }
            }
        } catch (Exception $e) {
            $logger = new LoggerHelper();
            $logger->logDebug("SET ORDER SHIPPED ERROR: " . $e->getMessage());
        }
    }

    protected function getSubtotalForInsurance($item)
    {
        $insuranceValue = 0;
        if (\Configuration::get('mbe_shipments_ins_mode') == DataHelper::MBE_INSURANCE_WITH_TAXES) {
            $insuranceValue += $item["product_price_wt"] * $item['product_quantity'];
        } else {
            $insuranceValue += $item["product_price"] * $item['product_quantity'];
        }
        return $insuranceValue;
    }

    public function addReturnShipping($order, $trackings)
    {
        $errors = array();

        $ts = explode(DataHelper::MBE_SHIPPING_TRACKING_SEPARATOR, $trackings);

        $errors = $this->createReturnShipment($order, $ts[0]);

        return $errors;
    }

    public function createReturnShipment($order, $tracking)
    {
        $errors = array();
        $logger = new LoggerHelper();

        try {
            $ws = new Ws();
            $mbeShipment = $ws->createReturnShipping($tracking);
            $logger->logDebug("MBE RETURN SHIPMENT", $mbeShipment);
            if ($mbeShipment) {
                $trackingNumber = "RETURN " . $mbeShipment->MasterTrackingMBE;
                $this->setWsShippingNumber($order, $trackingNumber);

            } else {
                $errors[] = 'Error creating return tracking number.';
            }

        } catch (Exception $e) {
            $logger->logDebug($e->getMessage());
        }
        return $errors;
    }

    public function saveDownloadAvailable($id_order, $available = 1)
    {
        try {
            $morderHelper = new MOrderHelper();
            $morderHelper->insertOrder($id_order, $available);
        } catch (Exception $e) {
            $logger = new LoggerHelper();
            $logger->logDebug("SET DOWNLOAD AVAILABLE ERROR: " . $e->getMessage());
        }
    }
}
