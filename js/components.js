angular.module('components', ['ngResource'])
    .directive('aataResources', [ '$compile', '$q', '$resource', '$templateCache', '$timeout', '$document', ($compile, $q, $resource, $templateCache, $timeout, $document) => {
        function stateConstructor(obj = {}) {
            debugger;
            const def = Immutable.Map(obj);
            let s = def;

            let dispatcher = function (s) {};
            const methods = { get, set, setMultiple, setDispatch, dispatch, getAll };
            function set(key, value) {
                s = s.set(key, value);
            }
            function setMultiple(obj) {
                s = s.concat(obj);
            }
            function get(key) {
                return s.get(key);
            }
            function getAll() {
                return s;
            }
            function setDispatch(fn) {
                dispatcher = fn;
            }
            function dispatch() {
                debugger;
                dispatcher(s.toObject());
            }           
             
            return methods;
        }
        
        const main = $document[0].querySelector('.main'),
              lang = getLang(),
              mainJQ = jqLite(main),
              screen = jqLite($document[0].querySelector('.screen')),
              base = lang.url,
              restUrl = base + '/wp-json/wp/v2',
              rest = {
                  allPosts: $resource(restUrl + '/:type?page=:page', {
                      type: 'posts',
                      page: '@pageNum'
                  }),
                  byFilter: $resource(restUrl + '/:type?:filter=:slug', { 
                      type: '@type',
                      filter: '@filter',
                      slug: '@slug'
                  }),
                  byId: $resource(restUrl + '/:type/:id', { 
                      type: '@type',
                      id: '@id'
                  }),
                  all: $resource(restUrl + '/:type?per_page=:perPage', { 
                      type: '@type',
                      perPage: 10
                  })
              },
              get = {
                    postsPage: (page) => rest.allPosts.query({ page }).$promise,
                    byFilter: (slug, type, filter) => rest.byFilter.query({ 
                        type, filter, slug 
                    }).$promise, 
                    byId: (type, id) => rest.byId.get({ type, id }).$promise,
                    all: (type, perPage) => rest.all.query({ type, perPage }).$promise
              },
              comeOnDude = [ base ], // strings
              youShallNotPass = [ 'php', 'feed', 'wp-admin' ], // strings
              allTagsDef = get.all('tags', 100),
              state = new stateConstructor({
                  animated: null, 
                  loopType: null,
                  meta: null,
                  replace: null,
                  requestType: null,
                  url: null,
                  val: null
            });
        
        return {
            link: (scope, element, attrs) => {
                state.setDispatch(dispatcher);
                
                scope.lang = lang;
                // Scope functions
                scope.findTagById = findTagById;
                scope.fetchById  = fetchById;
                scope.fetchAllByTag  = fetchAllByTag;
                
                scope.formatDate = (date) => moment(date).format('MMM D, YYYY h:mm a');
                
                $timeout(() => {
                    bindLinks();
                    // Bind AjaxLink to popstate (Back/Forward) event 
                    jqLite(window).on('popstate', bindPopState);    
                });
                function bindPopState(event) {
                        const eventState = event.state;
                        
                        event.preventDefault();
                        ajaxLink(eventState);
                        
                        function ajaxLink(eventState) {
                            // Verify if history item was loaded through ajax
                            if (eventState != null) {
                                eventState.animated = prepareWindow();
                                setContent(eventState);
                            } else {
                                fetchPostOrPage(window.location.href.replace(base, ''), true);
                            }
                        }
                }; 
                function bindLinks() {
                    const links = element[0].querySelectorAll('a:not([resource-binded])');
                    let linkID = 0;

                    for (linkID = 0; linkID < links.length; linkID++) {
                        iterator(links[linkID]);
                    }
                    function iterator(linkEl) {
                        const link = jqLite(linkEl),
                              href = link.attr('href'),
                              ngClick = link.attr('ng-click'),
                              binded = link.attr('resource-binded');

                        if (href != null && ngClick == null && binded == null) {
                            if (checkLists(href)) {
                                link.attr('resource-binded', true);
                                link.on('click', (event) => {
                                    event.preventDefault();
                                    fetchPostOrPage(href.replace(base, ''));
                                });
                            }
                        }
                        function checkLists(href) {
                            let checks = [];
                            comeOnDude.forEach((item) => checks.push(href.indexOf(item) !== -1));
                            youShallNotPass.forEach((item) => checks.push(href.indexOf(item) === -1));

                            if (checks.indexOf(false) === -1) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                }
                
                function fetchAllByTag($event, data) {
                    $event.preventDefault();
                    const promise = get.byFilter(data.id, 'posts','tags'),
                        animated = prepareWindow();
                    promise.then((val) => {
                        changeState({
                            animated: animated,
                            loopType: 'tags',
                            requestType: 'loop',
                            url: data.link,
                            val,
                            meta: data
                        });
                    });
                }
                function fetchById($event, type, id) {
                    $event.preventDefault();
                    const promise = get.byId(type, id),
                        animated = prepareWindow();
                    
                    promise.then((val) => {
                        changeState({
                            animated: animated,
                            requestType: type,
                            url: val.link,
                            val: val
                        });
                    });
                }
                function fetchPostOrPage(slug, replace) {
                    const types = ['pages', 'posts'];
                    let promise = null,
                        slugArray = slug.match(/(([a-zA-Z0-9-_]+)(?=\/*))/g),
                        pageNum = null,
                        slugIndex = 0,
                        cleanSlug = '',
                        requestType = '',
                        animated = prepareWindow();

                    if (slugArray != null) {
                        // Verify if it's a paging link
                        if (slugArray[0] === 'page') {
                            pageNum = parseInt(slugArray[1]);
                            if (typeof pageNum === 'number') {
                                promise = get.postsPage(pageNum);
                            }
                        }
                        else if (slugArray[0] === 'announcements') {
                            cleanSlug = slugArray[slugArray.length - 1];
                            requestType = 'posts';
                            promise = get.byFilter(cleanSlug, requestType, 'slug');
                        }
                        else {                
                            cleanSlug = slugArray[slugArray.length - 1];
                            requestType = 'pages';
                            promise = get.byFilter(cleanSlug, requestType, 'slug');
                        }
                        
                        $q.when(promise).then((values) => {
                            if (values.length > 0) {
                                changeState({
                                    animated: animated,
                                    requestType: requestType,
                                    url: base + slug,
                                    val: values[0],
                                    replace: replace
                                });
                            } else {
                                getHome(animated);
                            }
                        });
                    } else {
                        getHome(animated);
                    }
                    function getHome(animated) {
                        get.postsPage(1).then((val) => {
                            changeState({
                                animated: animated,
                                replace: replace,
                                requestType: 'loop',
                                url: base + slug,
                                val: val
                            });
                        });
                    }
                }
                
                function changeState(obj) {
                    state.setMultiple(obj);
                    state.dispatch();
                }
                function dispatcher(s) {
                    setContent(s);

                    let action = 'pushState'
                    if (s.replace === true) {
                        action = 'replaceState';
                    } 
                    history[action](s, '', s.url);
                }

                function prepareWindow() {
                    const def = $q.defer();
                    screen.addClass('show');
                    $timeout(() => {
                        if (window.scrollTo != null) {
                            window.scrollTo(0, 0);
                        }
                        def.resolve();
                    }, 500);
                    return def.promise;
                }
                function setContent(s) {
                    const def = $q.defer();
                    $q.when(allTagsDef, s.animated)
                        .then((tags) => {
                            const template = $templateCache.get(s.requestType + '-template.html');
                            let el;

                            screen.removeClass('show');
                            scope.loopType = s.loopType;
                            scope.meta = s.meta;
                            scope.data = s.val;
                            scope.tags = tags;

                            el = $compile(template)(scope);
                            mainJQ.empty().append(el);
                            $timeout(() => {
                                scope.$digest();
                                def.resolve();
                                bindLinks();
                                if (s.requestType === 'loop') {
                                    bindLoop();
                                }
                            });
                        }, (val) => {
                            def.reject();
                        });

                    
                    return def.promise;
                    function bindLoop() {
                        const jqWindow = jqLite(window),
                              padding = 200;
                        let mainEnd = checkMainEnd();
                        jqWindow
                            .off('resize', checkMainEnd)
                            .on('resize', checkMainEnd)
                            .on('scroll', scrollBind);

                        function checkMainEnd() {
                            return saKnife.offset(main).top + main.offsetHeight - saKnife.winSize().height;
                        }
                        function scrollBind(event) {
                            if ((window.scrollY + padding) >= mainEnd) {
                                console.log('fetch more');
                            }
                        }
                    }
                }
                
                function findTagById(id, tags) {
                    let found = [];
                    tags.forEach((tag) => {
                        if (tag.id === id) {
                            found.push(tag)
                        }
                    });
                    if (found.length > 0) {
                        return found[0];
                    }
                }
            }
        };
        function getLang() {
            const titlesEl = jqLite($document[0].querySelector('#section-titles'));
            let titles = 'titles = ';

            return eval(titles + titlesEl.html());
        }
    }])
    .directive('aataMenu', ['$document', ($document) => {
        return {
            link: (scope, element, attrs) => {
                const menuItems = element.find('li');
                menuItems.forEach((item) => {
                    
                });
            }
        };
    }]);