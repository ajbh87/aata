<?php if (have_posts()): while (have_posts()) : the_post(); ?>

	<!-- article -->
	<article id="post-<?php the_ID(); ?>" class="article<?php 
			$categories = get_the_category();
			if ( ! empty( $categories ) ) {
				echo " cat--".$categories[0]->term_id;   
			}
		?>">

		<!-- post thumbnail -->
		<?php if ( has_post_thumbnail()) : // Check if thumbnail exists ?>
			<a href="<?php the_permalink(); ?>" 
               title="<?php the_title(); ?>" 
               aata-modal="<?php the_ID(); ?>">
				<?php the_post_thumbnail(array(120,120)); // Declare pixel size you need inside the array ?>
			</a>
		<?php endif; ?>
		<!-- /post thumbnail -->

		<?php if ($categories[0]->term_id == 34) { ?> 
			<div class="label label--category">
				<span class="sr-only">Categoría: </span>
				<?php echo esc_html( $categories[0]->name ); ?>
			</div>
		<?php } ?>
		<!-- post title -->
		<h2 class="article__title">
			<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
				<?php the_title(); ?>
            </a>
		</h2>
		<!-- /post title -->

        <!-- post details -->
        <div class="article__date"><?php the_time('j \d\e M \d\e Y'); ?></div>
        <!-- /post details -->
        <div class="article__excerpt">
		  <?php html5wp_excerpt(); // Build your custom callback length in functions.php ?>
        </div>

		<?php edit_post_link(); ?>

	</article>
	<!-- /article -->

<?php endwhile; ?>

<?php else: ?>

	<!-- article -->
	<article>
		<h2><?php _e( 'Sorry, nothing to display.', 'html5blank' ); ?></h2>
	</article>
	<!-- /article -->

<?php endif; ?>
