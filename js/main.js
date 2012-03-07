$(function () {
    $.deck('.slide');

    less.watch();

    var createEditorPair = function (el) {
        ({
            init:function () {
                this.parser = new (less.Parser);

                var lessCode = $(el).text();
                var css = this.parseCss(lessCode);

                this.$el = $('<div class="editor-pair"><div class="less-wrapper"><div class="less-header">LESS</div></div><div class="css-wrapper"><div class="css-header">CSS</div></div></div>').replaceAll(el);

                this.lessEditor = CodeMirror(this.$el.find('.less-wrapper')[0], {
                    value: lessCode,
                    mode:'css',
                    onUpdate:this.syncEditors.bind(this)
                });

                this.cssEditor = CodeMirror(this.$el.find('.css-wrapper')[0], {
                    value:css,
                    mode:'css',
                    readOnly: true
                });
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

    $('.less').each(function (index, el) {
        createEditorPair(el);
    });

});