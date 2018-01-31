<template>
  <div class="base-input">
    <div class="base-input__inner">
      <input
        :value="value"
        :type="type"
        :placeholder="placeholder"
        :minlength="minlength"
        :maxlength="maxlength"
        autocomplete
        @input="$emit('input', $event.target.value)"
        @change="handleChange($event.target.value)">
        <i
          class="base-input__clear iconfont icon-error"
          v-show="!!value"
          @click="clearInput"></i>
    </div>
    <slot></slot>
    <transition name="zoom-in">
      <div class="base-input__info--error" v-show="showError && error">
        <i class="iconfont icon-error"></i>{{error}}
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    showError: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: [Number, String]
    },
    placeholder: {
      type: String
    },
    minlength: {
      type: Number
    },
    maxlength: {
      type: Number
    },
    validators: {
      validator: val => {
        if (!Array.isArray(val)) {
          return false;
        }
        let valid = true;
        val.forEach(element => {
          Object.keys(element).forEach(key => {
            if (!['reg', 'errText', 'equalTo'].includes(key)) {
              valid = false
            }
          });
        });
        return valid;
      }
    }
  },
  data() {
    return {
      error: ''
    };
  },
  methods: {
    handleChange(val) {
      if (this.validators) {
        this.error = this.validate(val);
        this.$emit('validation', this.error);
      }
    },
    validate(val) {
      let result = '';
      this.validators.some(validator => {
        const { reg, errText, equalTo } = validator;
        if (reg && !reg.test(val)) {
          // 如果有正则匹配
          result = errText;
          return true;
        }
        if (equalTo && equalTo !== val) {
          // 如果有期望值
          result = errText;
          return true;
        }
        return false;
      });
      return result;
    },
    clearInput() {
      this.$emit('input', '');
      this.handleChange('');
    },
    clearError() {
      this.error = '';
    }
  }
}
</script>
