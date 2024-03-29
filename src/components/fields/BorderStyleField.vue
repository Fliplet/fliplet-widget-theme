<template>
  <div v-if="showField" :class="'border-style-field-holder ' + columnClass + ' ' + (isChanged ? 'field-changed' : '')">
    <div class="wrapper">
      <div class="dropdown select-box">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <template v-if="valueToShow === 'none'">
            None
          </template>
          <span v-else class="border-style" :title="`$${name}`" :style="'border-style: ' + valueToShow"></span>
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu dropdown-menu-left">
          <li v-for="(prop, index) in properties" :key="index" :class="{ active: prop === valueToShow }">
            <a href="#" @click.prevent="onValueChange(prop)">
              <template v-if="prop === 'none'">
                None
              </template>
              <span v-else class="border-style" :style="'border-style: ' + prop"></span>
            </a>
          </li>
        </ul>
      </div>
      <div v-if="label" class="field-label" :title="`$${name}`">{{ label }}</div>
      <inherit-dot v-if="!isInheriting" @update-all="updateAll" @update-previous-context="updatePreviousContext" @trigger-inherit="inheritValue" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, saveFieldData, getCurrentFieldValue,
  getFieldName, getFieldNameByContext, checkIsFieldChanged, sendCssToFrame } from '../../store';
import InheritDot from '../UI/InheritDot';
import borderProperties from '../../libs/border-properties';
import createClass from '../../libs/column-class';
import bus from '../../libs/bus';

export default {
  data() {
    return {
      state,
      name: getFieldName(this.data.fieldConfig),
      value: getCurrentFieldValue(this.data.fieldConfig),
      valueToShow: undefined,
      label: this.data.fieldConfig.label,
      properties: borderProperties,
      isInheriting: this.checkInheritance(),
      inheritingFrom: this.data.fieldConfig.inheritingFrom,
      isChanged: checkIsFieldChanged(this.data.fieldConfig),
      showField: typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
    };
  },
  components: {
    InheritDot
  },
  props: {
    data: Object
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        sendCssToFrame(newVal, this.data.fieldConfig);
        this.$nextTick(() => {
          this.prepareToSave();
        });
      }
    }
  },
  computed: {
    columnClass() {
      return createClass(this.data.fieldConfig.columns);
    }
  },
  methods: {
    setValues() {
      this.valueToShow = this.value;
    },
    getValueToShow() {
      return getCurrentFieldValue(this.data.fieldConfig);
    },
    onValueChange(value) {
      this.valueToShow = value;
      this.value = value;
    },
    prepareToSave(data) {
      data = data || {
        name: getFieldName(this.data.fieldConfig),
        value: this.value
      };

      saveFieldData(data);
    },
    checkInheritance() {
      return state.componentContext === 'Mobile' ? true : this.data.fieldConfig.inheriting;
    },
    reCheckProps() {
      this.isInheriting = this.checkInheritance();
      this.isChanged = checkIsFieldChanged(this.data.fieldConfig);
      this.valueToShow = this.getValueToShow();
      this.showField = typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true;
    },
    updateAll() {
      const mobileFieldName = this.data.fieldConfig.name;
      const currentFieldName = getFieldNameByContext({
        field: this.data.fieldConfig,
        context: state.componentContext.toLowerCase()
      });

      // This function can only be run when the user is either
      // in the tablet or desktop context, so it is safe to assume
      // that if it's not one is the other
      const remainingFieldContext = state.componentContext.toLowerCase() === 'tablet'
        ? 'desktop'
        : 'tablet';
      const remainingFieldInheritance = remainingFieldContext === 'desktop'
        ? 'tablet'
        : 'mobile';
      const remainingFieldName = getFieldNameByContext({
        field: this.data.fieldConfig,
        context: remainingFieldContext
      });

      const dataToSave = [
        {
          name: mobileFieldName,
          value: this.value
        },
        {
          name: currentFieldName,
          value: 'inherit-' + this.inheritingFrom
        },
        {
          name: remainingFieldName,
          value: 'inherit-' + remainingFieldInheritance
        }
      ];

      this.prepareToSave(dataToSave);
    },
    updatePreviousContext() {
      const fieldName = getFieldNameByContext({
        field: this.data.fieldConfig,
        context: this.inheritingFrom
      });
      const dataToSave = [
        {
          name: fieldName,
          value: this.value
        },
        {
          name: getFieldName(this.data.fieldConfig),
          value: 'inherit-' + this.inheritingFrom
        }
      ];

      this.prepareToSave(dataToSave);
    },
    inheritValue(value) {
      this.value = value;
    }
  },
  created() {
    this.setValues();
  },
  mounted() {
    bus.$on('variables-computed', this.reCheckProps);
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps);
  }
};
</script>
