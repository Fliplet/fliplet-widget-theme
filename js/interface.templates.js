this["Fliplet"] = this["Fliplet"] || {};
this["Fliplet"]["Widget"] = this["Fliplet"]["Widget"] || {};
this["Fliplet"]["Widget"]["Templates"] = this["Fliplet"]["Widget"]["Templates"] || {};

this["Fliplet"]["Widget"]["Templates"]["templates.create"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<a class=\"btn btn-primary btn-sm\" href=\"#\" data-create-instance=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">Add theme: "
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a>\n<hr />";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.instance"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "      <div>\n        <h4>"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h4>\n        <ul>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.variables : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n      </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <li>\n              <label>"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</label>\n              <input class=\"form-control\" type=\"text\" data-type=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" placeholder=\""
    + alias4(((helper = (helper = helpers["default"] || (depth0 != null ? depth0["default"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"default","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + alias4(((helper = (helper = helpers.setValue || (depth0 != null ? depth0.setValue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"setValue","hash":{},"data":data}) : helper)))
    + "\" />\n            </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<section data-instance-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.instance : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">\n  <h2>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.theme : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h2>\n  <form>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = ((stack1 = (depth0 != null ? depth0.theme : depth0)) != null ? stack1.settings : stack1)) != null ? stack1.configuration : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </form>\n  <div class=\"actions\">\n    <a href=\"#\" class=\"btn btn-danger btn-sm\" data-delete-instance>Remove this theme ("
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.theme : depth0)) != null ? stack1.name : stack1), depth0))
    + ")</a>\n  </div>\n</section>";
},"useData":true});