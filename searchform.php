<!-- search -->
<form class="search" method="get" action="<?php echo home_url(); ?>" role="search">
	<input class="search__input" type="search" name="s" placeholder="Buscar">
	<button class="search__submit" type="submit" role="button">
		<span class="sr-only">Buscar</span>
		<?php get_template_part('img/icons/searchicon'); ?>
	</button>
</form>
<!-- /search -->
