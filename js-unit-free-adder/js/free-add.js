(function($){
    var pluginName= "freeAdder";
    var defaults = {
        index : 0,
        name:"",
        onInit: function(){},
        onDel: function(){},
        onAdd: function(){},
        onRefreshItem: function(){}
    };

    var FreeAdder = function (element, option) {
        this.$element = element;
        this.settings = $.extend(defaults, option);
        return this;
    };

    FreeAdder.prototype = {
        _parseName : function(name){
            var value = "";
            name.split("\.").forEach(function (val) {
                value = value + val + "\\.";
            });
            return value.substr(0,value.length - 2);
        },
        _getContainer : function() {
            return $("#" + this._parseName(this.settings.name) +"-div");
        },
        _setItemId: function (index) {
            return this.settings.name +"-item" +"." + index;
        },
        _getItemId: function (index) {
            return this._parseName(this.settings.name) +"-item" +"\\." + index;
        },
        _getItemName: function(){
            return this.settings.name +"-item";
        },
        _getItem: function (index) {
            return $("#" + this._getItemId(index));
        },
        _getDataContainer: function (index) {
            var item = this._getItem(index);
            return item.find("." + this._parseName(this.settings.name) + "-data");
        },
        _getAddBtn : function() {
            return $("#" + this._parseName(this.settings.name) +"-addBtn");
        },
        _getDelBtn : function(index) {
            var item = this._getItem(index);;
            return item.find("." + this._parseName(this.settings.name) + "-delBtn");
        },

        /**
         * 添加一条
         */
        _add:function () {
            var container = this._getContainer();
            var index =  this.settings.index;
            var name = this.settings.name;
            var title = this.settings.title;
            var el = this;

            container.append("<div id='" + name + "-item." + index +"' class='"+ this._getItemName() +"'>"+
                title +
                "<button class=' btn-danger " + name + "-delBtn'" + "  type='button'>删除</button>" +
                "<div class='" + name + "-data'></div>" +
                "</div>");

            var delBtn = this._getDelBtn(index);
            delBtn.on("click", function(){
                el._del(index);
            });
            var widget = this._getDataContainer(index);
            this.settings.onAdd.call(this.element, widget, index);
            this.settings.index ++;
        },

        /**删除一条*/
        _del:function (index) {
            //移除 保存数据
            var container = this._getContainer();
            var dItem = this._getItem(index);
            var widget = this;
            dItem.remove();
            var name = this.settings.name;

            //刷新id
            var items = container.find("."+ this._parseName(name) + "-item");
            items.each(function (i, item) {
                item.id = widget._setItemId(i);
                var container = widget._getDataContainer(i);
                widget.settings.onRefreshItem.call(item.element, container, i);
            });
            this.settings.onDel.call(this.element, index);
            this.settings.index --;
        },

        init : function(){
            this.$element.append("<div id='"+ this.settings.name + "-div" +"' class='free-div'></div> <button id='" + this.settings.name + "-addBtn" + "'" + " class='btn-default' >添加</button>");
            var widget = this;
            this._getAddBtn().on("click", function () {
                widget._add();
            });
            this.settings.onInit.call(this.element, this.settings.index);
        }



    };
    FreeAdder.prototype.method = {
        addItem : function () {
            this._add();
        },

        delItem : function (index) {
            this._del(index);
        }

    };
    $.fn.freeAdder = function (options) {
        var freeAdder = new FreeAdder(this, options);
        freeAdder.init();
    }

})(jQuery);
