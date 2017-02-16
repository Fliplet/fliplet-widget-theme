this["Fliplet"] = this["Fliplet"] || {};
this["Fliplet"]["Widget"] = this["Fliplet"]["Widget"] || {};
this["Fliplet"]["Widget"]["Templates"] = this["Fliplet"]["Widget"]["Templates"] || {};

this["Fliplet"]["Widget"]["Templates"]["templates.create"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<option data-theme-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-create-instance value=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.instance"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "      <div class=\"panel panel-default\">\n        <div class=\"panel-heading\" role=\"tab\" id=\"heading"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">\n          <h4 class=\"panel-title\" data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#collapse"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" aria-expanded=\"false\" aria-controls=\"collapse"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">\n              "
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\n              <i class=\"fa fa-chevron-down\" aria-hidden=\"true\"></i>\n          </h4>\n        </div>\n        <div id=\"collapse"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"heading"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">\n          <div class=\"panel-body\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.variables : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "          </div>\n        </div>\n      </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "            <div class=\"form-group\">\n              <div class=\"col-sm-4 control-label\">\n                <label>"
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</label>\n              </div>\n              <div class=\"col-sm-8\">\n"
    + ((stack1 = (helpers.if_eq || (depth0 && depth0.if_eq) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"color",{"name":"if_eq","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "              </div>\n            </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <div class=\"input-group\" colorpicker-component>\n                  <div class=\"input-group-addon\"><i style=\"background-color:"
    + alias4(((helper = (helper = helpers.setValue || (depth0 != null ? depth0.setValue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"setValue","hash":{},"data":data}) : helper)))
    + "\"></i></div>\n                  <input class=\"form-control\" type=\"text\" data-type=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" placeholder=\""
    + alias4(((helper = (helper = helpers["default"] || (depth0 != null ? depth0["default"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"default","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + alias4(((helper = (helper = helpers.setValue || (depth0 != null ? depth0.setValue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"setValue","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.helper : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                  <p class=\"text-helper\">"
    + container.escapeExpression(((helper = (helper = helpers.helper || (depth0 != null ? depth0.helper : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"helper","hash":{},"data":data}) : helper)))
    + "</p>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <input class=\"form-control\" type=\"text\" data-type=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" placeholder=\""
    + alias4(((helper = (helper = helpers["default"] || (depth0 != null ? depth0["default"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"default","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + alias4(((helper = (helper = helpers.setValue || (depth0 != null ? depth0.setValue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"setValue","hash":{},"data":data}) : helper)))
    + "\" />\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hint : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                <p class=\"text-helper\">"
    + container.escapeExpression(((helper = (helper = helpers.hint || (depth0 != null ? depth0.hint : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"hint","hash":{},"data":data}) : helper)))
    + "</p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<section data-instance-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.instance : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" data-widget-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.instance : depth0)) != null ? stack1.widgetId : stack1), depth0))
    + "\" data-package-name=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.theme : depth0)) != null ? stack1["package"] : stack1), depth0))
    + "\">\n  <p>Use the fields below to change the styles of your app.</p>\n  <form class=\"form-horizontal\">\n    <div class=\"panel-group\" id=\"accordion\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = ((stack1 = (depth0 != null ? depth0.theme : depth0)) != null ? stack1.settings : stack1)) != null ? stack1.configuration : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n  </form>\n</section>\n";
},"useData":true});