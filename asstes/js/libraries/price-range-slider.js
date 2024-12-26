class RangeSlider {
  constructor(el = null, {
    rtl = el.getAttribute("data-rtl") ? JSON.parse(el.getAttribute("data-rtl").toLowerCase()) : false,
    min = ~~el.getAttribute("data-min") || 0,
    max = ~~el.getAttribute("data-max") || 100,
    lowValue = ~~el.getAttribute("data-lowValue") || min,
    highValue = ~~el.getAttribute("data-highValue") || max,
    title = el.getAttribute("data-title") || "",
    fromText = el.getAttribute("data-fromText") ? el.getAttribute("data-fromText") : "",
    toText = el.getAttribute("data-toText") ? el.getAttribute("data-toText") : "",
    color = el.getAttribute("data-color") || "",
    background = el.getAttribute("data-background") || "",
    input_min = document.getElementById(el.getAttribute("data-input-min")) || null,
    input_max = document.getElementById(el.getAttribute("data-input-max")) || null,
    onChange = () => { },
    isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
      },
      any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
    }
  } = {}) {

    function hexToRgbA(hex, opacity = 1) {
      var c;
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
      }
      throw new Error('Bad Hex');
    }

    el.setAttribute("fa-range-silder", "");
    this.el = el;
    !!rtl ? el.setAttribute("rtl", "") : null;
    this.rtl = rtl;
    this.isMobile = isMobile;
    el.id = !el.id ? `fa-range-silder_${document.querySelectorAll('[fa-range-silder]').length}` : el.id;
    this.rangeSlider = document.createElement("div");
    this.rangeSlider.innerHTML = `
                                  <div class="values-group">
                                    <div class="text">
                                    ${title ? `<div class="title">
                                                  <strong>${title}</strong>
                                                </div>`: ``}
                                      <div class="fromTo">
                                        <div class="fromText">
                                          <strong>${fromText}</strong>
                                          <input ${!fromText ? `type="hidden"` : ``} class="value" id="${el.id}_input1" value="${lowValue}" />
                                        </div>
                                        <div class="toText">
                                          <strong>${toText}</strong>
                                          <input ${!toText ? `type="hidden"` : ``} class="value" id="${el.id}_input2" value="${highValue}" />
                                        </div>
                                      </div>

                                    </div>
                                  </div>
                                  <div class="track" ${background ? `style="background:${background}"` : ``}>
                                  ${color ? `<style>
                                  [fa-range-silder]#${el.id} .thumb::after {content:"";position:absolute;top:0;left:0;transform:translate(-50%, -50%);background:${color};width:20px;height:20px;border-radius:1000px;z-index:2;}
                                  [fa-range-silder]#${el.id} .thumb.active::after {box-shadow:0 0 10px ${hexToRgbA(color, .5)};}
                                  [fa-range-silder]#${el.id} .selection {position:absolute;width:unset;height:2px;background:${color};box-shadow:0 0 10px ${hexToRgbA(color, .5)};}
                                  </style>`: ``}
                                    <div class="thumb thumb-min" id="${el.id}_thumb1"></div>
                                    <div class="thumb thumb-max" id="${el.id}_thumb2"></div>
                                    <div class="selection" />
                                  </div>
                                  `;

    this.onChange = onChange;
    this.valueRange = [min, max];
    this.input_min = input_min;
    this.input_max = input_max;
    this.scaleValue = this.scaleValue.bind(this);
    this.valueToPosition = this.valueToPosition.bind(this);
    this.getThumbCenter = this.getThumbCenter.bind(this);
    this.setThumbs = this.setThumbs.bind(this);
    this.setSelection = this.setSelection.bind(this);
    this.initTrackDimensions = this.initTrackDimensions.bind(this);
    el ? this.render() : null;
  }

  set lowValue(value) {
    value = parseInt(value);
    this.input1.value =
      value < this.valueRange[0]
        ? this.valueRange[0]
        : value > this.highValue
          ? this.highValue
          : value;

    this.onChange({ min: this.lowValue, max: this.highValue });
  }

  set highValue(value) {
    value = parseInt(value);
    this.input2.value =
      value > this.valueRange[1]
        ? this.valueRange[1]
        : value < this.lowValue
          ? this.lowValue
          : value;

    this.onChange({ min: this.lowValue, max: this.highValue });
  }

  get lowValue() {
    return parseInt(this.input1.value);
  }

  get highValue() {
    return parseInt(this.input2.value);
  }

  scaleValue(value) {
    const { valueRange } = this;
    if (this.rtl == true) {
      return (valueRange[0] - valueRange[1]) * value + valueRange[1];
    } else {
      return (valueRange[1] - valueRange[0]) * value + valueRange[0];
    }
  }

  valueToPosition(value, width) {
    const { valueRange } = this;
    return (width * (value - valueRange[0])) / (valueRange[1] - valueRange[0]);
  }

  getThumbCenter(thumb) {
    const { left, width } = thumb.getBoundingClientRect();
    return left + width / 2;
  }

  initTrackDimensions() {
    const track = this.rangeSlider.getElementsByClassName("track")[0];
    const {
      left: trackStartingX,
      width: trackWidth
    } = track.getBoundingClientRect();

    /* Thanks to IE... Instead of:
       Object.assign(this, { trackStartingX, trackWidth, trackEndingX});
       we have this */
    this.trackStartingX = trackStartingX;
    this.trackWidth = trackWidth;
    this.trackEndingX = trackStartingX + trackWidth;
  }

  setThumbs() {
    const { thumb1, thumb2, trackWidth, valueToPosition } = this;
    if (this.rtl == true) {
      thumb2.style.right = `${(valueToPosition(this.lowValue, trackWidth) / this.trackWidth * 100)}%`;
      thumb1.style.right = `${(valueToPosition(this.highValue, trackWidth) / this.trackWidth * 100)}%`;
    } else {
      thumb1.style.left = `${(valueToPosition(this.lowValue, trackWidth)) / this.trackWidth * 100}%`;
      thumb2.style.left = `${(valueToPosition(this.highValue, trackWidth)) / this.trackWidth * 100}%`;
    }

  }

  setSelection() {
    const { selection, thumb1, thumb2 } = this;
    if (this.rtl == true) {
      selection.style.right = thumb2.style.right;
      selection.style.width = `${(parseInt(thumb1.style.right) - parseInt(thumb2.style.right))}%`;
    } else {
      selection.style.left = thumb1.style.left;
      selection.style.width = `${(parseInt(thumb2.style.left) - parseInt(thumb1.style.left))}%`;
    }

  }

  render(node = this.el) {
    const {
      rangeSlider,
      getThumbCenter,
      setThumbs,
      setSelection,
      scaleValue,
      valueRange,
      getValueWithinLimits,
      initTrackDimensions
    } = this;

    node.appendChild(rangeSlider);

    initTrackDimensions();

    /* Thanks to IE... Instead of:
       [this.thumb1, this.thumb2] = rangeSlider.getElementsByClassName('thumb');
       [this.input1, this.input2] = rangeSlider.getElementsByClassName('value');
       we have this ugliness */

    const thumbs = rangeSlider.getElementsByClassName("thumb");
    const inputs = rangeSlider.getElementsByClassName("value");

    this.thumb1 = thumbs[0];
    this.thumb2 = thumbs[1];
    this.input1 = this.input_min || inputs[0];
    this.input2 = this.input_max || inputs[1];

    this.selection = rangeSlider.getElementsByClassName("selection")[0];

    const moveThumb = (() => {
      const argsCache = {};

      return (selectedThumb, selectedInput) => {
        const selectedThumbId = selectedThumb.getAttribute("id");
        const key = "".concat(
          selectedThumbId,
          selectedInput.getAttribute("id")
        );

        if (argsCache[key]) { return argsCache[key]; }
        if (this.isMobile.any()) {
          argsCache[key] = (event) => {
            let newX = event.touches[0].clientX - this.trackStartingX;
            if (event.touches[0].clientX > this.trackEndingX) { newX = this.trackWidth; }
            else if (event.touches[0].clientX < this.trackStartingX) { newX = 0; }

            if (
              selectedThumbId === this.thumb1.id &&
              event.touches[0].clientX > this.trackStartingX + this.thumb2.offsetLeft
            ) {
              newX = getThumbCenter(this.thumb2) - this.trackStartingX;
            }
            else if (
              selectedThumbId === this.thumb2.id &&
              event.touches[0].clientX < this.trackStartingX + this.thumb1.offsetLeft
            ) {
              newX = getThumbCenter(this.thumb1) - this.trackStartingX;
            }

            if (this.rtl == true) {
              selectedThumb.style.right = `${(this.trackWidth - newX) / this.trackWidth * 100}%`;
            } else {
              selectedThumb.style.left = `${newX / this.trackWidth * 100}%`;
            }

            if (this.lowValue == this.highValue) {
              if (this.lowValue == this.valueRange[1]) {
                if (this.rtl == true) {
                  this.el.querySelector(".thumb-min").style.zIndex = null;
                  this.el.querySelector(".thumb-max").style.zIndex = 3;
                } else {
                  this.el.querySelector(".thumb-min").style.zIndex = 3;
                  this.el.querySelector(".thumb-max").style.zIndex = null;
                }
              } else if (this.highValue == this.valueRange[0]) {
                if (this.rtl == true) {
                  this.el.querySelector(".thumb-min").style.zIndex = 3;
                  this.el.querySelector(".thumb-max").style.zIndex = null;
                } else {
                  this.el.querySelector(".thumb-min").style.zIndex = null;
                  this.el.querySelector(".thumb-max").style.zIndex = 3;
                }
              }
            } else {
              this.el.querySelector(".thumb-min").style.zIndex = null;
              this.el.querySelector(".thumb-max").style.zIndex = null;
            }

            const updatedValue = Math.round(scaleValue(newX / this.trackWidth));

            if (this.rtl == true) {
              if (selectedThumbId === this.thumb2.id) { this.lowValue = updatedValue; }
              else { this.highValue = updatedValue; }
            } else {
              if (selectedThumbId === this.thumb1.id) { this.lowValue = updatedValue; }
              else { this.highValue = updatedValue; }
            }
            setSelection();
          };
        } else {
          argsCache[key] = (event) => {
            let newX = event.clientX - this.trackStartingX;
            if (event.clientX > this.trackEndingX) { newX = this.trackWidth; }
            else if (event.clientX < this.trackStartingX) { newX = 0; }

            if (
              selectedThumbId === this.thumb1.id &&
              event.clientX > this.trackStartingX + this.thumb2.offsetLeft
            ) {
              newX = getThumbCenter(this.thumb2) - this.trackStartingX;
            }
            else if (
              selectedThumbId === this.thumb2.id &&
              event.clientX < this.trackStartingX + this.thumb1.offsetLeft
            ) {
              newX = getThumbCenter(this.thumb1) - this.trackStartingX;
            }

            if (this.rtl == true) {
              selectedThumb.style.right = `${(this.trackWidth - newX) / this.trackWidth * 100}%`;
            } else {
              selectedThumb.style.left = `${newX / this.trackWidth * 100}%`;
            }

            if (this.lowValue == this.highValue) {
              if (this.lowValue == this.valueRange[1]) {
                if (this.rtl == true) {
                  this.el.querySelector(".thumb-min").style.zIndex = null;
                  this.el.querySelector(".thumb-max").style.zIndex = 3;
                } else {
                  this.el.querySelector(".thumb-min").style.zIndex = 3;
                  this.el.querySelector(".thumb-max").style.zIndex = null;
                }
              } else if (this.highValue == this.valueRange[0]) {
                if (this.rtl == true) {
                  this.el.querySelector(".thumb-min").style.zIndex = 3;
                  this.el.querySelector(".thumb-max").style.zIndex = null;
                } else {
                  this.el.querySelector(".thumb-min").style.zIndex = null;
                  this.el.querySelector(".thumb-max").style.zIndex = 3;
                }
              }
            } else {
              this.el.querySelector(".thumb-min").style.zIndex = null;
              this.el.querySelector(".thumb-max").style.zIndex = null;
            }

            const updatedValue = Math.round(scaleValue(newX / this.trackWidth));

            if (this.rtl == true) {
              if (selectedThumbId === this.thumb2.id) { this.lowValue = updatedValue; }
              else { this.highValue = updatedValue; }
            } else {
              if (selectedThumbId === this.thumb1.id) { this.lowValue = updatedValue; }
              else { this.highValue = updatedValue; }
            }
            setSelection();
          };
        }

        return argsCache[key];
      };
    })();



    if (this.isMobile.any()) {
      [
        { thumb: this.thumb1, input: this.input1 },
        { thumb: this.thumb2, input: this.input2 }
      ].forEach(({ thumb, input }) =>
        thumb.addEventListener("touchstart", (e) => {
          // To get rid of occasional drag behavior
          e.preventDefault();
          thumb.classList.add("active");


          window.addEventListener("touchmove", moveThumb(thumb, input));
        })
      );

      window.addEventListener("touchend", () => {
        [this.thumb1, this.thumb2].forEach((thumb) => thumb.classList.remove("active"));
        [
          { thumb: this.thumb1, input: this.input1 },
          { thumb: this.thumb2, input: this.input2 }
        ].forEach(({ thumb, input }) =>
          window.removeEventListener("touchmove", moveThumb(thumb, input))
        );
      });
    } else {
      [
        { thumb: this.thumb1, input: this.input1 },
        { thumb: this.thumb2, input: this.input2 }
      ].forEach(({ thumb, input }) =>
        thumb.addEventListener("mousedown", (e) => {
          // To get rid of occasional drag behavior
          e.preventDefault();
          thumb.classList.add("active");


          window.addEventListener("mousemove", moveThumb(thumb, input));
        })
      );

      window.addEventListener("mouseup", () => {
        [this.thumb1, this.thumb2].forEach((thumb) => thumb.classList.remove("active"));
        [
          { thumb: this.thumb1, input: this.input1 },
          { thumb: this.thumb2, input: this.input2 }
        ].forEach(({ thumb, input }) =>
          window.removeEventListener("mousemove", moveThumb(thumb, input))
        );
      });
    }


    // Listen to input changes
    [this.input1, this.input2].forEach((v, i) =>
      v.addEventListener("keypress", (e) => {
        if (e.keyCode === 13) {
          if (i) this.highValue = e.target.value;
          else this.lowValue = e.target.value;

          setThumbs();
          setSelection();
        } else if (!e.key.match(/[0-9]/) && e.key.length === 1 && !e.ctrlKey)
          e.preventDefault();
      })
    );

    setThumbs();
    setSelection();

    window.addEventListener("resize", initTrackDimensions);

    return this;
  }

  addClass(className) {
    this.rangeSlider.classList.add(className);
    return this;
  }

  setValue(value = []) {
    this.lowValue = value[0];
    this.input1.value = value[0];
    this.highValue = value[1];
    this.input2.value = value[1];
    
    this.setThumbs();
    this.setSelection();
    return this;
  }


}



