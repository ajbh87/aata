        </div>
        <!-- /wrapper -->
		<!-- footer -->
		<footer class="footer" role="contentinfo">

			<!-- copyright -->
			<p class="copyright">
				&copy; <?php echo date('Y'); ?> Copyright <?php bloginfo('name'); ?>. <?php _e('Powered by', 'html5blank'); ?>
				<a href="//wordpress.org" title="WordPress">WordPress</a> &amp; <a href="//html5blank.com" title="HTML5 Blank">HTML5 Blank</a>.
			</p>
			<!-- /copyright -->
		</footer>
		<!-- /footer -->
		<?php wp_footer(); ?>
    <div class="screen" aria-hidden="true">
        <div class="loader screen__loader"></div>
    </div>
    <div class="screen-sm" aria-hidden="true">
        <div class="loader screen-sm__loader"></div>
    </div>
    <script type="application/json" id="section-titles">
        {
            "url": "<?php echo home_url(); ?>",
            "archives": "<?php _e( 'Archives', 'html5blank' ); ?>",
            "categories": "<?php _e( 'Categories for ', 'html5blank' ); ?>",
            "posts": "<?php _e( 'Latest Posts', 'html5blank' ); ?>",
            "tags": "<?php _e( 'Tags: ', 'html5blank' ); ?>",
            "tagArchive": "<?php _e( 'Tag Archive: ', 'html5blank' ); ?>",
            "categoriesIn": "<?php _e( 'Categorised in: ', 'html5blank' ); ?>"
        }
    </script>
    <script type="text/ng-template" id="pages-template.html">
        <section>
            <article class="article article--page page">
                <h1 class="main__title" ng-bind-html="data.title.rendered"></h1>
                <div class="article__content" ng-bind-html="data.content.rendered"></div>
            </article>
        </section>
    </script>
    <script type="text/ng-template" id="posts-template.html">
        <article id="post-{{data.id}}" class="article article--post post">
            <!-- post title -->
            <h1 class="main__title"
                ng-bind-html="data.title.rendered"></h1>
            <!-- /post title -->
            <!-- post details -->
            <span class="article__date" ng-bind="formatDate(data.date)"></span>
            <span class="article__author"></span>
            <!-- /post details -->

            <div class="article__content" ng-bind-html="data.content.rendered"></div>
            <p ng-if="data.tags.length > 0">
                <span ng-bind="lang.tags"></span>
                <span ng-repeat="tag in data.tags" ng-init="tagInfo = findTagById(tag, tags)">
                    <a href="{{tagInfo.link}}"
                        ng-click="fetchAllByTag($event, tagInfo)"
                        ng-bind="tagInfo.name"></a>&nbsp;
                </span>
            </p>
        </article>
    </script>
    <script type="text/ng-template" id="loop-template.html">
        <section class="" 
            data-current-page="{{currentPage}}">
            <h1 class="main__title"
                ng-if="currentPage <= 1"
                ng-bind="(loopType == 'tags') ? lang.tagArchive + ' ' + meta.name : lang.posts"></h1>
            <article ng-repeat="item in data" 
                id="post-{{item.id}}"
                class="article">
                <!-- post title -->
                <h2 class="article__title">
                    <a title="{{item.title.rendered}}"
                        href="{{item.link}}"
                        ng-bind-html="item.title.rendered"
                        ng-click="fetchById($event, 'posts', item.id)"></a>
                </h2>
                <!-- /post title -->
                <!-- post details -->
                <time class="article__date" datetime="{{item.date}}" ng-bind="formatDate(item.date)"></time>
                <!-- /post details -->
                <div class="article__excerpt">
                    <p ng-bind-html="item.excerpt.rendered"></p>
                </div>
            </article>
        </section>
    </script>

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
