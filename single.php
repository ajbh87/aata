<?php get_header(); ?>

<main role="main" class="main">
	<!-- section -->
	<section>

	<?php if (have_posts()): while (have_posts()) : the_post(); ?>

		<!-- article -->
		<article id="post-<?php the_ID(); ?>" class="article post">

			<!-- post thumbnail -->
			<?php if ( has_post_thumbnail()) : // Check if Thumbnail exists ?>
				<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
					<?php the_post_thumbnail(); // Fullsize image for the single post ?>
				</a>
			<?php endif; ?>
			<!-- /post thumbnail -->

			<!-- post title -->
			<h1 class="article__title main__title">
				<a href="<?php the_permalink(); ?>" 
                   title="<?php the_title(); ?>"><?php the_title(); ?></a>
			</h1>
			<!-- /post title -->

            <!-- post details -->
            <span class="date"><?php the_time('F j, Y'); ?> <?php the_time('g:i a'); ?></span>
            <span class="author hidden"><?php _e( 'Published by', 'html5blank' ); ?> <?php the_author_posts_link(); ?></span>
            <!-- /post details -->
			<div class="article__content">

                <?php the_content(); // Dynamic Content ?>
                <p>
                    <?php the_tags( __( 'Tags: ', 'html5blank' ), ', '); // Separated by commas with a line break at the end ?>
                </p>

                <p class="hidden"><?php _e( 'Categorised in: ', 'html5blank' ); the_category(', '); // Separated by commas ?></p>

                <p class="hidden"><?php _e( 'This post was written by ', 'html5blank' ); the_author(); ?></p>

                <?php edit_post_link(); // Always handy to have Edit Post Links available ?>
            </div>
		</article>
		<!-- /article -->

	<?php endwhile; ?>

	<?php else: ?>

		<!-- article -->
		<article>

			<h1><?php _e( 'Sorry, nothing to display.', 'html5blank' ); ?></h1>

		</article>
		<!-- /article -->

	<?php endif; ?>

	</section>
	<!-- /section -->
</main>

<?php get_sidebar(); ?>

<?php get_footer(); ?>
