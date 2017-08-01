<?php get_header(); ?>

<main role="main" class="main">
    <!-- section -->
    <section class="grid grid--cards">

        <h1 class="main__title main__title--margin"><?php _e( 'Tag Archive: ', 'aata' ); echo single_tag_title('', false); ?></h1>

        <?php get_template_part('loop'); ?>

        <?php get_template_part('pagination'); ?>

    </section>
    <!-- /section -->
</main>


<?php get_sidebar(); ?>

<?php get_footer(); ?>
