import saKnife from './libs/saKnife.js';
import Immutable from '../node_modules/immutable/dist/immutable.js';
import find from '../node_modules/lodash.find/index.js';
import debounce from '../node_modules/lodash.debounce/index.js';
import defer from '../node_modules/lodash.defer/index.js';
import unionWith from '../node_modules/lodash.unionwith/index.js';
import isEqual from '../node_modules/lodash.isequal/index.js';
const _ = {
    debounce,
    defer,
    find,
    isEqual,
    unionWith
}
function initComponents(angular) {
    const jqLite = angular.element;
    angular.module('components', ['ngResource'])
    .directive('aataScript', function() {
        return {
          //restrict: 'E',
          scope: false,
          link: function(scope, elem, attr) {
            debugger;
            if (attr.type==='text/javascript-lazy') 
            {
              var s = document.createElement("script");
              s.type = "text/javascript";                
              var src = elem.attr('src');
              if(src!==undefined)
              {
                  s.src = src;
              }
              else
              {
                  var code = elem.text();
                  s.text = code;
              }
              document.head.appendChild(s);
              elem.remove();
            }
          }
        };
      })
    .directive('aataForm', ['$http', function($http) {
        //const url = 'https://script.google.com/macros/s/AKfycbxSLxSc1hQDCem19CwratFghY8qzc65iLYfPOIZMAQa9IE1u7k/exec';
        return {
            templateUrl: 'form.html',
            scope: true,
            link: function(scope, element, attrs) {
                const url = attrs.aataForm;
                const defs = Immutable.Map({
                                    name: '',
                                    lastName: '',
                                    email: '',
                                    tel: '',
                                    asunto: {
                                        adopcion: {
                                            text: 'Adopción',
                                            selected: false
                                        },
                                        capitul: {
                                            text: 'Capitulaciones Matrimoniales',
                                            selected: false
                                        },
                                        custodia: {
                                            text: 'Custodia',
                                            selected: false
                                        },
                                        decla: {
                                            text: 'Declaratoria de Herederos',
                                            selected: false
                                        },
                                        divi: {
                                            text: 'División de Bienes Gananciales',
                                            selected: false
                                        },
                                        divorcio: {
                                            text: 'Divorcio',
                                            selected: false
                                        },
                                        herencia: {
                                            text: 'Herencia',
                                            selected: false
                                        },
                                        patriaPot: {
                                            text: 'Patria Potestad',
                                            selected: false
                                        },
                                        pension: {
                                            text: 'Pensión Alimentaria',
                                            selected: false
                                        },
                                        otro: {
                                            text: 'Otro',
                                            selected: false
                                        }
                                    },
                                    comments: ''
                                });
                scope = Object.assign(scope, defs.toObject());
                scope.submitForm = function(event) {
                    event.preventDefault();
                    window.submitForm = submitForm;
                    grecaptcha.execute();

                    function submitForm(token) {
                        debugger;
                        const formData = {
                                Nombre: scope.name,
                                Apellidos: scope.lastName,
                                Email: scope.email,
                                Telefono: scope.tel,
                                Asunto: generateList(scope.asunto),
                                Pregunta: scope.comments,
                                'g-recaptcha-response': token
                            },
                            encoded = getEncoded(formData);
                        debugger;
                        $http({
                            method: 'POST',
                            url: url,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            data: encoded
                        }).then(
                            function success(response) {
                                debugger;
                            }, 
                            function error(response) {

                            }
                        );
                        function generateList(items) {
                            let list = '', key;
                            for (key in items) {
                                if (items[key].selected) {
                                    list += ' - ' + items[key].text;
                                }
                            }
                            return list;
                        }
                    }
                }
            }
        }
        function getEncoded(data) {
            return Object.keys(data).map(function(k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
                }).join('&');
        }
    }])
    .directive('aataResources', [ '$compile', '$q', '$sce', '$resource', '$templateCache', '$timeout', '$document',
        function ($compile, $q, $sce, $resource, $templateCache, $timeout, $document) {
        class stateConstructor {
            constructor(def = {}) {
                this.s = Immutable.Map(def);
                this.pristine = this.s;
                this.dispatcher = (s) => {};
                this.keyDispatchers = {};
            }
            set(key, value) {
                this.s = this.s.set(key, value);
                if (this.keyDispatchers[key] != null) {
                    this.keyDispatchers[key](value, this.s.toObject());
                }
            }
            setDispatch(fn) {
                this.dispatcher = fn;
            }
            dispatch() {
                this.dispatcher(this.s.toObject());
            }
            setKeyDispatcher(key1, fn) {
                this.s.forEach((val, key2) => {
                    if (key1 === key2) {
                        this.keyDispatchers[key1] = fn; 
                        return false; 
                    }
                });
            };
            setMultiple(obj) {
                this.s = this.s.concat(obj);
            }
            new(obj){
                this.s = this.pristine.concat(obj);
            }
        };
        
        const main = $document[0].querySelector('.main'),
            lang = getLang(),
            base = lang.url,
            restUrl = base + '/wp-json/wp/v2',
            cache = {
                posts: [],
                tags: []
            },
            defaultResourceOptions = {
                get: { method:'GET', cache: true},
                query: { method:'GET', cache: true, isArray:true }
            },
            rest = {
                allPosts: $resource(restUrl + '/:type?page=:page', {
                    type: 'posts',
                    page: '@pageNum'
                }, defaultResourceOptions),
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
                postsPage: (page) => {
                    let request = rest.allPosts.query({ page }, (val) => {
                        cache.posts = _.unionWith(cache.posts, val, _.isEqual);
                    });
                    return request.$promise;
                },
                byFilter: (slug, type, filter, page = 1) => {
                    let request = rest.byFilter.query({ type, filter, slug, page }, (val) => {
                        if (type === 'posts' && filter === 'tags') {
                            cache.tags = cache.tags.concat(val);
                        }
                    });
                    return request.$promise;
                }, 
                byId: (type, id) => rest.byId.get({ type, id }).$promise,
                all: (type, perPage) => rest.all.query({ type, perPage }).$promise
            },
            comeOnDude = [ base ], // strings
            youShallNotPass = [ 'php', 'feed', 'wp-admin' ], // strings
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
        let unbindLoop = () => {};
        jqLite(window).on('scroll', _.debounce(checkScrollPosition, 250));

        (function checkCurrentPage() {
            const slug = window.location.href.replace(base, ''),
                processed = processSlug(slug),
                def = $q.defer();
            let requestType = '';
            if (processed.isTag || processed.isAuthor || processed.isSearch || processed === false) {
                if (processed.isTag) {
                    $q.when(allTagsDef).then((tags) => {
                        let tagMeta = _.find(tags, (tag) => tag.link === window.location.href);
                        state.new({
                            loopType: 'tags',
                            meta: tagMeta,
                            requestType: 'loop',
                            url: window.location.href
                        });
                        get.byFilter(tagMeta.id, 'posts', 'tags').then((val) => {
                            state.set('val', val)
                        });
                        def.resolve(bindLoop());
                    });
                } 
                else {
                    // Post loop 
                    state.new({
                        url: window.location.href,
                        requestType: 'loop',
                        loopType: 'posts'
                    });
                    get.postsPage(1).then((val) => {
                        state.set('val', val)
                    });
                    def.resolve(bindLoop());
                }
            } else {
                if (processed.isPosts) {
                    requestType = 'posts';
                }
                else {
                    requestType = 'pages';
                }
                state.new({
                    loopType: null,
                    meta: {},
                    requestType,
                    url: window.location.href
                });
                // processed.slugArray[processed.slugArray.length - 1] = last
                get.byFilter(processed.slugArray[processed.slugArray.length - 1], requestType, 'slug').then((val) => {
                    state.set('val', val[0])
                });
                def.resolve(() => {});
            }
            return def.promise;
        })().then((fn) => {
            unbindLoop = fn;
        });
        return {
            link: function (scope, element, attrs) {
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
                    postOrPage: function(slug, replace) {
                        const processed = processSlug(slug),
                            slugArray = processed.slugArray,
                            types = ['pages', 'posts'];

                        let promise = $q.defer(),
                            pageNum = null,
                            slugIndex = 0,
                            cleanSlug = '',
                            requestType = '',
                            animated = prepareWindow(),
                            filter = '',
                            loopType = '',
                            meta = {};

                        if (slugArray != null) {
                            // Verify if it's a paging link
                            if (processed.isPagingPage) {
                                pageNum = parseInt(slugArray[1]);
                                if (typeof pageNum === 'number') {
                                    promise = get.postsPage(pageNum);
                                }
                            }
                            else if (processed.isPosts) {
                                cleanSlug = slugArray[slugArray.length - 1];
                                requestType = 'posts';
                                if (processed.isAuthor || processed.isTag){
                                    $q.all([allTagsDef, allUsersDef]).then((defValues) => {
                                        const allTags = defValues[0],
                                            allUsers = defValues[1];
                                        if (processed.isTag) {
                                            meta = _.find(allTags, (tag) => tag.slug === cleanSlug);
                                            cleanSlug = meta.id;
                                            filter = loopType = 'tags';
                                        }
                                        else {
                                            meta = _.find(allUsers, (user) => user.slug === cleanSlug);
                                            cleanSlug = meta.id;
                                            filter = loopType = 'author';
                                        }
                                        requestType = 'loop';
                                        get.byFilter(cleanSlug, 'posts', filter).then((val) => {
                                            promise.resolve(val);
                                        });
                                    });
                                }
                                else {
                                    filter = 'slug';
                                    promise = get.byFilter(cleanSlug, 'posts', filter);
                                }
                            }
                            else {                
                                cleanSlug = slugArray[slugArray.length - 1];
                                requestType = 'pages';
                                promise = get.byFilter(cleanSlug, requestType, 'slug');
                            }
                            
                            $q.when(promise).then((values) => {
                                let val = (processed.isAuthor || processed.isTag) ? values : values[0];

                                if (values.length > 0) {
                                    changeState({
                                        animated,
                                        loopType,
                                        meta,
                                        replace,
                                        requestType,
                                        url: base + slug,
                                        val
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

                        // Verify if history item was loaded through ajax
                        if (eventState != null) {
                            if (location.href.indexOf('?s=') === -1) {
                                eventState.animated = prepareWindow();
                                state.new(eventState);
                                if (eventState.requestType === 'loop' && eventState.currentPage > 1) {
                                    loopPosts(state.s.toObject());
                                } else {
                                    setContent(eventState);
                                }
                            }
                            else location.href = location.href;
                        }
                        else {
                            fetch.postOrPage(window.location.href.replace(base, ''), true);
                        }
                        function loopPosts(subState) {
                            subState.val = cache[subState.loopType];
                            $q.when(setContent(subState)).then(() => {
                                const y = state.s.get('scrolled');
                                if (window.scrollTo != null) {
                                    window.scrollTo(0, y);
                                }
                            });
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
                    const oldState = state.s.toObject();
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
                    requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            scope.$digest();
                            $timeout(() => {
                                if (window.scrollTo != null && append == null) {
                                    window.scrollTo(0, 0);
                                }
                                def.resolve();
                            }, 200);
                        });      
                    });
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
                                    author: _.find(values[1], (author) => author.id === s.val.author )
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

                            if (append !== true) jqLite(main).empty();
                            jqLite(main).append(el);
                            requestAnimationFrame(function() {
                                requestAnimationFrame(function () {
                                    scope.$digest();
                                    def.resolve();
                                    bindLinks();
                                    if (s.requestType === 'loop') {
                                        unbindLoop = bindLoop();
                                    } else {
                                        unbindLoop();
                                    }
                                });
                            });
                        }, (val) => {
                            def.reject();
                        });
                    return def.promise;
                }
                function loopDispatcher(val) {
                    const currentState = state.s.toObject(),
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
                                setContent(state.s.toObject(), true);
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

        function processSlug(slug) {
            const slugArray = slug.replace(/#([a-zA-Z0-9\-\_])+/g, '')
                                .match(/(([a-zA-Z0-9\-\_?=]+)(?=\/*))/g);
            if (slugArray != null) {
                let last = slugArray[slugArray.length - 1],
                    isSearch = (last.indexOf('?s=') !== -1);
                if (isSearch) {
                    slugArray[slugArray.length - 1] = last.replace('?s=', '');
                }
                return {
                    slugArray,
                    isSearch,
                    isTag: slugArray[1] === 'tag',
                    isAuthor: slugArray[1] === 'author',
                    isPosts: slugArray[0] === 'announcements',
                    isPagingPage: slugArray[1] === 'page',
                    isPage: slugArray[0] === 'page'
                }
            }
            else return false; // isHome
        }
        function checkScrollPosition() {
            state.s.set('scrolled', window.scrollY);
        }
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
        function bindLoop() {
            const padding = 200;
            let mainEnd, 
                pastBottom = false;
            state.set('pastBottom', pastBottom);

            jqLite(window).on('resize', checkMainEnd).on('scroll', scrollBind);
            jqLite(main).on('resize', checkMainEnd);

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
                jqLite(main).off('resize', checkMainEnd);
                jqLite(window).off('resize', checkMainEnd).off('scroll', scrollBind);;
            };
        }
        function getLang() {
            const titlesEl = jqLite($document[0].querySelector('#section-titles'));
            let titles = 'titles = ';

            return eval(titles + titlesEl.html());
        } 
    }])
    .directive('aataMenu', ['$document', '$compile', '$templateCache',
        function ($document, $compile, $templateCache) {
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