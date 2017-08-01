<?php get_header(); ?>

<main role="main" class="main">
	<?php if(!function_exists('dynamic_sidebar') || !dynamic_sidebar('widget-area-1')) ?>
	<section class="">

<!--         <h1 class="main__title"><?php _e( 'Latest Posts', 'aata' ); ?></h1>
 -->
        <?php get_template_part('loop'); ?>

        <?php get_template_part('pagination'); ?>

    </section>
    <!-- /section -->
</main>

<?php get_sidebar(); ?>

<?php get_footer(); ?>

