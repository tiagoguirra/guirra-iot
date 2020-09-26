<template>
  <div class="container-popup-side dark" @keydown.esc="onKeyEsc">
    <div class="backpoup" @click="overlayClose"></div>
    <div class="section-container">
      <div class="headerPopUp elevation-2">
        <div class="header-title">
          <v-btn
            icon
            dark
            class="ClosePopUp"
            v-if="!hideBackButton"
            @click="overlayClose"
          >
            <v-icon size="20">fas fa-arrow-left</v-icon>
          </v-btn>
          <slot name="title"
            ><h3>{{ title }}</h3></slot
          >
        </div>
        <slot name="options"></slot>
      </div>
      <form @submit.prevent="onSubmit" ref="popup">
        <v-progress-linear
          class="loading-progress"
          indeterminate
          color="primario"
          v-if="loading"
        ></v-progress-linear>
        <div class="poupupbody">
          <slot></slot>
          <div class="footer-buttons">
            <slot name="cancel" :close="overlayClose" v-if="!hideCancel">
              <v-btn color="error" rounded @click="overlayClose">{{
                cancelText
              }}</v-btn>
            </slot>
            <slot name="buttons"></slot>
          </div>
          <div class="loading" v-if="loading"></div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidePopup',
  props: {
    title: {
      type: String,
      required: false,
    },
    hideBackButton: {
      type: Boolean,
      default: false,
      required: false,
    },
    overlayNotBack: {
      type: Boolean,
      default: false,
      required: false,
    },
    routeback: {
      type: String,
      default: '',
      required: false,
    },
    hideCancel: {
      type: Boolean,
      default: false,
      required: false,
    },
    cancelText: {
      type: String,
      default: 'Close',
      required: false,
    },
    loading: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data: () => ({
    popUpKey: Math.random() * 1000,
  }),

  methods: {
    closePopUp() {
      if (this.routeback) this.$router.replace(this.routeback)
      else this.$router.back()
    },
    overlayClose() {
      if (!this.overlayNotBack) {
        this.closePopUp()
      }
      this.$emit('close')
    },
    onKeyUp(e) {
      if (e.keyCode == 27) {
        this.overlayClose()
      }
    },
    onSubmit() {
      if (!this.loading) {
        this.$emit('submit')
      }
    },
  },
  mounted() {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  },
}
</script>

<style lang="scss">
.container-popup-side {
  width: 100%;
  min-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-right: 0px;
  padding: 40px;
  z-index: 900;
  &.dark {
    .section-container,
    .headerPopUp {
      background-color: #424242;
    }
    .headerPopUp {
      border-color: #fff;
      color: #fff;
    }
    .ClosePopUp {
      color: #fff;
    }
  }

  .backpoup {
    position: absolute;
    height: 100%;
    width: 200vw;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 101;
    animation: enterAnime 1s ease-in-out;
  }
  .section-container {
    flex: 1;
    max-width: 400px;
    background-color: #fff;
    z-index: 105;
    position: relative;
  }
  .headerPopUp {
    width: 100%;
    height: 52px;
    padding: 15px;
    color: var(--primary-color);
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--primary-color);
    position: absolute;
    top: 0;
    z-index: 920;
    .header-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  .back-button {
  }
  .ClosePopUp {
    color: var(--primary-color);
  }
  .poupupbody {
    width: 100%;
    padding: 80px 30px 80px 30px;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    z-index: 910;
    text-align: left;
  }
  .footer-buttons {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 15px;
    flex-wrap: wrap;
    a,
    button {
      margin-left: 5px;
    }
  }
}

@keyframes enterAnime {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.loading-progress {
  margin-top: 52px;
}
.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 200;
}
</style>
