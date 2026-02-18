<template>
  <div class="quick-settings clearfix">
    <div class="col-xs-12 control-label quick-settings-title">
      <label>{{ groupConfig.name }}</label>
    </div>

    <div class="col-xs-12">
      <template v-for="(variable, idx) in variables">
        <div :key="idx" class="quick-settings-field">
          <template v-for="field in variable.fields">
            <component :is="fieldType(field.type)" :data="fieldData(field)" :key="componentKey"></component>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { state, getSavedValue } from '../../store';
import bus from '../../libs/bus';
import ColorField from './ColorField';
import FontField from './FontField';

export default {
  data() {
    return {
      state,
      variables: this.computeVariables(),
      componentKey: 0
    };
  },
  props: {
    groupConfig: Object
  },
  components: {
    ColorField,
    FontField
  },
  methods: {
    fieldType(fieldType) {
      return `${fieldType}-field`;
    },
    fieldData(field) {
      const data = {
        fieldConfig: field
      };

      if (field.type === 'font') {
        data.webFonts = state.fonts.web;
        data.customFonts = state.fonts.custom;
      }

      return data;
    },
    computeVariables(toRecompute) {
      const variables = _.cloneDeep(toRecompute && this.variables.length ? this.variables : this.groupConfig.variables);

      // Processing variables
      variables.forEach((variable, index) => {
        variable.fields.forEach((field, idx) => {
          const values = getSavedValue(field, true);

          const newObj = {
            value: values.fieldValue,
            inheriting: true
          };

          _.extend(variables[index].fields[idx], newObj);
        });
      });

      return variables;
    },
    forceRerender() {
      this.componentKey += 1;
    },
    reSetVariables() {
      this.variables = this.computeVariables(true);
      this.$nextTick(() => {
        this.forceRerender();
        bus.$emit('variables-computed');
      });
    }
  },
  mounted() {
    bus.$on('saved-fields-set', this.reSetVariables);
  },
  destroyed() {
    bus.$off('saved-fields-set', this.reSetVariables);
  }
};
</script>
