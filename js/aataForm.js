/* global grecaptcha */
import Immutable from '../node_modules/immutable/dist/immutable.js';
import assign from '../node_modules/lodash.assign/index.js';

export default function aataForm($http, $timeout) {
  let _ = { assign };
  const url =
    'https://script.google.com/macros/s/AKfycbzpv61xrCS11gcp-vy_7f_pKdlY1QaPc6OD0iazGY6rQpZoho6h/exec';
  return {
    templateUrl: 'form.html',
    scope: true,
    link: function(scope, element, attrs) {
      const message = attrs.aataMessage,
        defs = Immutable.Map({
          telRegex: /([+.\-)(]*[0-9]{1,4})+/,
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
          comments: '',
          showFormScreen: false,
          message
        });
      scope = _.assign(scope, defs.toObject());

      scope.submitForm = function() {
        if (scope.contact.$valid) {
          scope.showFormScreen = true;
          //postForm(0); // for error testing
          grecaptcha.execute();
        }
      };
      // Assign postForm to global scope so that recaptcha can find it.
      window.postForm = postForm;
      /**
       * Function is called as a callback to grecaptcha.execute()
       * @async
       * @param {string} token - recaptcha token 
       */
      function postForm(token) {
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
        $http({
          method: 'POST',
          url: url,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: encoded
        }).then(success, error);
      }
      function success(response) {
        var recaptchaResponse = response.data.content.recaptcha;
        grecaptcha.reset();
        if (recaptchaResponse.success === true) {
          scope.hideForm = true;
          scope.showSuccessMessage = true;
        } else {
          showErrorMessage();
        }
        scope.showFormScreen = false;
      }
      function error() {
        grecaptcha.reset();
        showErrorMessage();
        scope.showFormScreen = false;
      }
      function showErrorMessage() {
        scope.showErrorMessage = true;

        $timeout(() => {
          scope.showErrorMessage = false;
        }, 3000);
      }
    }
  };
  function generateList(items) {
    let list = '',
      key;
    for (key in items) {
      if (items[key].selected) {
        list += ' - ' + items[key].text;
      }
    }
    return list;
  }
  function getEncoded(data) {
    return Object.keys(data)
      .map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
      })
      .join('&');
  }
}
