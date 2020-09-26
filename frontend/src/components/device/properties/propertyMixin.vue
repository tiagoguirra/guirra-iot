<script>
import * as _ from 'lodash'
import { mapGetters } from 'vuex'
export default {
  name: 'DevicePropertyMixin',
  props: {
    deviceId: String,
    category: {
      type: String,
      required: true,
    },
    type: String,
  },
  data: () => ({
    cateogryIcon: {
      light: 'fas fa-lightbulb',
      light_rgb: 'fas fa-lightbulb',
      light_brightness: 'fas fa-lightbulb',
      smartlock: 'fas fa-lock',
      switch: 'fas fa-power-off',
    },
    model: '',
  }),
  watch: {
    deviceStatus: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.model = _.get(this.deviceStatus, 'state')
        }
      },
    },
  },
  computed: {
    ...mapGetters(['getDevicePropertyStatus', 'getDeviceStatus']),
    deviceStatus() {
      return this.getDevicePropertyStatus(this.deviceId, this.type)
    },
    icon() {
      if (this.category === 'smartlock') {
        const { state = '' } = this.deviceStatus
        return state === 'LOCKED' ? 'fas fa-lock' : 'fas fa-lock-open'
      }
      return this.cateogryIcon[this.category] || 'power-off'
    },
    isLight() {
      const categoryLight = ['light', 'light_rgb', 'light_brightness']
      return categoryLight.includes(this.category)
    },
    iconStyle() {
      const { state: power = 'OFF' } = this.getDevicePropertyStatus(
        this.deviceId,
        'power'
      )
      if (this.isLight && power === 'ON') {
        const { state: brightness = 0 } =
          this.getDevicePropertyStatus(this.deviceId, 'brightness') || 100

        const { state: color = {} } = this.getDevicePropertyStatus(
          this.deviceId,
          'color'
        )
        const shadowBrightness = (brightness * 50) / 100
        let { red = 1, green = 1, blue = 1 } = color
        red = red * 255
        green = green * 255
        blue = blue * 255
        if (red || green || blue) {
          const shadowColor = `${red},${green},${blue}`
          return {
            'border-color': `rgba(${shadowColor}, 1)`,
            'box-shadow': `0px 3px ${shadowBrightness}px -6px rgba(${shadowColor}, 1)`,
          }
        }
      }
      return {}
    },
  },
  methods: {
    onChange() {
      this.$emit('change', { value: this.model, property: this.type })
    },
    toggle() {
      switch (this.type) {
        case 'power':
          this.model = this.model === 'ON' ? 'OFF' : 'ON'
          break
        case 'lock':
          this.model = this.model === 'LOCKED' ? 'UNLOCKED' : 'LOCKED'
          break
      }
      this.onChange()
    },
  },
}
</script>
