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
			<h1 class="main__title"><?php the_title(); ?></h1>
			<!-- /post title -->

			<div class="article__content">
	            <!-- post details -->
	            <time class="article__date"><?php the_time('j \d\e M \d\e Y'); ?></time>
	            <span class="article__author">Escrito por: <?php the_author(); ?></span>
	            <!-- the_author_posts_link(); /post details -->
				<div>
                	<?php the_content(); // Dynamic Content ?>
				</div>
                <?php edit_post_link(); // Always handy to have Edit Post Links available ?>
            </div>
            <div class="article__tags">
                <span class="sr-only">Etiquetas </span>
                <?php 
	                if (has_tag()) {
		                get_template_part('img/icons/tagicon');
						the_tags( ' ', ', '); // Separated by commas with a line break at the end 
	                }
				?>
            </div>

            <p class="hidden"><?php _e( 'Categorised in: ', 'html5blank' ); the_category(', '); // Separated by commas ?></p>
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
