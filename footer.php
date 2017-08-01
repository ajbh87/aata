        </div>
        <!-- /wrapper -->
    <nav class="mobile">
      <a href="<?php echo home_url(); ?>/contacto" 
        aata-button class="mobile__link">
        <svg class="icon icon--comment mobile__icon" aria-hidden="true">
            <use xlink:href="#commentIcon" />
        </svg>
        <span class="mobile__text">Contacto</span>
      </a>
      <a href="tel:+1-787-200-6474" 
        aata-button class="mobile__link">
        <svg class="icon icon--phone mobile__icon" aria-hidden="true">
            <use xlink:href="#phoneIcon" />
        </svg>
        <span class="mobile__text">787-200-6474</span>
      </a>
      <a href="mailto:consulta@tusabogadospr.com?subject=Consulta"
        aata-button class="mobile__link">
        <svg class="icon icon--mail mobile__icon" aria-hidden="true">
            <use xlink:href="#emailIcon" />
        </svg>
        <span class="mobile__text">consulta@tusabogadospr.com</span>
      </a>
    </nav>
    <!-- footer -->
    <footer class="footer" role="contentinfo">

      <!-- copyright -->
      <p class="copyright">
        &copy; <?php echo date('Y'); ?> Copyright <?php bloginfo('name'); ?>. Created by: <a href="https://alfredo.xyz" title="Theme Creator's Website">Alfredo J. Bermúdez</a> using 
        <a href="//wordpress.org" title="WordPress">WordPress Rest API</a> &amp; AngularJS
      </p>
      <!-- /copyright -->
    </footer>
    <!-- /footer -->
    <?php wp_footer(); ?>
    
    <div class="screen" aria-hidden="true" 
      ng-class="{'show': showScreen == true}">
        <div class="loader screen__loader"></div>
    </div>
    <div class="screen-sm" aria-hidden="true" 
      ng-class="{'show': showScreenSm == true || showFormScreen == true}">
        <div class="loader screen-sm__loader"></div>
    </div>
    <?php get_template_part('ng-templates'); ?>
    <!-- analytics -->
    <!--
    	<script>
    	(function(f,i,r,e,s,h,l){i['GoogleAnalyticsObject']=s;f[s]=f[s]||function(){
    	(f[s].q=f[s].q||[]).push(arguments)},f[s].l=1*new Date();h=i.createElement(r),
    	l=i.getElementsByTagName(r)[0];h.async=1;h.src=e;l.parentNode.insertBefore(h,l)
    	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    	ga('create', 'UA-XXXXXXXX-XX', 'yourdomain.com');
    	ga('send', 'pageview');
    	</script>
-->
	</body>
</html>
