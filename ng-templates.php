    <script type="application/json" id="section-titles">
        {
            "url": "<?php echo home_url(); ?>",
            "archives": "<?php _e( 'Archives', 'html5blank' ); ?>",
            "categories": "<?php _e( 'Categories for ', 'html5blank' ); ?>",
            "posts": "<?php _e( 'Latest Posts', 'html5blank' ); ?>",
            "tags": "<?php _e( 'Tag Archive: ', 'html5blank' ); ?>",
            "author": "<?php _e( 'Tag Archive: ', 'html5blank' ); ?>",
            "categoriesIn": "<?php _e( 'Categorised in: ', 'html5blank' ); ?>"
        }
    </script>
    <script type="text/ng-template" id="pages-template.html">
        <section>
            <article class="article article--page page">
                <h1 class="main__title" ng-bind-html="trustHtml(data.title.rendered)"></h1>
                <div class="article__content" 
                    ng-if="data.slug !== 'contacto'"
                    ng-bind-html="trustHtml(data.content.rendered)"></div>
                <div class="article__content"
                    ng-if="data.slug === 'contacto'">
                    <aata-script type="text/javascript-lazy" src="https://www.google.com/recaptcha/api.js"></aata-script>
                    <aata-form></aata-form>
                    <div ng-bind-html="trustHtml(data.content.rendered)"></div>
                </div>
            </article>
        </section>
    </script>
    <script type="text/ng-template" id="posts-template.html">
        <article id="post-{{data.id}}" class="article article--post post cat--{{data.categories[0]}}">
            <!-- post title -->
            <h1 class="main__title"
                ng-bind-html="trustHtml(data.title.rendered)"></h1>
            <!-- /post title -->
            <time class="article__date" ng-bind="formatDate(data.date)"></time>
            <div class="article__content">
                <!-- post details -->
                <span class="article__author" ng-bind="'Escrito por: ' + meta.author.name"></span>
                <!-- /post details -->
                <div ng-bind-html="trustHtml(data.content.rendered)"></div>
            </div>
            <div class="article__tags" ng-if="data.tags.length > 0">
                <span class="sr-only" ng-bind="lang.tags"></span>
                <svg class="icon icon--tag">
                    <use xlink:href="#tagIcon" />
                </svg>
                <a href="{{tagInfo.link}}"
                    ng-repeat="tag in data.tags"
                    ng-init="tagInfo = findTagById(tag, tags)"
                    ng-click="fetch.allByTag($event, tagInfo)"
                    ng-bind="($last !== true) ? tagInfo.name + ', ' : tagInfo.name"></a>
            </div>
        </article>
    </script>
    <script type="text/ng-template" id="loop-template.html">
        <section class="" 
            data-current-page="{{currentPage}}">
            <div ng-if="append != true && loopType != 'tags'">
                <?php if(!function_exists('dynamic_sidebar') || !dynamic_sidebar('widget-area-1')) ?>
            </div>
            <h1 class="main__title main__title--margin"
                ng-if="append != true && loopType == 'tags'"
                ng-bind="lang[loopType] + ' ' + meta.name"></h1>
            <article ng-repeat="item in data" 
                id="post-{{item.id}}"
                class="article cat--{{item.categories[0]}}">
                <!-- post title -->
                <h2 class="article__title">
                    <a title="{{item.title.rendered}}"
                        href="{{item.link}}"
                        ng-bind-html="trustHtml(item.title.rendered)"
                        ng-click="fetch.byId($event, 'posts', item.id)"></a>
                </h2>
                <!-- /post title -->
                <!-- post details -->
                <div class="article__date">
                    <time datetime="{{item.date}}" ng-bind="formatDate(item.date)"></time>
                </div>
                <div class="article__excerpt">
                    <!-- /post details -->
                    <p ng-bind-html="trustHtml(item.excerpt.rendered)"></p>
                </div>
            </article>
        </section>
    </script>
    <script type="text/ng-template" id="expand.html">
        <button class="expand"
            ng-click="showChildren = !showChildren"
            aria-expanded="{{showChildren}}">
                <span class="sr-only">Expandir</span>
                <?php get_template_part('img/icons/add'); ?>
        </button>
    </script>
    <script type="text/ng-template" id="error-messages">
        <div ng-message="required">Campo requerido.</div>
        <div ng-message="minlength">El campo es muy corto.</div>
        <div ng-message="maxlength">El campo largo.</div>
    </script>
    <script type="text/ng-template" id="form.html">
        <form id="contactForm"
            name="contact"
            class="aata-form" method="POST" 
            ng-submit="submitForm()"
            ng-hide="hideForm">
            <p class="aata-form__disclaimer">
                Las consultas serán contestadas por correo electrónico.  Si no interesas recibir la misma por dicho medio, debes comunicarte al 787-200-6474.
            </p>
            <div class="aata-form__input-group">
                <label class="aata-form__label aata-form__label--bottom-" for="name">
                    Nombre <span class="required">*</span>
                </label>
                <input id="name" class="aata-form__input"
                    name="name" 
                    ng-model="name"
                    type="text"
                    required
                    ng-required="true"
                    ng-minlength="2"
                    ng-maxlength="30" />
                <div role="alert" class="aata-form__message" 
                    ng-messages="contact.name.$error"
                    ng-show="!contact.name.$valid && contact.name.$dirty">
                    <div ng-messages-include="error-messages"></div>
                </div>
            </div>
            
            <div class="aata-form__input-group">
                <label class="aata-form__label aata-form__label--bottom-" for="lastName">
                    Apellidos <span class="required">*</span>
                </label>
                <input id="lastName" class="aata-form__input" name="lastName" 
                    ng-model="lastName"
                    type="text"
                    required
                    ng-required="true"
                    ng-minlength="2"
                    ng-maxlength="30" />
                <div class="aata-form__message" role="alert" 
                    ng-messages="contact.lastName.$error" 
                    ng-show="!contact.lastName.$valid && contact.lastName.$dirty">
                    <div ng-messages-include="error-messages"></div>
                </div>
            </div>

            <div class="aata-form__input-group">
                <label class="aata-form__label aata-form__label--bottom-" for="email">
                    Email <span class="required">*</span>
                </label>
                <input id="email" type="email" class="aata-form__input" name="email" 
                    ng-model="email" 
                    type="email"
                    ng-required="true"
                    ng-minlength="5"
                    ng-maxlength="30" />
                <div class="aata-form__message" role="alert" 
                    ng-messages="contact.email.$error" 
                    ng-show="!contact.email.$valid && contact.email.$dirty">
                    <div ng-message="email">Por favor ingrese un email válido.</div>
                    <div ng-message="minlength">El campo debe contener un mínimo de 5 caracteres.</div>
                    <div ng-message="maxlength">El campo debe contener un máximo de 30 caracteres.</div>
                    <div ng-messages-include="error-messages"></div>
                </div>
            </div>

            <div class="aata-form__input-group">
                <label class="aata-form__label aata-form__label--bottom-" for="tel">Teléfono</label>
                <input id="tel" class="aata-form__input" name="tel" 
                    ng-model="tel"
                    type="text"
                    ng-pattern="telRegex"
                    ng-minlength="7"
                    ng-maxlength="20" />
                <div role="alert" class="aata-form__message" 
                    ng-messages="contact.tel.$error" 
                    ng-show="!contact.tel.$valid && contact.tel.$dirty">
                    <div ng-message="pattern">Por favor ingrese un número de teléfono válido.</div>
                    <div ng-message="minlength">El campo debe contener un mínimo de 7 caracteres.</div>
                    <div ng-message="maxlength">El campo debe contener un máximo de 20 caracteres.</div>
                </div>
            </div>

            <fieldset class="aata-form__fieldset">
                <legend>Asunto</legend>
                <div class="aata-form__fieldset-grid">
                    <div class="aata-form__checkbox-container" ng-repeat="(itemSlug, item) in asunto">
                        <input id="{{itemSlug}}" class="aata-form__checkbox" type="checkbox"
                               ng-model="item.selected"
                               name="{{itemSlug}}">
                        <label for="{{itemSlug}}" class="aata-form__checkbox-label">{{item.text}}</label>
                    </div>
                </div>
            </fieldset>

            <div class="aata-form__input-group aata-form__textarea-group">
                <label class="aata-form__label" for="comments">
                    Pregunta <span class="required">*</span>
                </label>
                <textarea id="comments" class="aata-form__textarea" name="comments"
                        ng-model="comments"
                        ng-required="true"
                        ng-maxlength="500"></textarea>
                <div role="alert" class="aata-form__message" 
                    ng-messages="contact.comments.$error" 
                    ng-show="!contact.comments.$valid && contact.comments.$dirty">
                    <div ng-message="maxlength">El campo debe contener un máximo de 500 caracteres.</div>
                    <div ng-messages-include="error-messages"></div>
                </div>
            </div>

            <div class="g-recaptcha"
                  data-sitekey="6LdkOiQUAAAAAG8HDiT86whWQ91NK9zfv7D7Wlvi"
                  data-callback="postForm"
                  data-size="invisible">
            </div>
            <div class="aata-form__button-container">
                <div class="required-message"><span class="required">*</span> Campos requeridos.</div>
                <button type="submit" class="button aata-form__button">Enviar</button>            
            </div>
        </form>
        <div class="alert alert--success" role="alert" ng-show="showSuccessMessage">
            <svg class="alert__icon" aria-hidden="true">
                <use xlink:href="#checkCircleIcon" />
            </svg>
            
            <div class="alert__content">
                Gracias por comunicarte con Abogados a Tu Alcance, Tus Abogados en Puerto Rico, te enviaremos por correo electrónico la contestación a tu consulta a la brevedad posible. 
            </div>
        </div>
        <div class="alert alert--error alert--floating" role="alert" ng-class="{'show': showErrorMessage}">
            <svg class="alert__icon" aria-hidden="true">
                <use xlink:href="#errorIcon" />
            </svg>

            <div class="alert__content">
                ¡Oops! Algo ha ocurrido y tu solicitud no ha sido procesada. Te agradecemos que trates más tarde o te comuniques al 787-200-6474.                
            </div>
        </div>
        <div class="aata-form__screen" aria-hidden="true" ng-class="{'show': showFormScreen == true}">
            <div class="loader screen-sm__loader"></div>
        </div>
    </script>