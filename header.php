<!doctype html>
<html <?php language_attributes(); ?> ng-app="aata">
    <head>
        <meta charset="<?php bloginfo('charset'); ?>">
        <title><?php wp_title(''); ?><?php if(wp_title('', false)) { echo ' :'; } ?> <?php bloginfo('name'); ?></title>
            
        <!-- <link href="//www.google-analytics.com" rel="dns-prefetch"> -->
        <!-- <script src="https://www.google.com/recaptcha/api.js" async defer></script> -->

        <link href="<?php echo get_template_directory_uri(); ?>/img/icons/favicon.ico" rel="shortcut icon">
        <link href="<?php echo get_template_directory_uri(); ?>/img/icons/touch.png" rel="apple-touch-icon-precomposed">

        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="<?php bloginfo('description'); ?>">
        
        <link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700" rel="stylesheet">        
        
        <?php wp_head(); ?>
    </head>
    <body ng-controller="MainController"
          aata-resources="<?php echo home_url(); ?>"
          ng-class="{'menu-is-active': showMenu == true}">
        <!-- wrapper -->
        <div class="wrapper">

        <!-- header -->
        <header class="header" role="banner">
            <!-- logo -->
            <div class="logo">
                <a class="logo__link" href="<?php echo home_url(); ?>">
                    <?php get_template_part('img/logo'); ?>
                </a>
            </div>
            <button class="menu-button" ng-click="showMenu = !showMenu" aria-expanded="{{showMenu}}">
                <span class="sr-only">Abrir Menú</span>
                <?php get_template_part('img/icons/menuicon'); ?>
            </button>
            <!-- /logo -->
            <!-- nav -->
            <nav class="nav" role="navigation" 
                ng-class="{'is-active': showMenu == true}"
                aata-menu=".page_item_has_children">
                <?php html5blank_nav(); ?>
            </nav>
            <!-- /nav -->
        </header>
        <!-- /header -->
