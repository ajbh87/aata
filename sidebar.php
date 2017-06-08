<!-- sidebar -->
<aside class="sidebar" role="complementary">
	<div class="sidebar__search">
		<?php get_template_part('searchform'); ?>
	</div>
	<div class="sidebar__content">
		<h5>Para información, consultas o citas: </h5>
		<ul class="sidebar__link-list">
			<li>
				<a href="tel:+1-787-200-6474" class="sidebar__link">
					<?php get_template_part('img/icons/phoneicon'); ?>
					787-200-6474
				</a>
			</li>
			<li>
				<a href="mailto:consulta@tusabogadospr.com?subject=Consulta" class="sidebar__link">
					<?php get_template_part('img/icons/mailicon'); ?>
					consulta@tusabogadospr.com
				</a>
			</li>
		</ul>
        <div class="sidebar-widget">
            <?php if(!function_exists('dynamic_sidebar') || !dynamic_sidebar('widget-area-2')) ?>
        </div>
    </div>
</aside>
<!-- /sidebar -->
