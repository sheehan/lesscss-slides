if ("undefined" === typeof window.console) {
    window.console = {
        "log": function() { }
    };
};

$(function () {
//    var mainLayout = $('body').layout({
////        fxName: 'slide',
//        center__paneSelector:'.deck-container-wrapper',
//        south__paneSelector:'.editors-wrapper',
//        south__size:300,
//        onresize:function () {
////            $(document).trigger('mainLayout.resize');
//        }
//    });

    $.deck('.slide');
    less.watch();
    $('.slide .less').hide();

    var createEditorPair = function (el) {
        return ({
            init:function () {
                this.parser = new (less.Parser);

//                this.$el = $('<div class="editor-pair"><div class="less-wrapper"><div class="less-header">LESS</div></div><div class="css-wrapper"><div class="css-header">CSS</div></div></div>').replaceAll(el);
                this.$el = $(el);
//                this.$el.html('<div class="editors"><div class="less"></div><div class="css"></div></div>');

//                var innerLayout = this.$el.find('.editors').height('100%').layout({
//                    center__paneSelector:'.less',
//                    south__paneSelector:'.css',
//                    south__size:'50%'
//                });
//                $(document).bind('mainLayout.resize', function() {
//                    innerLayout.resizeAll();
//                });
                this.lessEditor = CodeMirror(this.$el.find('.less-editor .code')[0], {
                    mode:'css',
                    onUpdate:this.syncEditors.bind(this),
                    lineNumbers: true,
                    onKeyEvent: function(editor, event) {
                        $.Event(event).stopPropagation();
                    }
                });
                this.cssEditor = CodeMirror(this.$el.find('.css-editor .code')[0], {
                    mode:'css',
                    lineNumbers: true,
                    readOnly:true
                });

                return this;
            },

            setLess:function (less) {
                this.lessEditor.setValue(less);
                this.syncEditors();
            },

            syncEditors:function () {
                if (this.lessEditor) {
                    var css = this.parseCss(this.lessEditor.getValue());
                    if (this.cssEditor && css !== null) {
                        this.cssEditor.setValue(css);
                    }
                }
            },

            parseCss:function (lessCode) {
                var css = null;
                try {
                    this.parser.parse(lessCode, function (err, tree) {
                        if (!err) {
                            css = tree.toCSS();
                        }
                    });
                } catch (e) { console.log(e); }
                return css;
            }
        }.init());
    };

    var editorPair = createEditorPair($('.editors-wrapper'));


    var processSlide = function($slide) {
        var less = $slide.children('.less').text();
        if (!less) {
            less = $slide.parents('.slide').children('.less').first().text();
        }
        if (less) {
            $('.editors-wrapper').css('opacity', 1);
            editorPair.setLess(less);
        } else {
            $('.editors-wrapper').css('opacity', 0);
        }
    };

    $(document).bind('deck.change', function (event, from, to) {
        processSlide($.deck('getSlide', to));
    });

    processSlide($.deck('getSlide'));
});