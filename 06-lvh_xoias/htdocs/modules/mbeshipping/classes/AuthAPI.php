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

if (!defined('_PS_VERSION_')) {
    exit;
}

const MBESHIPPING_TEST_MODE = false;

class AuthAPI
{
    public static $apiEndpoints = [
        'IT' => [
            'endpoint' => 'https://api.mbeonline.it',
            'webservice' => 'https://api.mbeonline.it/ws/e-link.wsdl'
        ],
        'ES' => [
            'endpoint' => 'https://api.mbeonline.es',
            'webservice' => 'https://api.mbeonline.es/ws/e-link.wsdl'
        ],
        'DE' => [
            'endpoint' => 'https://api.mbeonline.de',
            'webservice' => 'https://api.mbeonline.de/ws/e-link.wsdl'
        ],
        'FR' => [
            'endpoint' => 'https://api.mbeonline.fr',
            'webservice' => 'https://api.mbeonline.fr/ws/e-link.wsdl'
        ],
        'AT' => [
            'endpoint' => 'https://api.mbeonline.de',
            'webservice' => 'https://api.mbeonline.de/ws/e-link.wsdl'
        ],
        'PL' => [
            'endpoint' => 'https://api.mbeonline.pl',
            'webservice' => 'https://api.mbeonline.pl/ws/e-link.wsdl'
        ],
        'HR' => [
            'endpoint' => 'https://api.mbeonline.hr',
            'webservice' => 'https://api.mbeonline.hr/ws/e-link.wsdl'
        ],
    ];
    protected $apiEndpoint;
    protected $username;
    protected $password;
    protected $mbe_country;
    protected $ws_url;

    public function __construct()
    {
        $mbe_credentials = json_decode(Configuration::get('MBESHIPPING_CREDENTIALS'));
        $this->apiEndpoint = MBESHIPPING_TEST_MODE ?
            'https://api.dev.mbehub.cloud.mbeglobal.io' :
            self::$apiEndpoints[$mbe_credentials->mbecountry]['endpoint'];
        $this->username = $mbe_credentials->mbe_user;
        $this->password = $mbe_credentials->mbe_pass;
        $this->mbe_country = $mbe_credentials->mbecountry;
        $this->ws_url = self::$apiEndpoints[$mbe_credentials->mbecountry]['webservice'];
    }

    public static function isAuthenticated()
    {
        return !empty(Configuration::get('username')) && !empty(Configuration::get('password'));
    }

    public function retrieveAPIKeys()
    {
        if (empty($bearer_token = $this->step1())) {
            return false;
        }
        if (empty($customer_data = $this->step2($bearer_token))) {
            return false;
        }
        if (empty($final_token = $this->step3($bearer_token, $customer_data)->access_token)) {
            return false;
        }
        if (empty($api_keys = $this->step4($final_token, json_decode($customer_data)->idEntity))) {
            return false;
        }
        if (empty($api_keys->apiKey) || empty($api_keys->apiSecret)) {
            if ($api_keys->code === 'APIKEY_ROLE_LEGAL_ENTITY_ALREADY_EXISTS') {
                if (empty($existing_api_key = $this->retrieveExistingApiKey($final_token, json_decode($customer_data)->idEntity))) {
                    return false;
                }
                if ($this->deleteExistingAPIKey($final_token, $existing_api_key) == 200) {
                    return $this->retrieveAPIKeys();
                }
            }
            return false;
        }
        Configuration::updateValue('username', $api_keys->apiKey);
        Configuration::updateValue('password', $api_keys->apiSecret);
        if (MBESHIPPING_TEST_MODE) {
            Configuration::updateValue('url', 'https://api.dev.mbehub.cloud.mbeglobal.io/ws/e-link.wsdl');
        } else {
            Configuration::updateValue('url', $this->ws_url);
        }
        Configuration::updateValue('mbecountry', $this->mbe_country);
        return true;
    }

    private function step1()
    {
        $data = [
            'grant_type' => 'password',
            'username' => $this->username,
            'password' => $this->password
        ];

        $headers = [
            'Accept: application/json, text/plain, */*',
            'Accept-Language: it,it-IT;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'Authorization: Basic dGVsZXBvcnQtZmU6',
            'Connection: keep-alive',
            'Content-Type: application/x-www-form-urlencoded',
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36 Edg/103.0.1264.37',
            'cache-control: no-cache'
        ];

        try {
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

            if ($curl === false) {
                return false;
            }

            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
            curl_setopt($curl, CURLOPT_URL, $this->apiEndpoint . '/oauth/token');
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

            $result = curl_exec($curl);

            if ($result === false || curl_errno($curl) != 0) {
                return false;
            }

            curl_close($curl);

            return isset(json_decode($result)->access_token) ? json_decode($result)->access_token : false;
        } catch (Exception $e) {
            return false;
        }
    }

    private function step2($bearer_token)
    {
        $headers = [
            'Accept: application/json, text/plain, */*',
            'Accept-Language: it,it-IT;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'Authorization: Bearer ' . $bearer_token,
            'Connection: keep-alive',
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36 Edg/103.0.1264.37',
            'cache-control: no-cache'
        ];

        try {
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

            if ($curl === false) {
                return false;
            }

            curl_setopt($curl, CURLOPT_URL, $this->apiEndpoint . '/oauth/mine');
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

            $result = curl_exec($curl);

            if ($result === false || curl_errno($curl) != 0) {
                return false;
            }

            curl_close($curl);
            // remove []
            return Tools::substr($result, 1, -1);
        } catch (Exception $e) {
            return false;
        }
    }

    private function step3($bearer_token, $customer_data)
    {
        $headers = [
            'Accept: application/json, text/plain, */*',
            'Accept-Language: it,it-IT;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'Authorization: Bearer ' . $bearer_token,
            'Connection: keep-alive',
            'Content-Type: application/json',
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36 Edg/103.0.1264.37',
            'cache-control: no-cache'
        ];

        try {
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

            if ($curl === false) {
                return false;
            }

            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $customer_data);
            curl_setopt($curl, CURLOPT_URL, $this->apiEndpoint . '/oauth/select-store');
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

            $result = curl_exec($curl);

            if ($result === false || curl_errno($curl) != 0) {
                return false;
            }

            curl_close($curl);
            return json_decode($result);
        } catch (Exception $e) {
            return false;
        }
    }

    private function step4($final_token, $id_entity)
    {
        $data = [
            'legalEntityType' => 'CUSTOMER',
            'roleName' => 'ONLINEMBE_USER',
            'idEntity' => $id_entity,
            'username' => Tools::substr($this->username, 0, strpos($this->username, '@'))
        ];

        $headers = [
            'Accept: application/json, text/plain, */*',
            'Accept-Language: it,it-IT;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'Authorization: Bearer ' . $final_token,
            'Connection: keep-alive',
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36 Edg/103.0.1264.37',
            'cache-control: no-cache',
            'Content-Length: 0'
        ];

        try {
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

            if ($curl === false) {
                return false;
            }

            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_URL, $this->apiEndpoint . '/auth-registry/apikey?' . http_build_query($data));
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

            $result = curl_exec($curl);

            if ($result === false || curl_errno($curl) != 0) {
                return false;
            }

            curl_close($curl);
            return json_decode($result);
        } catch (Exception $e) {
            return false;
        }
    }

    private function retrieveExistingApiKey($final_token, $id_entity)
    {
        $data = [
            'legalEntityType' => 'CUSTOMER',
            'idEntity' => $id_entity
        ];

        $headers = [
            'Accept: application/json, text/plain, */*',
            'Accept-Language: it,it-IT;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'Authorization: Bearer ' . $final_token,
            'Connection: keep-alive',
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36 Edg/103.0.1264.37',
            'cache-control: no-cache'
        ];

        try {
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

            if ($curl === false) {
                return false;
            }

            curl_setopt($curl, CURLOPT_URL, $this->apiEndpoint . '/auth-registry/apikey?' . http_build_query($data));
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

            $result = curl_exec($curl);

            if ($result === false || curl_errno($curl) != 0) {
                return false;
            }

            curl_close($curl);

            return json_decode($result, true)['content'][0]['apiKey'];
        } catch (Exception $e) {
            return false;
        }
    }

    private function deleteExistingAPIKey($final_token, $existing_api_key)
    {
        $headers = [
            'Accept: */*',
            'Accept-Encoding: gzip, deflate, br',
            'Authorization: Bearer ' . $final_token,
            'Connection: keep-alive',
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36 Edg/103.0.1264.37',
            'cache-control: no-cache'
        ];

        try {
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

            if ($curl === false) {
                return false;
            }

            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
            curl_setopt($curl, CURLOPT_URL, $this->apiEndpoint . '/auth-registry/apikey?apikey=' . $existing_api_key);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

            $result = curl_exec($curl);

            if ($result === false || curl_errno($curl) != 0) {
                return false;
            }

            $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

            curl_close($curl);
            return json_decode($http_code);
        } catch (Exception $e) {
            return false;
        }
    }
}
