<script>
import * as _ from 'lodash'
export default {
  name: 'DevicePropertyMixin',
  props: {
    value: String,
    category: {
      type: String,
      required: true
    },
    type: String,
    state: {
      type: Object,
      default: () => ({}),
      required: false
    }
  },
  data: () => ({
    cateogryIcon: {
      light: 'fas fa-lightbulb',
      light_rgb: 'fas fa-lightbulb',
      light_brightness: 'fas fa-lightbulb',
      smartlock: 'fas fa-lock',
      switch: 'fas fa-power-off'
    },
    model: ''
  }),
  watch: {
    value: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.model = this.value
        }
      }
    }
  },
  created() {
    this.model = this.value
  },
  computed: {
    icon() {
      return this.cateogryIcon[this.category] || 'power-off'
    },
    isLight() {
      const categoryLight = ['light', 'light_rgb', 'light_brightness']
      return categoryLight.includes(this.category)
    },
    iconStyle() {
      const power = _.get(this.state, 'power', 'OFF')
      if (this.isLight && power === 'ON') {
        const shadowBrightness =
          (_.get(this.state, 'brightness', 100) * 50) / 100
        const red = _.get(this.state, 'color.rgba.r', 255)
        const green = _.get(this.state, 'color.rgba.g', 255)
        const blue = _.get(this.state, 'color.rgba.b', 255)
        const shadowColor = `${red},${green},${blue}`
        return {
          'border-color': `rgba(${shadowColor}, 1)`,
          'box-shadow': `0px 3px ${shadowBrightness}px -6px rgba(${shadowColor}, 1)`
        }
      } else {
        return {}
      }
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.model)
      this.$emit('change', this.model)
    },
    toggle() {
      switch (this.type) {
        case 'power':
          this.model = this.model === 'ON' ? 'OFF' : 'ON'
          break
      }
      this.onChange()
    }
  }
}
</script>
