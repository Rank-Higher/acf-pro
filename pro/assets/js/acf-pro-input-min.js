!function($){acf.fields.repeater=acf.field.extend({type:"repeater",$el:null,$input:null,$table:null,$tbody:null,$clone:null,actions:{ready:"initialize",append:"initialize",show:"show"},events:{'click a[data-event="add-row"]':"_add",'click a[data-event="remove-row"]':"_remove",'click a[data-event="collapse-row"]':"_collapse","mouseenter td.order":"_mouseenter"},focus:function(){this.$el=this.$field.find(".acf-repeater:first"),this.$input=this.$field.find("input:first"),this.$table=this.$field.find("table:first"),this.$tbody=this.$table.children("tbody"),this.$clone=this.$tbody.children("tr.acf-clone"),this.o=acf.get_data(this.$el),this.o.min=this.o.min||0,this.o.max=this.o.max||0},initialize:function(){acf.disable_form(this.$clone,"repeater"),this.render()},show:function(){this.$tbody.find(".acf-field:visible").each(function(){acf.do_action("show_field",$(this))})},count:function(){return this.$tbody.children().length-1},render:function(){this.$tbody.children().each(function(e){$(this).find("> td.order > span").html(e+1)}),0==this.count()?this.$el.addClass("-empty"):this.$el.removeClass("-empty"),this.o.max>0&&this.count()>=this.o.max?this.$el.find("> .acf-actions .button").addClass("disabled"):this.$el.find("> .acf-actions .button").removeClass("disabled")},add:function(e){if(e=e||this.$clone,this.o.max>0&&this.count()>=this.o.max)return alert(acf._e("repeater","max").replace("{max}",this.o.max)),!1;var t=this.$field;return $el=acf.duplicate(this.$clone),$el.removeClass("acf-clone"),acf.enable_form($el,"repeater"),e.before($el),this.doFocus(t),this.render(),acf.validation.remove_error(this.$field),this.sync(),$el},remove:function(e){var t=this;if(this.count()<=this.o.min)return alert(acf._e("repeater","min").replace("{min}",this.o.min)),!1;acf.do_action("remove",e),acf.remove_tr(e,function(){t.$input.trigger("change"),t.render(),t.sync(),acf.do_action("refresh",t.$field)})},sync:function(){var e="collapsed_"+this.$field.data("key"),t=[];this.$tbody.children().each(function(e){$(this).hasClass("-collapsed")&&t.push(e)}),acf.update_user_setting(e,t.join(","))},_mouseenter:function(e){if(!this.$tbody.hasClass("ui-sortable")&&1!=this.o.max){var t=this;this.$tbody.sortable({items:"> tr",handle:"> td.order",forceHelperSize:!0,forcePlaceholderSize:!0,scroll:!0,start:function(e,t){acf.do_action("sortstart",t.item,t.placeholder)},stop:function(e,a){t.render(),acf.do_action("sortstop",a.item,a.placeholder)},update:function(e,a){t.$input.trigger("change")}})}},_add:function(e){$row=!1,e.$el.hasClass("acf-icon")&&($row=e.$el.closest(".acf-row")),this.add($row)},_remove:function(e){this.remove(e.$el.closest(".acf-row"))},_collapse:function(e){var t=e.$el.closest(".acf-row"),a=this.$field;t.hasClass("-collapsed")?(t.removeClass("-collapsed"),acf.do_action("show",t,"collapse")):(t.addClass("-collapsed"),acf.do_action("hide",t,"collapse")),this.set("$field",a).sync(),acf.do_action("refresh",this.$field)}})}(jQuery),function($){acf.fields.flexible_content=acf.field.extend({type:"flexible_content",$el:null,$input:null,$values:null,$clones:null,actions:{ready:"initialize",append:"initialize",show:"show"},events:{'click [data-event="add-layout"]':"_open",'click [data-event="remove-layout"]':"_remove",'click [data-event="collapse-layout"]':"_collapse","click .acf-fc-layout-handle":"_collapse","click .acf-fc-popup a":"_add","blur .acf-fc-popup .focus":"_close","mouseenter .acf-fc-layout-handle":"_mouseenter"},focus:function(){this.$el=this.$field.find(".acf-flexible-content:first"),this.$input=this.$el.children("input"),this.$values=this.$el.children(".values"),this.$clones=this.$el.children(".clones"),this.o=acf.get_data(this.$el),this.o.min=this.o.min||0,this.o.max=this.o.max||0},count:function(){return this.$values.children(".layout").length},initialize:function(){acf.disable_form(this.$clones,"flexible_content"),this.render()},show:function(){this.$values.find(".acf-field:visible").each(function(){acf.do_action("show_field",$(this))})},render:function(){var e=this;this.$values.children(".layout").each(function(e){$(this).find("> .acf-fc-layout-handle .acf-fc-layout-order").html(e+1)}),0==this.count()?this.$el.addClass("empty"):this.$el.removeClass("empty"),this.o.max>0&&this.count()>=this.o.max?this.$el.find("> .acf-actions .button").addClass("disabled"):this.$el.find("> .acf-actions .button").removeClass("disabled")},render_layout_title:function(e){var t=e.children("input"),a=t.attr("name").replace("[acf_fc_layout]",""),i=acf.prepare_for_ajax({action:"acf/fields/flexible_content/layout_title",field_key:this.$field.data("key"),i:e.index(),layout:t.val(),value:acf.serialize(e,a)});$.ajax({url:acf.get("ajaxurl"),dataType:"html",type:"post",data:i,success:function(t){t&&e.find("> .acf-fc-layout-handle").html(t)}})},validate_add:function(e){e=e||"";var t=this.o.max,a=this.count();if(t&&a>=t){var i=1==t?"layout":"layouts",l=acf._e("flexible_content","max");return l=l.replace("{max}",t),l=l.replace("{identifier}",acf._e("flexible_content",i)),alert(l),!1}if(e){var n=$(this.$el.children(".tmpl-popup").html()),s=n.find('[data-layout="'+e+'"]'),c=parseInt(s.attr("data-max")),o=this.$values.children('.layout[data-layout="'+e+'"]').length;if(c>0&&o>=c){var i=1==c?"layout":"layouts",l=acf._e("flexible_content","max_layout");return l=l.replace("{max}",o),l=l.replace("{label}",'"'+s.text()+'"'),l=l.replace("{identifier}",acf._e("flexible_content",i)),alert(l),!1}}return!0},validate_remove:function(e){e=e||"";var t=this.o.min,a=this.count();if(t>0&&a<=t){var i=1==t?"layout":"layouts",l=acf._e("flexible_content","min")+", "+acf._e("flexible_content","remove");return l=l.replace("{min}",t),l=l.replace("{identifier}",acf._e("flexible_content",i)),l=l.replace("{layout}",acf._e("flexible_content","layout")),confirm(l)}if(e){var n=$(this.$el.children(".tmpl-popup").html()),s=n.find('[data-layout="'+e+'"]'),c=parseInt(s.attr("data-min")),o=this.$values.children('.layout[data-layout="'+e+'"]').length;if(c>0&&o<=c){var i=1==c?"layout":"layouts",l=acf._e("flexible_content","min_layout")+", "+acf._e("flexible_content","remove");return l=l.replace("{min}",o),l=l.replace("{label}",'"'+s.text()+'"'),l=l.replace("{identifier}",acf._e("flexible_content",i)),l=l.replace("{layout}",acf._e("flexible_content","layout")),confirm(l)}}return!0},sync:function(){var e="collapsed_"+this.$field.data("key"),t=[];this.$values.children(".layout").each(function(e){$(this).hasClass("-collapsed")&&t.push(e)}),acf.update_user_setting(e,t.join(","))},add:function(e,t){if(t=t||!1,!this.validate_add(e))return!1;var a=this.$field,i=this.$clones.children('.layout[data-layout="'+e+'"]');$el=acf.duplicate(i),acf.enable_form($el,"flexible_content"),this.$el.children(".no-value-message").hide(),t?t.before($el):this.$values.append($el),this.doFocus(a),this.render(),acf.validation.remove_error(this.$field),this.sync()},_mouseenter:function(e){if(!this.$values.hasClass("ui-sortable")&&1!=this.o.max){var t=this;this.$values.sortable({items:"> .layout",handle:"> .acf-fc-layout-handle",forceHelperSize:!0,forcePlaceholderSize:!0,scroll:!0,start:function(e,t){acf.do_action("sortstart",t.item,t.placeholder)},stop:function(e,a){t.render(),acf.do_action("sortstop",a.item,a.placeholder)},update:function(e,a){t.$input.trigger("change")}})}},_open:function(e){if(!this.validate_add())return!1;var t=this.$values,a=$(this.$el.children(".tmpl-popup").html());a.find("a").each(function(){var e=$(this),a=e.data("min")||0,i=e.data("max")||0,l=e.data("layout"),n=t.children('.layout[data-layout="'+l+'"]').length;if(i&&n>=i)return void e.addClass("disabled");if(a){var s=a-n,c=acf._e("flexible_content","required"),o=1==s?"layout":"layouts",c=c.replace("{required}",s);if(c=c.replace("{min}",a),c=c.replace("{label} ",""),c=c.replace("{identifier}",acf._e("flexible_content",o)),s>0){var r=$('<span class="badge"></span>').attr("title",c).text(s);e.append(r)}}}),e.$el.after(a),e.$el.closest(".acf-fc-layout-controlls").exists()&&a.closest(".layout").addClass("-open"),a.css({"margin-top":0-a.height()-e.$el.outerHeight()-15,"margin-left":(e.$el.outerWidth()-a.width())/2}),a.offset().top<($("#wpadminbar").height()||0)+30&&(a.css({"margin-top":15}),a.addClass("bottom")),a.children(".focus").trigger("focus")},_close:function(e){var t=e.$el.parent();t.closest(".layout").removeClass("-open"),setTimeout(function(){t.remove()},200)},_add:function(e){var t=e.$el.closest(".acf-fc-popup"),a=e.$el.attr("data-layout"),i=!1;t.closest(".acf-fc-layout-controlls").exists()&&(i=t.closest(".layout")),this.add(a,i)},_remove:function(e){var t=this,a=e.$el.closest(".layout");if(this.validate_remove(a.attr("data-layout"))){var i=0,l=this.$el.children(".no-value-message");0==a.siblings(".layout").length&&(i=l.outerHeight()),acf.do_action("remove",a),acf.remove_el(a,function(){t.render(),t.$input.trigger("change"),i>0&&l.show(),t.sync()},i)}},_collapse:function(e){var t=e.$el.closest(".layout"),a=t.hasClass("-collapsed"),i=a?"show":"hide";this.render_layout_title(t),t.toggleClass("-collapsed"),this.sync(),acf.do_action(i,t,"collapse")}})}(jQuery),function($){acf.fields.gallery=acf.field.extend({type:"gallery",$el:null,$main:null,$side:null,$attachments:null,$input:null,actions:{ready:"initialize",append:"initialize",show:"resize"},events:{"click .acf-gallery-attachment":"_select","click .acf-gallery-add":"_add","click .acf-gallery-remove":"_remove","click .acf-gallery-close":"_close","change .acf-gallery-sort":"_sort","click .acf-gallery-edit":"_edit","click .acf-gallery-update":"_update","change .acf-gallery-side input":"_update","change .acf-gallery-side textarea":"_update","change .acf-gallery-side select":"_update"},focus:function(){this.$el=this.$field.find(".acf-gallery:first"),this.$main=this.$el.children(".acf-gallery-main"),this.$side=this.$el.children(".acf-gallery-side"),this.$attachments=this.$main.children(".acf-gallery-attachments"),this.$input=this.$el.find("input:first"),this.o=acf.get_data(this.$el),this.o.min=this.o.min||0,this.o.max=this.o.max||0},initialize:function(){var e=this,t=this.$field;this.$attachments.unbind("sortable").sortable({items:".acf-gallery-attachment",forceHelperSize:!0,forcePlaceholderSize:!0,scroll:!0,start:function(e,t){t.placeholder.html(t.item.html()),t.placeholder.removeAttr("style"),acf.do_action("sortstart",t.item,t.placeholder)},stop:function(e,t){acf.do_action("sortstop",t.item,t.placeholder)}}),this.$el.unbind("resizable").resizable({handles:"s",minHeight:200,stop:function(e,t){acf.update_user_setting("gallery_height",t.size.height)}}),$(window).on("resize",function(){e.set("$field",t).resize()}),this.render(),this.resize()},resize:function(){for(var e=100,t=175,a=4,i=this.$el.width(),l=4;l<20;l++){var n=i/l;if(100<n&&n<175){a=l;break}}a=Math.min(a,8),this.$el.attr("data-columns",a)},render:function(){var e=this.$main.find(".acf-gallery-sort"),t=this.$main.find(".acf-gallery-add");this.o.max>0&&this.count()>=this.o.max?t.addClass("disabled"):t.removeClass("disabled"),this.count()?e.removeClass("disabled"):e.addClass("disabled")},open_sidebar:function(){this.$el.addClass("sidebar-open"),this.$main.find(".acf-gallery-sort").hide();var e=this.$el.width()/3;e=parseInt(e),e=Math.max(e,350),this.$side.children(".acf-gallery-side-inner").css({width:e-1}),this.$side.animate({width:e-1},250),this.$main.animate({right:e},250)},_close:function(e){this.close_sidebar()},close_sidebar:function(){this.$el.removeClass("sidebar-open");var e=this.$el.find(".acf-gallery-sort");this.get_attachment("active").removeClass("active"),this.$side.find("input, textarea, select").attr("disabled","disabled"),this.$main.animate({right:0},250),this.$side.animate({width:0},250,function(){e.show(),$(this).find(".acf-gallery-side-data").html("")})},count:function(){return this.get_attachments().length},get_attachments:function(){return this.$attachments.children(".acf-gallery-attachment")},get_attachment:function(e){return e=e||0,e="active"===e?".active":'[data-id="'+e+'"]',this.$attachments.children(".acf-gallery-attachment"+e)},render_attachment:function(e){e=this.prepare(e);var t=this.get_attachment(e.id),a=t.find(".margin"),i=t.find("img"),l=t.find(".filename"),n=t.find('input[type="hidden"]'),s=e.url;"image"==e.type?l.remove():(s=acf.maybe_get(e,"thumb.src"),l.text(e.filename)),s||(s=acf._e("media","default_icon"),t.addClass("-icon")),i.attr({src:s,alt:e.alt,title:e.title}),acf.val(n,e.id)},_add:function(e){if(this.o.max>0&&this.count()>=this.o.max)return void acf.validation.add_warning(this.$field,acf._e("gallery","max"));var t=this,a=this.$field,i=acf.media.popup({title:acf._e("gallery","select"),mode:"select",type:"",field:this.$field.data("key"),multiple:"add",library:this.o.library,mime_types:this.o.mime_types,select:function(e,i){t.set("$field",a).add_attachment(e,i)}});i.on("content:activate:browse",function(){t.render_collection(i),i.content.get().collection.on("reset add",function(){t.render_collection(i)})})},add_attachment:function(e,t){if(t=t||0,e=this.prepare(e),!(this.o.max>0&&this.count()>=this.o.max||this.get_attachment(e.id).exists())){var a=this.$el.find('input[type="hidden"]:first').attr("name"),i=['<div class="acf-gallery-attachment acf-soh" data-id="'+e.id+'">','<input type="hidden" value="'+e.id+'" name="'+a+'[]">','<div class="margin" title="">','<div class="thumbnail">','<img src="" alt="">',"</div>",'<div class="filename"></div>',"</div>",'<div class="actions acf-soh-target">','<a href="#" class="acf-icon -cancel dark acf-gallery-remove" data-id="'+e.id+'"></a>',"</div>","</div>"].join(""),l=$(i);if(this.$attachments.append(l),"prepend"===this.o.insert){var n=this.$attachments.children(":eq("+t+")");n.exists()&&n.before(l)}this.render_attachment(e),this.render(),this.$input.trigger("change")}},_select:function(e){var t=e.$el.data("id");this.select_attachment(t)},select_attachment:function(e){var t=this.get_attachment(e);t.hasClass("active")||(this.$side.find(":focus").trigger("blur"),this.get_attachment("active").removeClass("active"),t.addClass("active"),this.fetch(e),this.open_sidebar())},prepare:function(e){if(e=e||{},e._valid)return e;var t={id:"",url:"",alt:"",title:"",filename:""};return e.id&&(t=e.attributes,t.url=acf.maybe_get(t,"sizes.medium.url",t.url)),t._valid=!0,t},fetch:function(e){var t=acf.prepare_for_ajax({action:"acf/fields/gallery/get_attachment",field_key:this.$field.data("key"),id:e});if(this.$el.data("xhr")&&this.$el.data("xhr").abort(),"string"==typeof e&&0===e.indexOf("_")){var a=this.get_attachment(e).find('input[type="hidden"]').val();a=$.parseJSON(a),t.attachment=a}var i=$.ajax({url:acf.get("ajaxurl"),dataType:"html",type:"post",cache:!1,data:t,context:this,success:this.fetch_success});this.$el.data("xhr",i)},fetch_success:function(e){if(e){var t=this.$side.find(".acf-gallery-side-data");t.html(e),t.find(".compat-field-acf-form-data").remove();var a=t.find("> .compat-attachment-fields > tbody > tr").detach();t.find("> table.form-table > tbody").append(a),t.find("> .compat-attachment-fields").remove(),acf.do_action("append",t)}},_sort:function(e){var t=e.$el.val();if(t){var a=acf.prepare_for_ajax({action:"acf/fields/gallery/get_sort_order",field_key:this.$field.data("key"),ids:[],sort:t});this.get_attachments().each(function(){var e=$(this).attr("data-id");e&&a.ids.push(e)});var i=$.ajax({url:acf.get("ajaxurl"),dataType:"json",type:"post",cache:!1,data:a,context:this,success:this._sort_success})}},_sort_success:function(e){if(acf.is_ajax_success(e)){e.data.reverse();for(i in e.data){var t=e.data[i],a=this.get_attachment(t);this.$attachments.prepend(a)}}},_update:function(){var e=this.$side.find(".acf-gallery-update"),t=this.$side.find(".acf-gallery-edit"),a=this.$side.find(".acf-gallery-side-data"),i=t.data("id"),l=acf.serialize_form(a);if(e.attr("disabled"))return!1;e.attr("disabled","disabled"),e.before('<i class="acf-loading"></i>'),l.action="acf/fields/gallery/update_attachment",acf.prepare_for_ajax(l),$.ajax({url:acf.get("ajaxurl"),data:l,type:"post",dataType:"json",complete:function(t){e.removeAttr("disabled"),e.prev(".acf-loading").remove()}})},_remove:function(e){e.stopPropagation();var t=e.$el.data("id");this.remove_attachment(t)},remove_attachment:function(e){this.close_sidebar(),this.get_attachment(e).remove(),this.render(),this.$input.trigger("change")},_edit:function(e){var t=e.$el.data("id");this.edit_attachment(t)},edit_attachment:function(e){var t=this,a=this.$field,i=acf.media.popup({mode:"edit",title:acf._e("image","edit"),button:acf._e("image","update"),attachment:e,select:function(i){t.set("$field",a).render_attachment(i),t.fetch(e)}})},render_collection:function(e){var t=this;setTimeout(function(){var a=e.content.get().$el;if(collection=e.content.get().collection||null,collection){var i=-1;collection.each(function(e){i++;var l=a.find(".attachments > .attachment:eq("+i+")");t.get_attachment(e.id).exists()&&(e.off("selection:single"),l.addClass("acf-selected"))})}},10)}});var e=acf.model.extend({actions:{validation_begin:"validation_begin",validation_failure:"validation_failure"},validation_begin:function(){$(".acf-gallery-side-data").each(function(){acf.disable_form($(this),"gallery")})},validation_failure:function(){$(".acf-gallery-side-data").each(function(){acf.enable_form($(this),"gallery")})}})}(jQuery);