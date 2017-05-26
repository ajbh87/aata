const jqLite = angular.element;

angular.module("aata", [ "components", "ngResource", "ngSanitize" ]).controller("MainController", function($document, $scope) {});

angular.module("components", [ "ngResource" ]).directive("aataResources", [ "$compile", "$q", "$resource", "$templateCache", "$timeout", "$document", ($compile, $q, $resource, $templateCache, $timeout, $document) => {
    class stateConstructor {
        constructor(def = {}) {
            let s = Immutable.Map(def), dispatcher = s => {};
            const options = s, keyDispatchers = {};
            this.set = ((key, value) => {
                s = s.set(key, value);
                if (keyDispatchers[key] != null) {
                    keyDispatchers[key](value, s.toObject());
                }
            });
            this.setMultiple = (obj => s = s.concat(obj));
            this.get = (key => s.get(key));
            this.setDispatch = (fn => dispatcher = fn);
            this.dispatch = (() => dispatcher(s.toObject()));
            this.setKeyDispatcher = ((key1, fn) => {
                s.forEach((val, key2) => {
                    if (key1 === key2) {
                        keyDispatchers[key1] = fn;
                        return false;
                    }
                });
            });
            this.getObj = (() => s.toObject());
        }
    }
    const main = $document[0].querySelector(".main"), lang = getLang(), jqWindow = jqLite(window), mainJQ = jqLite(main), screen = jqLite($document[0].querySelector(".screen")), screenSM = jqLite($document[0].querySelector(".screen-sm")), base = lang.url, restUrl = base + "/wp-json/wp/v2", defaultResourceOptions = {
        get: {
            method: "GET",
            cache: true
        },
        query: {
            method: "GET",
            cache: true,
            isArray: true
        }
    }, rest = {
        allPosts: $resource(restUrl + "/:type?page=:page", {
            type: "posts",
            page: "@pageNum"
        }, defaultResourceOptions),
        byFilter: $resource(restUrl + "/:type?:filter=:slug&page=:page", {
            type: "@type",
            filter: "@filter",
            slug: "@slug",
            page: 1
        }, defaultResourceOptions),
        byId: $resource(restUrl + "/:type/:id", {
            type: "@type",
            id: "@id"
        }, defaultResourceOptions),
        all: $resource(restUrl + "/:type?per_page=:perPage", {
            type: "@type",
            perPage: 10
        }, defaultResourceOptions)
    }, get = {
        postsPage: page => rest.allPosts.query({
            page: page
        }).$promise,
        byFilter: (slug, type, filter, page = 1) => rest.byFilter.query({
            type: type,
            filter: filter,
            slug: slug,
            page: page
        }).$promise,
        byId: (type, id) => rest.byId.get({
            type: type,
            id: id
        }).$promise,
        all: (type, perPage) => rest.all.query({
            type: type,
            perPage: perPage
        }).$promise
    }, comeOnDude = [ base ], youShallNotPass = [ "php", "feed", "wp-admin" ], allTagsDef = get.all("tags", 100), state = new stateConstructor({
        animated: null,
        loopType: null,
        meta: null,
        replace: null,
        requestType: null,
        url: null,
        val: null,
        pastBottom: false,
        currentPage: 1,
        lastPage: false
    });
    checkIfLoop();
    return {
        link: (scope, element, attrs) => {
            state.setDispatch(dispatcher);
            state.setKeyDispatcher("pastBottom", loopDispatcher);
            scope.hidePagination = true;
            scope.lang = lang;
            scope.findTagById = findTagById;
            scope.fetchById = fetchById;
            scope.fetchAllByTag = fetchAllByTag;
            scope.formatDate = (date => moment(date).format("MMMM D, YYYY h:mm a"));
            $timeout(() => {
                bindLinks();
                jqLite(window).on("popstate", onPopState);
            });
            function onPopState(event) {
                const eventState = event.state;
                event.preventDefault();
                ajaxLink(eventState);
                function ajaxLink(eventState) {
                    if (eventState != null) {
                        eventState.animated = prepareWindow();
                        setContent(eventState);
                    } else {
                        fetchPostOrPage(window.location.href.replace(base, ""), true);
                    }
                }
            }
            function bindLinks() {
                const links = element[0].querySelectorAll("a:not([resource-binded])");
                let linkID = 0;
                for (linkID = 0; linkID < links.length; linkID++) {
                    iterator(links[linkID]);
                }
                function iterator(linkEl) {
                    const link = jqLite(linkEl), href = link.attr("href"), ngClick = link.attr("ng-click"), binded = link.attr("resource-binded");
                    if (href != null && ngClick == null && binded == null) {
                        if (checkLists(href)) {
                            link.attr("resource-binded", true);
                            link.on("click", event => {
                                event.preventDefault();
                                fetchPostOrPage(href.replace(base, ""));
                            });
                        }
                    }
                    function checkLists(href) {
                        let checks = [];
                        comeOnDude.forEach(item => checks.push(href.indexOf(item) !== -1));
                        youShallNotPass.forEach(item => checks.push(href.indexOf(item) === -1));
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
                const promise = get.byFilter(data.id, "posts", "tags"), animated = prepareWindow();
                promise.then(val => {
                    changeState({
                        animated: animated,
                        loopType: "tags",
                        requestType: "loop",
                        url: data.link,
                        val: val,
                        meta: data
                    });
                });
            }
            function fetchById($event, type, id) {
                $event.preventDefault();
                const promise = get.byId(type, id), animated = prepareWindow();
                promise.then(val => {
                    changeState({
                        animated: animated,
                        requestType: type,
                        url: val.link,
                        val: val
                    });
                });
            }
            function fetchPostOrPage(slug, replace) {
                const types = [ "pages", "posts" ];
                let promise = null, slugArray = slug.match(/(([a-zA-Z0-9-_]+)(?=\/*))/g), pageNum = null, slugIndex = 0, cleanSlug = "", requestType = "", animated = prepareWindow();
                if (slugArray != null) {
                    if (slugArray[0] === "page") {
                        pageNum = parseInt(slugArray[1]);
                        if (typeof pageNum === "number") {
                            promise = get.postsPage(pageNum);
                        }
                    } else if (slugArray[0] === "announcements") {
                        cleanSlug = slugArray[slugArray.length - 1];
                        requestType = "posts";
                        promise = get.byFilter(cleanSlug, requestType, "slug");
                    } else {
                        cleanSlug = slugArray[slugArray.length - 1];
                        requestType = "pages";
                        promise = get.byFilter(cleanSlug, requestType, "slug");
                    }
                    $q.when(promise).then(values => {
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
                    get.postsPage(1).then(val => {
                        changeState({
                            animated: animated,
                            replace: replace,
                            requestType: "loop",
                            loopType: "posts",
                            url: base + slug,
                            val: val
                        });
                    });
                }
            }
            function changeState(obj) {
                if (obj.requestType === "loop") {
                    obj.currentPage = 1;
                    obj.lastPage = false;
                } else {
                    obj.loopType = null;
                    obj.meta = null;
                }
                state.setMultiple(obj);
                state.dispatch();
            }
            function dispatcher(s) {
                setContent(s);
                let action = "pushState";
                if (s.replace === true) {
                    action = "replaceState";
                }
                history[action](s, "", s.url);
            }
            function prepareWindow(append, small) {
                const def = $q.defer();
                if (small === true) screenSM.addClass("show"); else screen.addClass("show");
                $timeout(() => {
                    if (window.scrollTo != null && append == null) {
                        window.scrollTo(0, 0);
                    }
                    def.resolve();
                }, 500);
                return def.promise;
            }
            function setContent(s, append) {
                const def = $q.defer();
                $q.when(allTagsDef, s.animated).then(tags => {
                    const template = $templateCache.get(s.requestType + "-template.html");
                    let el, subScope = scope.$new();
                    subScope = Object.assign(subScope, {
                        loopType: s.loopType,
                        meta: s.meta,
                        data: s.val,
                        tags: tags,
                        currentPage: s.currentPage
                    });
                    screen.removeClass("show");
                    screenSM.removeClass("show");
                    el = $compile(template)(subScope);
                    if (append !== true) mainJQ.empty();
                    mainJQ.append(el);
                    $timeout(() => {
                        scope.$digest();
                        def.resolve();
                        bindLinks();
                        if (s.requestType === "loop") {
                            bindLoop();
                        } else {}
                    });
                }, val => {
                    def.reject();
                });
                return def.promise;
            }
            function loopDispatcher(val) {
                const currentPage = state.get("currentPage"), nextPage = currentPage + 1, requestType = state.get("requestType"), loopType = state.get("loopType"), lastPage = state.get("lastPage"), meta = state.get("meta");
                let promise, animated;
                if (val === true && requestType === "loop" && lastPage !== true) {
                    if (loopType === "tags") {
                        promise = get.byFilter(meta.id, "posts", "tags", nextPage);
                    } else {
                        promise = get.postsPage(nextPage);
                    }
                    animated = prepareWindow(true, true);
                    promise.then(val => {
                        if (val.length > 0) {
                            state.setMultiple({
                                animated: animated,
                                currentPage: nextPage,
                                val: val
                            });
                            setContent(state.getObj(), true);
                        } else {
                            state.setMultiple({
                                lastPage: true
                            });
                            screen.removeClass("show");
                            screenSM.removeClass("show");
                        }
                    });
                }
            }
            function findTagById(id, tags) {
                let found = [];
                tags.forEach(tag => {
                    if (tag.id === id) {
                        found.push(tag);
                    }
                });
                if (found.length > 0) {
                    return found[0];
                }
            }
        }
    };
    function checkIfLoop() {
        const slug = window.location.href.replace(base, ""), isTag = slug.includes("tag");
        if (isTag === true || slug === "/") {
            if (isTag === true) {
                $q.when(allTagsDef).then(tags => {
                    let found = [];
                    tags.forEach(tag => {
                        if (tag.link === window.location.href) found.push(tag);
                        return false;
                    });
                    if (found.length > 0) state.set("meta", found[0]);
                });
                state.setMultiple({
                    requestType: "loop",
                    loopType: "tags"
                });
            } else {
                state.setMultiple({
                    requestType: "loop",
                    loopType: "posts"
                });
            }
            bindLoop();
        }
    }
    function bindLoop() {
        const padding = 200;
        let mainEnd, pastBottom = false;
        state.set("pastBottom", pastBottom);
        jqWindow.off("resize", checkMainEnd).on("resize", checkMainEnd).on("scroll", scrollBind);
        mainJQ.off("resize", checkMainEnd).on("resize", checkMainEnd);
        checkMainEnd();
        function checkMainEnd() {
            mainEnd = saKnife.offset(main).top + main.offsetHeight - saKnife.winSize().height;
        }
        function scrollBind(event) {
            if (window.scrollY + padding >= mainEnd) {
                if (pastBottom === false) {
                    pastBottom = true;
                    state.set("pastBottom", pastBottom);
                }
            }
        }
    }
    function getLang() {
        const titlesEl = jqLite($document[0].querySelector("#section-titles"));
        let titles = "titles = ";
        return eval(titles + titlesEl.html());
    }
} ]).directive("aataMenu", [ "$document", "$compile", ($document, $compile) => {
    return {
        link: (scope, element, attrs) => {
            const selector = attrs.aataMenu, menu = element.find("div");
            let items;
            debugger;
            items = element[0].querySelectorAll(selector);
            element.addClass("js");
            items.forEach(item => {
                let subScope = scope.$new(), compiled = "";
                const expand = '<button class="expand"' + 'ng-click="showChildren = !showChildren"' + 'ng-class="{active: showChildren}">' + '<span class="hidden">Expandir</span>+' + "</button>";
                const ulChildren = jqLite(item).find("ul");
                subScope.showChildren = false;
                ulChildren.attr("ng-show", "showChildren");
                jqLite(item).prepend(expand);
                item = $compile(item)(subScope);
            });
        }
    };
} ]);