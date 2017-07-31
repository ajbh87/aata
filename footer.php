        </div>
        <!-- /wrapper -->
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
