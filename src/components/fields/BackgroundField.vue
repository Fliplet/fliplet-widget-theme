<template>
  <div v-if="showField" :class="'background-field-holder ' + columnClass + ' ' + (isChanged ? 'field-changed' : '')">
    <div class="wrapper">
      <div class="radio-holder inline-circle" v-for="(prop, idx) in properties" :key="idx">
        <input type="radio" :id="'radio-background-' + prop.toLowerCase()" :name="'radio-background-' + data.fieldConfig.name" :value="prop" v-model="value">
        <label :for="'radio-background-' + prop.toLowerCase()">
          <span class="check-icon"></span> {{ prop }}
        </label>
      </div>
      <inherit-dot v-if="!isInheriting" @update-all="updateAll" @update-previous-context="updatePreviousContext" @trigger-inherit="inheritValue" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, getCurrentFieldValue, getFieldName, getFieldNameByContext,
  saveFieldData, checkLogic, checkIsFieldChanged } from '../../store';
import InheritDot from '../UI/InheritDot';
import bgProperties from '../../libs/background-properties';
import createClass from '../../libs/column-class';
import bus from '../../libs/bus';

export default {
  data() {
    return {
      state,
      value: getCurrentFieldValue(this.data.fieldConfig),
      properties: bgProperties[this.data.fieldConfig.properties],
      isInheriting: this.checkInheritance(),
      inheritingFrom: this.data.fieldConfig.inheritingFrom,
      isChanged: checkIsFieldChanged(this.data.fieldConfig),
      showField: typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true,
      fromReset: false
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
        this.prepareToSave();

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
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps);
  }
};
</script>
