$(function () {
    var mainLayout = $('body').layout({
        fxName: 'slide',
        center__paneSelector:'.deck-container-wrapper',
        east__paneSelector:'.editors-wrapper',
        east__size:400,
        onresize:function () {
            $(document).trigger('mainLayout.resize');
        }
    });

    $.deck('.slide');
    console.log(mainLayout);

    var createEditorPair = function (el) {
        return ({
            init:function () {
                this.parser = new (less.Parser);

//                var lessCode = 'div {}';//$(el).text();
//                var css = this.parseCss(lessCode);

//                this.$el = $('<div class="editor-pair"><div class="less-wrapper"><div class="less-header">LESS</div></div><div class="css-wrapper"><div class="css-header">CSS</div></div></div>').replaceAll(el);
                this.$el = $(el);
                this.$el.html('<div class="editors"><div class="less"></div><div class="css"></div></div>');

                var innerLayout = this.$el.find('.editors').height('100%').layout({
                    center__paneSelector:'.less',
                    south__paneSelector:'.css',
                    south__size:'50%'
                });
                $(document).bind('mainLayout.resize', function() {
                    innerLayout.resizeAll();
                });

                this.lessEditor = CodeMirror(this.$el.find('.less')[0], {
//                    value:lessCode,
                    mode:'css',
                    onUpdate:this.syncEditors.bind(this),
                    onKeyEvent: function(editor, event) {
                        $.Event(event).stopPropagation();
                    }
                });

                this.cssEditor = CodeMirror(this.$el.find('.css')[0], {
//                    value:css,
                    mode:'css',
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
                this.parser.parse(lessCode, function (err, tree) {
                    if (!err) {
                        css = tree.toCSS();
                    }
                });
                return css;
            }
        }.init());
    };

    var editorPair = createEditorPair($('.editors-wrapper'));


    var processSlide = function($slide) {
        var less = $slide.children('.less').hide().text();
        if (!less) {
            less = $slide.parents('.slide').children('.less').first().hide().text();
        }
        if (less) {
            mainLayout.resizers.east.css('opacity', 1);
            mainLayout.panes.east.css('opacity', 1);
            editorPair.setLess(less);
        } else {
            mainLayout.resizers.east.css('opacity', 0);
            mainLayout.panes.east.css('opacity', 0);
        }
    };

    $(document).bind('deck.change', function (event, from, to) {
        processSlide($.deck('getSlide', to));
    });

    processSlide($.deck('getSlide'));
});