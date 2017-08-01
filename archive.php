<?php get_header(); ?>

<main role="main" class="main">
    <!-- section -->
    <section>

        <h1 class="main__title"><?php _e( 'Archives', 'aata' ); ?></h1>

        <?php get_template_part('loop'); ?>

        <?php get_template_part('pagination'); ?>

    </section>
    <!-- /section -->
</main>


<?php get_sidebar(); ?>

<?php get_footer(); ?>

