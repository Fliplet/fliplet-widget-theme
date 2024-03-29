<template>
  <div v-if="showField" :class="'display-field-holder ' + columnClass + ' ' + (isChanged ? 'field-changed' : '')">
    <div class="wrapper">
      <div class="display-field-container" :class="{ 'disabled': state.widgetIsFlexChild }">
        <div class="radio-holder inline-boxed" v-for="(prop, idx) in properties" :key="idx">
          <input type="radio" :id="'radio-' + prop + uuid" :name="'display-field-' + uuid" :value="prop" v-model="value">
          <label :for="'radio-' + prop + uuid" data-toggle="tooltip" data-placement="bottom" :title="getTooltip(prop)">
            <span :class="'check-icon check-display-' + prop"></span>
          </label>
        </div>
      </div>
      <inherit-dot v-if="!isInheriting" @update-all="updateAll" @update-previous-context="updatePreviousContext" @trigger-inherit="inheritValue" :move-left="true" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
    <div v-if="state.widgetIsFlexChild" class="parent-flex-helper" data-toggle="tooltip" data-placement="bottom" title="Row set by the container">
      <i class="fa fa-question-circle-o"></i>
    </div>
  </div>
</template>

<script>
import { state, getCurrentFieldValue, getFieldName, getFieldNameByContext,
  saveFieldData, checkIsFieldChanged, checkLogic, sendCssToFrame } from '../../store';
import InheritDot from '../UI/InheritDot';
import displayProperties from '../../libs/display-properties';
import { tooltips } from '../../libs/tooltips';
import createClass from '../../libs/column-class';
import bus from '../../libs/bus';

export default {
  data() {
    return {
      state,
      value: getCurrentFieldValue(this.data.fieldConfig),
      properties: displayProperties.normalProperties,
      isInheriting: this.checkInheritance(),
      inheritingFrom: this.data.fieldConfig.inheritingFrom,
      isChanged: checkIsFieldChanged(this.data.fieldConfig),
      showField: typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true,
      fromReset: false,
      uuid: Fliplet.guid()
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
      if (newVal !== oldVal && !this.fromReset) {
        checkLogic(this.data.fieldConfig, newVal);
        sendCssToFrame(newVal, this.data.fieldConfig);

        this.$nextTick(() => {
          this.prepareToSave();
        });

        return;
      }

      this.fromReset = false;
    }
  },
  computed: {
    columnClass() {
      return createClass(this.data.fieldConfig.columns);
    }
  },
  methods: {
    getTooltip(prop) {
      switch (prop) {
        case 'block':
          return 'No row sharing';
        case 'inline-block':
          return 'Row sharing';
        default:
          return 'No row sharing';
      }
    },
    getValue() {
      return getCurrentFieldValue(this.data.fieldConfig);
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

      if (this.fromReset) {
        this.value = this.getValue();
        checkLogic(this.data.fieldConfig, this.value);
        sendCssToFrame(this.value, this.data.fieldConfig);
      }

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
      this.$nextTick(() => {
        this.fromReset = true;
      });
    }
  },
  mounted() {
    bus.$on('variables-computed', this.reCheckProps);
    checkLogic(this.data.fieldConfig, this.value);
    // Start Bootstrap tooltips
    tooltips();
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps);
  }
};
</script>
