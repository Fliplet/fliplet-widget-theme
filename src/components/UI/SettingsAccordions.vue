<template>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" :id="'heading-' + accordionIndex" data-toggle="collapse" data-parent="#accordion" :data-target="'#collapse-' + accordionIndex" aria-expanded="false" :aria-controls="'#collapse-' + accordionIndex">
      <h4 class="panel-title">{{ accordionConfig.name }} <i class="fa fa-chevron-down" aria-hidden="true"></i></h4>
    </div>
    <div :id="'collapse-' + accordionIndex" class="panel-collapse collapse" role="tabpanel" :aria-labelledby="'heading-' + accordionIndex" :data-index="accordionIndex">
      <div class="panel-body">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    accordionConfig: Object,
    accordionIndex: Number
  }
}
</script>