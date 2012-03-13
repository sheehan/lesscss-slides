if ("undefined" === typeof window.console) {
    window.console = {
        "log": function() { }
    };
};

$(function () {
    $.deck('.slide');
    less.watch();
    $('.slide .less').hide();

    var createEditorPair = function (el) {
        return ({
            init:function () {
                this.parser = new (less.Parser);
                this.$el = $(el);
                this.lessEditor = CodeMirror(this.$el.find('.less-editor .code')[0], {
                    mode:'css',
                    lineNumbers: true,
                    onUpdate:this.syncEditors.bind(this),
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
                var $lessEditor = this.$el.find('.less-editor');
                try {
                    this.parser.parse(lessCode, $.proxy(function (err, tree) {
                        if (!err) {
                            $lessEditor.removeClass('error');
                            css = tree.toCSS();
                        } else {
                            $lessEditor.addClass('error');
                        }
                    }, this));
                } catch (e) {     
                    $lessEditor.addClass('error');
                    console.log(e); 
                }
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
            $('.editors-wrapper').show().removeClass('hidden');
            editorPair.setLess(less);
        } else {
            $('.editors-wrapper').addClass('hidden');
        }
    };

    $(document).bind('deck.change', function (event, from, to) {
        processSlide($.deck('getSlide', to));
    });

    processSlide($.deck('getSlide'));
});