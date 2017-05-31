import saKnife from './libs/saKnife.js';
import Immutable from '../node_modules/immutable/dist/immutable.js';
import find from '../node_modules/lodash.find/index.js';
const _ = {
    find
}
function initComponents(angular) {
    const jqLite = angular.element;
    angular.module('components', ['ngResource'])
    .directive('aataResources', [ '$compile', '$q', '$sce', '$resource', '$templateCache', '$cacheFactory', '$timeout', '$document',
        ($compile, $q, $sce, $resource, $templateCache, $cacheFactory, $timeout, $document) => {
        class stateConstructor {
            constructor(def = {}) {
                let s = Immutable.Map(def),
                    dispatcher = (s) => {};
                const options = s,
                    keyDispatchers = {};

                this.set = (key, value) => {
                    s = s.set(key, value);
                    if (keyDispatchers[key] != null) {
                        keyDispatchers[key](value, s.toObject());
                    }
                };
                this.setMultiple = (obj) => s = s.concat(obj);
                this.new = (obj) => s = options.concat(obj);
                this.get = (key) => s.get(key);
                this.setDispatch = (fn) => dispatcher = fn;
                this.dispatch = () => dispatcher(s.toObject());
                this.setKeyDispatcher = (key1, fn) => {
                    s.forEach((val, key2) => {
                        if (key1 === key2) {
                            keyDispatchers[key1] = fn; 
                            return false; 
                        }
                    });
                };
                this.getObj = () => s.toObject();
            }
        };
        
        const main = $document[0].querySelector('.main'),
            lang = getLang(),
            jqWindow = jqLite(window),
            mainJQ = jqLite(main),
            base = lang.url,
            restUrl = base + '/wp-json/wp/v2',
            cache = {
                posts: $cacheFactory('posts')
            },
            defaultResourceOptions = {
                get: { method:'GET', cache: true},
                query: { method:'GET', cache: true, isArray:true }
            },
            rest = {
                allPosts: $resource(restUrl + '/:type?page=:page', {
                    type: 'posts',
                    page: '@pageNum'
                }, {
                    get: { method:'GET', cache: cache.posts},
                    query: { method:'GET', cache: cache.posts, isArray:true }
                }),
                byFilter: $resource(restUrl + '/:type?:filter=:slug&page=:page', { 
                    type: '@type',
                    filter: '@filter',
                    slug: '@slug',
                    page: 1
                }, defaultResourceOptions),
                byId: $resource(restUrl + '/:type/:id', { 
                    type: '@type',
                    id: '@id'
                }, defaultResourceOptions),
                all: $resource(restUrl + '/:type?per_page=:perPage', { 
                    type: '@type',
                    perPage: 10
                }, defaultResourceOptions)
            },
            get = {
                postsPage: (page) => rest.allPosts.query({ page }).$promise,
                byFilter: (slug, type, filter, page = 1) => rest.byFilter.query({ 
                    type, filter, slug, page
                }).$promise, 
                byId: (type, id) => rest.byId.get({ type, id }).$promise,
                all: (type, perPage) => rest.all.query({ type, perPage }).$promise
            },
            comeOnDude = [ base ], // strings
            youShallNotPass = [ 'php', 'feed', 'wp-admin', 'contacto' ], // strings
            state = new stateConstructor({
                animated: null, // promise
                currentPage: 1,
                loopType: '', // posts | tags
                lastPage: false,
                meta: {}, // tag archive meta - obj
                pastBottom: false,
                replace: false, // replace history - bool
                requestType: '', // posts | pages | loop
                scrolled: 0,
                url: '',
                val: {}
            }),
            allUsersDef = reallyGetAll('users'),
            allTagsDef = reallyGetAll('tags');
        let unbindLoop = checkIfLoop();
        return {
            link: (scope, element, attrs) => {
                const fetch = {
                    byId: ($event, type, id) => {
                        $event.preventDefault();
                        const promise = get.byId(type, id),
                            animated = prepareWindow();
                        
                        promise.then((val) => {
                            changeState({
                                replace: false,
                                animated: animated,
                                requestType: type,
                                url: val.link,
                                val: val
                            });
                        });
                    },
                    allByTag: ($event, data) => {
                        $event.preventDefault();
                        const promise = get.byFilter(data.id, 'posts','tags'),
                            animated = prepareWindow();
                        promise.then((val) => {
                            changeState({
                                replace: false,
                                animated: animated,
                                loopType: 'tags',
                                requestType: 'loop',
                                url: data.link,
                                val,
                                meta: data
                            });
                        });
                    },
                    postOrPage: (slug, replace) => {
                        const types = ['pages', 'posts'];
                        let promise = null,
                            slugArray = slug.match(/(([a-zA-Z0-9-_]+)(?=\/*))/g),
                            pageNum = null,
                            slugIndex = 0,
                            cleanSlug = '',
                            requestType = '',
                            animated = prepareWindow(),
                            filter = '';

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
                                if (slugArray[1] === 'author'){
                                    filter = slugArray[1]; // ToDo
                                } else {
                                    filter = 'slug';
                                }
                                promise = get.byFilter(cleanSlug, requestType, filter);
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
                                    loopType: 'posts',
                                    url: base + slug,
                                    val: val
                                });
                            });
                        }
                    }
                }
                state.setDispatch(dispatcher);
                state.setKeyDispatcher('pastBottom', loopDispatcher);

                scope.hidePagination = true;
                scope.lang = lang;

                // Scope functions
                scope.fetch = fetch;
                scope.findTagById = (id, tags) => _.find(tags, (o) => o.id === id );
                scope.formatDate = (date) => {
                    const monthsFull = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ],
                        monthsAbbr = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ];
                    let theDay = new Date(date),
                        monthName = monthsAbbr[theDay.getMonth()],
                        formattedDate = '',
                        amPM = '';
                    formattedDate = theDay.getDate() + ' de ' +
                                    monthName + ' de ' +
                                    theDay.getFullYear();
                    return formattedDate;
                };
                scope.trustHtml = (html) => $sce.trustAsHtml(html);

                $timeout(() => {
                    bindLinks();
                    // Bind AjaxLink to popstate (Back/Forward) event 
                    jqLite(window).on('popstate', (event) => {
                        event.preventDefault();
                        const eventState = event.state;
                        let posts = cache.posts
                        // Verify if history item was loaded through ajax
                        if (eventState != null) {
                            eventState.animated = prepareWindow();
                            state.new(eventState);
                            setContent(eventState);
                        }
                        else {
                            fetch.postOrPage(window.location.href.replace(base, ''), true);
                        }
                    });    
                });

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
                                    fetch.postOrPage(href.replace(base, ''));
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
                function changeState(obj) {
                    const oldState = state.getObj();
                    history.replaceState(oldState, '', oldState.url);
                    if (obj.requestType === 'loop') {
                        obj.currentPage = 1;
                        obj.lastPage = false;
                    } 
                    state.new(obj);
                    state.dispatch();
                }
                function dispatcher(s) {
                    const def = setContent(s);
                    $q.when(def).then(() => {
                        let action = 'pushState'
                        if (s.replace === true) {
                            action = 'replaceState';
                        } 
                        history[action](s, '', s.url);
                    });
                }
                function prepareWindow(append, small) {
                    const def = $q.defer();
                    state.set('scrolled', window.scrollY);

                    if (small === true) scope.showScreenSm = true;
                    else scope.showScreen = true;                    
                    $timeout(() => {
                        if (window.scrollTo != null && append == null) {
                            window.scrollTo(0, 0);
                        }
                        def.resolve();
                    }, 200);
                    return def.promise;
                }
                function setContent(s, append) {
                    const def = $q.defer();
                    $q.all([allTagsDef, allUsersDef, s.animated])
                        .then((values) => {
                            const template = $templateCache.get(s.requestType + '-template.html');
                            let el, 
                                subScope = scope.$new();
                            if (s.requestType === 'posts') {
                                s.meta = {
                                    author: _.find(values[1], (o) => o.id === s.val.author )
                                };
                            }
                            subScope = Object.assign(subScope, {
                                loopType: s.loopType,
                                meta: s.meta,
                                data: s.val,
                                tags: values[0],
                                currentPage: s.currentPage,
                                append
                            });
                            scope.showScreen = false;
                            scope.showScreenSm = false;
                            scope.showMenu = false; 

                            el = $compile(template)(subScope);
                            if (append !== true) mainJQ.empty();

                            mainJQ.append(el);
                            $timeout(() => {
                                scope.$digest();
                                def.resolve();
                                bindLinks();
                                if (s.requestType === 'loop') {
                                    unbindLoop = bindLoop();
                                } else {
                                    unbindLoop();
                                }
                            });
                        }, (val) => {
                            def.reject();
                        });
                    return def.promise;
                }
                function loopDispatcher(val) {
                    const currentState = state.getObj(),
                        nextPage = currentState.currentPage + 1;
                    let promise, animated;
                    if (val === true && currentState.requestType === 'loop' && currentState.lastPage !== true) {
                        if (currentState.loopType === 'tags') {
                            promise = get.byFilter(currentState.meta.id, 'posts','tags', nextPage);
                        } else {
                            promise = get.postsPage(nextPage);
                        }
                        animated = prepareWindow(true, true);
                        promise.then((val) => {
                            if (val.length > 0) {
                                state.setMultiple({
                                    animated,
                                    currentPage: nextPage,
                                    val
                                });
                                setContent(state.getObj(), true);
                            }
                            else {
                                state.setMultiple({
                                    lastPage: true
                                });
                                scope.showScreen = false;
                                scope.showScreenSm = false;
                            }
                        });
                    }
                }
            }
        };
        function reallyGetAll(name) {
            const def = $q.defer();
            let page = 1,
                items = [];
            get.all(name, 100, page).then((response) => {
                getNextPage(response, page)
            });
            return def.promise;
            function getNextPage(val, activePage) {
                activePage++;
                items = items.concat(val);
                if (val.length >= 100) {
                    get.all(name, 100, activePage).then((newVal) => {
                        getNextPage(newVal, activePage);
                    });
                } else {
                    def.resolve(items);
                }
            }
        }
        function checkIfLoop() {
            const slug = window.location.href.replace(base, ''),
                isTag = slug.includes('tag');
            if (isTag === true || slug === '/') {
                if (isTag === true) {
                    $q.when(allTagsDef).then((tags) => {
                        let found = [];
                        tags.forEach((tag) => {
                            if (tag.link === window.location.href) found.push(tag);
                            return false;
                        });
                        if (found.length > 0) state.set('meta', found[0]);
                    });
                    state.setMultiple({
                        url: window.location.href,
                        requestType: 'loop',
                        loopType: 'tags'
                    });
                } else {
                    // Post loop 
                    get.postsPage(1).then((val) => {
                        state.set('val', val)
                    });
                    state.setMultiple({
                        url: window.location.href,
                        requestType: 'loop',
                        loopType: 'posts'
                    });
                }
                return bindLoop();
            } else {
                return () => {};
            }
        }
        function bindLoop() {
            const padding = 200;
            let mainEnd, 
                pastBottom = false;
            state.set('pastBottom', pastBottom);

            jqWindow.on('resize', checkMainEnd).on('scroll', scrollBind);
            mainJQ.on('resize', checkMainEnd);

            checkMainEnd();
            function checkMainEnd() {
                mainEnd = saKnife.offset(main).top + main.offsetHeight - saKnife.winSize().height;
            }
            function scrollBind(event) {
                if ((window.scrollY + padding) >= mainEnd) {
                    if (pastBottom === false) {
                        pastBottom = true;
                        state.set('pastBottom', pastBottom);
                    }
                }
            }
            return () => {
                mainJQ.off('resize', checkMainEnd);
                jqWindow.off('resize', checkMainEnd).off('scroll', scrollBind);;
            };
        }
        function getLang() {
            const titlesEl = jqLite($document[0].querySelector('#section-titles'));
            let titles = 'titles = ';

            return eval(titles + titlesEl.html());
        }
        function insertCachedPostPages() {
            // ToDo
        }
    }])
    .directive('aataMenu', ['$document', '$compile', '$templateCache', 
        ($document, $compile, $templateCache) => {
        return {
            link: (scope, element, attrs) => {
                const selector = attrs.aataMenu,
                    menu = element.find('div');
                let items, index = 0;
                menu.detach();
                items = menu[0].querySelectorAll(selector);
                element.addClass('js');
                for (index = 0; index < items.length; index++) {
                    items[index].innerHtml = insertExpand(items[index]);
                }
                element.append(menu);

                function insertExpand(item) {
                    let subScope = scope.$new(),
                        compiled = '';
                    const expand =  $templateCache.get('expand.html');;
                    const ulChildren = jqLite(item).find('ul');
                    subScope.showChildren = false;
                    ulChildren.attr('ng-class', "{'is-active': showChildren}");
                    jqLite(item).prepend(expand);
                    return $compile(item)(subScope);
                }
            }
        };
    }]);
}

export default initComponents;