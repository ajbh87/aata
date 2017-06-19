<!-- sidebar -->
<aside class="sidebar" role="complementary" 
	aata-transfer=".nav" 
	aata-transfer-break="1200">
	<div class="sidebar__search">
		<?php get_template_part('searchform'); ?>
	</div>
	<div class="sidebar__content">
		<h5>Para consultas o citas: </h5>
		<ul class="sidebar__link-list">
			<li>
				<a href="<?php echo home_url(); ?>/contacto" class="sidebar__link">
					<svg class="icon icon--comment" aria-hidden="true">
		                <use xlink:href="#commentIcon" />
		            </svg>
					Contacto
				</a>
			</li>
			<li>
				<a href="tel:+1-787-200-6474" class="sidebar__link">
					<svg class="icon icon--phone" aria-hidden="true">
		                <use xlink:href="#phoneIcon" />
		            </svg>
					787-200-6474
				</a>
			</li>
			<li>
				<a href="mailto:consulta@tusabogadospr.com?subject=Consulta" class="sidebar__link">
					<svg class="icon icon--mail" aria-hidden="true">
		                <use xlink:href="#emailIcon" />
		            </svg>
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
