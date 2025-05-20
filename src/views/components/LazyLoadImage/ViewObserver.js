// ViewObserver uses IntersectionObserver API which requires polyfill
// see https://caniuse.com/#search=IntersectionObserver
if (typeof window !== 'undefined') require('intersection-observer')

/**
 * Build an array of threshold values ranging from 0 to 1
 * @param {Number} steps - number of steps between 0 and 1.0
 * @returns {Number[]} returns array of floats
 */
const buildThreshold = (steps = THRESHOLD_STEPS) => {
  const threshold = Array.from({ length: steps }, (x, i) => i / steps)

  // Returns an array like [0, ...n, 1]
  return [...threshold, 1]
}

export const DEFAULT_OPTIONS = {
  // If an element height is similar to the container height,
  // it's very difficult to catch an impression in 250ms.
  // By default the intersectionRatio of an element should be
  // 1 to be considered seen and so for tall elements we reduce the
  // max intersectionRatio by this value
  errorMargin: 0.05, // 5%

  // The container height range at which to compensate with
  // an error margin
  percentCompensation: 0.2, // 20%

  // Element must be visible for >= 250ms
  minTimeVisible: 250,

  // The ViewObserver config
  config: {
    root: null,
    rootMargin: '0px',
    threshold: buildThreshold(100),
  },
}

let instance = null

export default class ViewObserver {
  /**
   * Return the single instance of the IntersectionObserver if one exists already,
   * otherwise create an instance
   * @param {Object} options - ViewObserver instantiation options
   * @return {ViewObserver} return instance of the class
   */
  static get(options = {}) {
    // If an instance of the observer already exists, return the singleton
    // otherwise instantiate a new one
    if (instance && instance instanceof ViewObserver) return instance

    instance = new ViewObserver(options)
    return instance
  }

  constructor(options = {}) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options)

    if (isNaN(this.options.minTimeVisible) || this.options.minTimeVisible < 0) {
      this.options.minTimeVisible = DEFAULT_OPTIONS.minTimeVisible
    }

    this.elements = new Map()
    this.timeouts = new Map()

    this.observer = new IntersectionObserver(
      this.watchElements,
      this.options.config,
    )

    // Handle browser tab changes
    window.addEventListener('focus', this.reportVisibilityStates)

    // Handle device orientation changes
    window.addEventListener('orientationchange', this.reportVisibilityStates)
  }

  /**
   * Remove window event listeners to avoid memory leaks
   */
  removeEventListeners() {
    window.removeEventListener('focus', this.reportVisibilityStates)
    window.removeEventListener('orientationchange', this.reportVisibilityStates)
  }

  /**
   * Detroy all Maps and event listeners.
   * @returns {void} returns instance
   */
  destroy() {
    // Clear all elements
    this.elements.clear()

    // Clear all lingering timeouts
    this.timeouts.clear()

    // Disconnect the observer, if available
    if (this.observer && typeof this.observer.disconnect === 'function') {
      this.observer.disconnect()
    }

    // Remove all event listeners
    this.removeEventListeners()

    instance = null

    return instance
  }

  /**
   * Fire onChange event listeners for all visible elements
   */
  reportVisibilityStates = () => {
    this.elements.forEach(({ visible }, element) => {
      if (visible) this.onVisibilityChange(element, visible)
    })
  }

  /**
   * Loop through all of the observed elements and check if visible
   * @param  {Array} [entries=this.elements] array of [IntersectionObserverEntry],
   * defaults to this.elements Map
   */
  watchElements = (entries = this.elements) => {
    // If rootBounds does not exist, it will default to the height and width
    // of the viewport
    const containerHeight =
      window.innerHeight || document.documentElement.clientHeight

    entries
      .filter(entry => entry.isIntersecting)
      .forEach(entry => {
        const node = entry.target || entry.entry
        const element = this.elements.get(node)

        // We wrap the child in a container, so we need to ensure we're looking at
        // the bounds of the child and not the wrapper
        const bounds = entry.boundingClientRect || node.getBoundingClientRect()

        const elementHeight = bounds.height

        // If the element height is within x% (this.options.percentCompensation)
        // of the container height, use the errorMargin option (this.options.errorMargin).
        // Otherwise default to 0.025. The max intersectionRatio for a regular element
        // should be 0.975 as being _too_ strict can result in missed events.
        const errorMargin = this.isElementHeightSimilarToContainer(
          elementHeight,
          containerHeight,
        )
          ? this.options.errorMargin
          : 0.025

        const maxIntersectionRatio =
          containerHeight / elementHeight > 1
            ? 1 - errorMargin
            : containerHeight / elementHeight - errorMargin

        const isVisible = entry.intersectionRatio >= maxIntersectionRatio

        // Element is still visible since last check
        if (isVisible && element.timeoutSet) {
          return
        }

        // If the element is visible
        if (isVisible) {
          // Set the visibility state to true but wait until the timeout finishes
          // to fire the event
          element.timeoutSet = true

          // Start timer
          this.timeouts.set(
            node,
            setTimeout(() => {
              // Fire the event
              this.onVisibilityChange(node, true)
            }, this.options.minTimeVisible),
          )
        } else {
          const timeout = this.timeouts.get(node)
          // Fire event
          this.onVisibilityChange(node, false)
          // Element is no longer visible, delete timeout
          clearTimeout(timeout)
          this.timeouts.delete(node)
          element.timeoutSet = false
        }
      })
  }

  isElementHeightSimilarToContainer(elementHeight, containerHeight) {
    return (
      elementHeight >=
        containerHeight - containerHeight * this.options.percentCompensation &&
      elementHeight <=
        containerHeight + containerHeight * this.options.percentCompensation
    )
  }

  /**
   * Observe an IntersectionObserver entry
   * @param  {IntersectionObserverEntry} element the element to watch
   * @param  {Function} callback the element callback event
   */
  observe = (element, callback) => {
    if (!element || !callback) return

    this.elements.set(element, {
      callback,
      visible: false,
      entry: element,
    })

    this.observer.observe(element)
  }

  /**
   * Unobserve an IntersectionObserver entry
   * @param  {HTMLElement} element the element to unobserve
   */
  unobserve = element => {
    if (!element) return
    if (!this.elements.get(element)) return

    if (this.observer) this.observer.unobserve(element)

    this.elements.delete(element)

    // If we're not watching any elements, destroy the ViewObserver.
    // If more trackers are mounted, a new instance of the ViewObserver
    // will be created
    if (this.elements.size === 0) {
      this.destroy()
    }
  }

  /**
   * Handle DOM element visibility state change
   * @param  {HTMLElement} element - the DOM node
   * @param  {Boolean} visible - the visibility state of the entry
   */
  onVisibilityChange(element, visible) {
    if (!element) return

    const entry = this.elements.get(element)

    if (!entry) return

    // Set the new visibility state
    entry.visible = visible

    const { callback } = entry

    if (typeof callback === 'function') callback(visible)
  }
}
