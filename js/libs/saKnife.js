/**
 * HTMLElement offset. Every property is in pixels
 * @typedef {object} offsetObject
 * @property {number} top - 'top' position relative to 'body'
 * @property {number} left - 'left' position relative to 'body'
 */

/**
 * Basic utilities for the Vanilla JS toolbox
 * @class saKnife
 */
class saKnife {
  /**
   * Check the name of CSS transitionEnd Event
   * @copyright Modernizr - via {@link https://davidwalsh.name/css-animation-callbackdavidwalsh}
   * @return {string} CSS transitionEnd Event name
   */
  static whichTransitionEvent(){
    const el = document.createElement('fakeelement'),
      transitions = {
        transition: 'transitionend',
        OTransition: 'oTransitionEnd',
        MozTransition: 'transitionend',
        WebkitTransition: 'webkitTransitionEnd'
      };
    let t;

    for(t in transitions){
      if( el.style[t] !== undefined ){
        return transitions[t];
      }
    }
  }
  /**
     * Iterate through NodeList
     * @param {NodeList} elements - a NodeList of Elements.
     * @param {function} fn - function to run for each element.
     * @example
     * const elements = document.querySelectorAll('.some-class');
     * saKnife.forEach(elements, function(el, index) {
     *     doSometing(el);
     * });
     */
  static forEach(elements, fn) {
    const total = elements.length;
    let index = 0;
    for (index = 0; index < total; index++) {
      fn(elements[index], index);
    }
  }
  /**
     * Check if 'element' has specified 'class'
     * @param {HTMLElement} el - HTMLElement
     * @param {string} className - CSS class name
     * @return {boolean} true/false if 'el' has class 'className'
     * @example
     * const element = document.querySelector('.some-class');
     * saKnife.hasClass(element, 'some-class');
     * // returns true
     */
  static hasClass(el, className) {
    if (el.classList)
      return el.classList.contains(className);
    else
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }

  /**
   * Check 'element' position relative to 'body'
   * @param {HTMLElement} el - HTMLElement
   * @return {offsetObject} - Offset information [offsetObject]{@link offsetObject} 
   */
  static offset(el) {
    const rect = el.getBoundingClientRect(),
      body = document.body.getBoundingClientRect();

    return {
      top: Math.abs(body.top) + rect.top,
      left: Math.abs(body.left) + rect.left
    };
  }

  /**
   * Check 'window' size
   * @example
   * saKnife.winSize();
   * // returns {width: 1920, height: 1080, ...}
   * @return {winSizeObject}
      {@link module:src/saKnife~winSizeObject winSizeObject} - Windows size information
   */
  static winSize() {
    const e = document.documentElement,
      g = document.querySelector('body'),
      width = window.innerWidth||e.clientWidth||g.clientWidth,
      height = window.innerHeight||e.clientHeight||g.clientHeight;
    return {
      width,
      height,
      vCenter: height / 2,
      hCenter: width / 2,
      documentHeight: g.offsetHeight,
      documentWidth: g.offsetWidth
    };
  }
  /**
   * Round a number to specified decimals
   * @param {number} value
   * @param {number} decimals
   * @return {number}
   */
  static round(value, decimals) {
    return Number( Math.round(value + 'e' + decimals) + 'e-' + decimals );
  }
}
if (NodeList.forEach == null) {
  NodeList.prototype.forEach = function(fn) {
    saKnife.forEach(this, fn);
  };
}
if (HTMLElement.hasClass == null) {
  HTMLElement.prototype.hasClass = function(className) {
    return saKnife.hasClass(this, className);
  };
}
if (HTMLElement.getOffset == null) {
  HTMLElement.prototype.getOffset = function() {
    return saKnife.offset(this);
  };
}

/**
 * Exports class [saKnife]{@link saKnife}
 * - Polyfills NodeList.forEach
 * - Extends HTMLElement with getOffset and hasClass
 * @module src/saKnife
 */
export default saKnife;
