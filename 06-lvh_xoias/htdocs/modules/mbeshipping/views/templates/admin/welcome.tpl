{*
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
*}

<div class="welcome-page">
    <div class="panel mbe">
        <div class="panel-heading mbe">
            {l s='Welcome' mod='mbeshipping'}
        </div>
    </div>
    <div class="content-wrapper">
        <p class="title text-left red">{l s='Shipping and digitized logistics with MBE' mod='mbeshipping'}</p>
        <p class="custom">{l s='Give a new impulse to your e-commerce: with MBE solutions to digitize shipments and logistics, designed for companies, entrepreneurs but also artisans who are looking for a reliable partner who can support them by successfully bringing their business online with complete and flexible solutions, even on large marketplaces such as Amazon and e-Bay and are compatible with Magento CE, PrestaShop, Shopify, WooCommerce as well as the ability to customize them via API.' mod='mbeshipping'}</p>
        <div class="row buttons my-2">
            <a href="{$link_contact|escape:'htmlall':'UTF-8'}" class="btn btn-primary" target="_blank">{l s='Contact us' mod='mbeshipping'}</a>
            <button class="btn btn-primary" onclick="$('a[href=#general_settings]').click()">{l s='Start the configuration' mod='mbeshipping'}</button>
        </div>
        <p class="custom">{l s='By connecting the MBE platform directly to your system, you can automate the management of shipments and facilitate the sales process. The solutions designed for the digitalization of shipments and logistics allow you to optimize the customer\'s "journey" and improve the shopping experience to unlock business opportunities and allow you to be competitive even in the face of today\'s market challenges.' mod='mbeshipping'}</p>
        <p class="title text-center dark mt-2">{l s='Shipping and digitized logistics with MBE' mod='mbeshipping'}</p>
        <div class="row">
            <div class="box-container">
                <div class="box bg-darker">
                    <p class="title text-left dark">{l s='MBE Digital Solutions' mod='mbeshipping'}</p>
                    <p class="custom">{l s='Turnkey digital services that help your brand take off. Reach your customers online with digital solutions and web marketing tools that give you more chances to reach your audience by building an effective online presence for your business and being where your customers are. MBE offers you effective solutions to grow your digital channels. Showcase your brand, e-commerce store, or improve your current website to make it more visible on search engines.' mod='mbeshipping'}</p>
                </div>
                <div class="box">
                    <img src="{$banner_elink|escape:'htmlall':'UTF-8'}" alt="Image"/>
                </div>
                <div class="box">
                    <img src="{$banner_packing|escape:'htmlall':'UTF-8'}" alt="Image"/>
                </div>
                <div class="box bg-darker">
                    <p class="title text-left dark">{l s='MBE Packing' mod='mbeshipping'}</p>
                    <p class="custom">{l s='The packaging service that gives your business an edge. Your customers deserve a unique experience: surprise them during unboxing with customized packaging solutions for your products. A highly customized solution that enhances your brand and adds a touch of style based on your specific needs. In addition to optimizing time and resources, you can reduce your environmental impact as MBE uses innovative packaging techniques and materials.' mod='mbeshipping'}</p>
                </div>
            </div>
        </div>
        <p class="title text-left dark mt-2">{l s='Now you know you have a reliable partner by your side!' mod='mbeshipping'}</p>
        <p class="custom">{l s='MBE is the right end-to-end partner that supports all realities in the transition to digital by providing complete and turnkey solutions.' mod='mbeshipping'}</p>
        <div class="row mt-2">
            <a href="{$link_contact|escape:'htmlall':'UTF-8'}" class="btn btn-primary" target="_blank">{l s='Contact your MBE Center' mod='mbeshipping'}</a>
        </div>
    </div>
</div>
